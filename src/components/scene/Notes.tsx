import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";

// The six sheets pinned to the board behind the monitor (tools/figure/room.py), drawn over the blank ones baked into
// study.glb; the two project posters in the top row are where the camera stops for the Nesvia and Swazona Media
// chapters (Workbench.tsx). Study units (y up); a sheet's x and height and its tilt in the wall plane were measured from the build.
// The camera sees the board from -z, where blender +x reads right to left, so each row is listed left to right as
// seen. Only luminance survives the print pass: pale paper, dark ink, a few mid-grey fills.
const WALL = 1.2955 - 0.0008;  // just proud of the baked sheets
const SIZE: [number, number] = [0.15, 0.2];
const INK = "#262626", MID = "#8a8a8a", PAPER = "#efefef";

type Draw = (g: CanvasRenderingContext2D, W: number, H: number, hand: string, display: string) => void;
const SHEETS: { x: number; y: number; tilt: number; draw: Draw }[] = [
  { x: -0.0018, y: 1.3, tilt: 5.1, draw: network },
  { x: -0.2692, y: 1.3, tilt: -5.05, draw: nesvia },
  { x: -0.4938, y: 1.3, tilt: -2.23, draw: swazona },
  { x: -0.0074, y: 1.07, tilt: -0.35, draw: loss },
  { x: -0.248, y: 1.07, tilt: -1.7, draw: zahraa },
  { x: -0.5065, y: 1.07, tilt: -1.87, draw: chain },
];

const font = (name: string, fallback: string) =>
  (getComputedStyle(document.querySelector(".app") ?? document.body).getPropertyValue(name).trim() || fallback) + ", " + fallback;

function title(g: CanvasRenderingContext2D, text: string, W: number, hand: string) {
  g.fillStyle = INK; g.font = `700 76px ${hand}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillText(text, W / 2, 120, W * 0.86);
}

// a small MLP, hand-drawn: three layers, every edge, one path picked out
function network(g: CanvasRenderingContext2D, W: number, H: number, hand: string) {
  title(g, "MLP", W, hand);
  const cols = [[0.25, 0.4, 0.55, 0.7, 0.85], [0.32, 0.5, 0.68, 0.86], [0.5, 0.68]];
  const xs = [0.2, 0.5, 0.8];
  const P = (i: number, y: number) => [xs[i] * W, 0.16 * H + y * 0.8 * H] as const;
  g.lineWidth = 3; g.strokeStyle = MID;
  for (let i = 0; i < 2; i++) for (const a of cols[i]) for (const b of cols[i + 1]) {
    const [x0, y0] = P(i, a), [x1, y1] = P(i + 1, b); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  }
  g.lineWidth = 9; g.strokeStyle = INK; g.beginPath();
  g.moveTo(...P(0, 0.55)); g.lineTo(...P(1, 0.5)); g.lineTo(...P(2, 0.68)); g.stroke();
  cols.forEach((c, i) => c.forEach((y) => {
    const [x, yy] = P(i, y); g.beginPath(); g.arc(x, yy, 26, 0, Math.PI * 2);
    g.fillStyle = PAPER; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
  }));
}

// the two products' own marks (copied from their repos into public/brand), drawn once loaded
const BRAND: Record<string, HTMLImageElement> = {};
const brand = (src: string) => {
  if (!BRAND[src]) { const i = new Image(); i.src = src; BRAND[src] = i; }
  return BRAND[src];
};
const loaded = (i: HTMLImageElement) => (i.complete ? Promise.resolve() : new Promise<void>((r) => { i.addEventListener("load", () => r()); i.addEventListener("error", () => r()); }));
// fit an image into a box, centred
function place(g: CanvasRenderingContext2D, i: HTMLImageElement, cx: number, cy: number, w: number, h: number) {
  if (!i.complete || !i.naturalWidth) return;
  const k = Math.min(w / i.naturalWidth, h / i.naturalHeight);
  g.drawImage(i, cx - (i.naturalWidth * k) / 2, cy - (i.naturalHeight * k) / 2, i.naturalWidth * k, i.naturalHeight * k);
}

// Nesvia: the pineapple mark over the hand-lettered wordmark
function nesvia(g: CanvasRenderingContext2D, W: number, H: number, hand: string) {
  // its peach tiles are pale enough to vanish into the paper in the print pass; darken them a step
  g.filter = "brightness(0.68) contrast(1.25)";
  place(g, brand("/brand/nesvia-mark.svg"), W / 2, H * 0.38, W * 0.62, H * 0.44);
  g.filter = "none";
  place(g, brand("/brand/nesvia-wordmark.svg"), W / 2, H * 0.73, W * 0.78, H * 0.16);
  g.fillStyle = MID; g.font = `700 46px ${hand}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillText("nesvia.app", W / 2, H - 50);
}

// Swazona Media: its 2026 logo, mark and wordmark together
function swazona(g: CanvasRenderingContext2D, W: number, H: number, hand: string) {
  place(g, brand("/brand/swazona-media-logo.png"), W / 2, H * 0.47, W * 0.84, H * 0.4);
  g.fillStyle = MID; g.font = `700 46px ${hand}`; g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.fillText("swazona.media", W / 2, H - 50);
}

// a training run: train keeps falling, val turns, a ring on the turn
function loss(g: CanvasRenderingContext2D, W: number, H: number, hand: string) {
  title(g, "loss", W, hand);
  const L = 90, R = W - 60, T = 180, B = H - 140;
  g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.moveTo(L, T); g.lineTo(L, B); g.lineTo(R, B); g.stroke();
  const curve = (f: (t: number) => number, w: number, c: string, dash: number[]) => {
    g.lineWidth = w; g.strokeStyle = c; g.setLineDash(dash); g.beginPath();
    for (let i = 0; i <= 40; i++) { const t = i / 40; const x = L + 10 + t * (R - L - 20), y = T + (B - T) * (1 - f(t)); i ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke(); g.setLineDash([]);
  };
  curve((t) => 0.08 + 0.85 * Math.exp(-4 * t), 9, INK, []);
  curve((t) => 0.2 + 0.75 * Math.exp(-4.5 * t) + 0.35 * Math.max(0, t - 0.5) ** 2, 7, MID, [22, 14]);
  const tx = L + 10 + 0.5 * (R - L - 20), ty = T + (B - T) * (1 - (0.2 + 0.75 * Math.exp(-2.25)));
  g.lineWidth = 6; g.strokeStyle = INK; g.beginPath(); g.ellipse(tx, ty, 50, 38, 0, 0, Math.PI * 2); g.stroke();
  g.fillStyle = INK; g.font = `700 54px ${hand}`; g.textAlign = "center"; g.fillText("stop here", tx, ty - 60);
  g.font = `700 50px ${hand}`; g.textAlign = "left"; g.fillText("train", L + 20, B + 70); g.fillStyle = MID; g.fillText("val", L + 180, B + 70);
}

// her name in Arabic, a framed print; set high, since the monitor hides the lower half of the bottom row
function zahraa(g: CanvasRenderingContext2D, W: number, H: number) {
  g.lineWidth = 8; g.strokeStyle = INK; g.strokeRect(36, 36, W - 72, H - 72);
  g.lineWidth = 3; g.strokeRect(56, 56, W - 112, H - 112);
  g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle"; g.direction = "rtl";
  g.font = `700 230px "Geeza Pro", "Noto Naskh Arabic", "Amiri", "Traditional Arabic", serif`;
  g.fillText("زهراء", W / 2, H * 0.3, W * 0.8);
  g.direction = "ltr"; g.fillStyle = MID;
  for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(W / 2 + i * 34, H * 0.5, 9, 0, Math.PI * 2); g.fill(); }
}

// backprop, the chain rule on a two-node graph
function chain(g: CanvasRenderingContext2D, W: number, H: number, hand: string) {
  title(g, "backprop", W, hand);
  const node = (x: number, y: number, t: string) => {
    g.beginPath(); g.arc(x, y, 50, 0, Math.PI * 2); g.fillStyle = PAPER; g.fill(); g.lineWidth = 7; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.font = `700 60px ${hand}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(t, x, y + 4);
  };
  const y = 300;
  g.lineWidth = 7; g.strokeStyle = INK; g.beginPath(); g.moveTo(140, y); g.lineTo(W - 140, y); g.stroke();
  g.strokeStyle = MID; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.arc(W / 2, y + 40, 200, 0.25 * Math.PI, 0.75 * Math.PI); g.stroke(); g.setLineDash([]);
  node(110, y, "w"); node(W / 2, y, "z"); node(W - 110, y, "L");
  g.fillStyle = INK; g.textBaseline = "alphabetic"; g.font = `700 64px ${hand}`;
  g.fillText("∂L/∂w =", W / 2, 540);
  g.fillText("∂L/∂z · ∂z/∂w", W / 2, 630, W * 0.9);
  g.font = `700 50px ${hand}`; g.fillStyle = MID; g.fillText("w ← w − η ∂L/∂w", W / 2, 730, W * 0.9);
}

function sheetTexture(draw: Draw) {
  const W = 600, H = 800, R = 2;  // drawn in 600 x 800 units at R times the pixels, for the camera's close-ups
  const c = document.createElement("canvas"); c.width = W * R; c.height = H * R;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const paint = () => {
    const g = c.getContext("2d")!;
    g.setTransform(R, 0, 0, R, 0, 0); g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    g.lineCap = "round"; g.lineJoin = "round";
    draw(g, W, H, font("--font-hand", "cursive"), font("--font-display", "Arial Narrow, sans-serif"));
    // the pin
    g.fillStyle = INK; g.beginPath(); g.arc(W / 2, 34, 16, 0, Math.PI * 2); g.fill();
    tex.needsUpdate = true;
  };
  paint();
  document.fonts?.ready.then(paint);
  Promise.all(Object.values(BRAND).map(loaded)).then(paint);
  return tex;
}

export function Notes() {
  const [ready, setReady] = useState(false);
  const aim = useMemo(() => { const o = new THREE.Object3D(); o.position.set(-0.25, 1.2, WALL); return o; }, []);
  useEffect(() => setReady(true), []);
  const mats = useMemo(() => (ready ? SHEETS.map((s) => new THREE.MeshLambertMaterial({ map: sheetTexture(s.draw) })) : []), [ready]);
  useEffect(() => () => mats.forEach((m) => { m.map?.dispose(); m.dispose(); }), [mats]);
  if (!ready) return null;
  // a plane faces +z; turn it to face the camera at -z, then tilt it in the wall plane as measured
  return (
    <group>
      {/* the board sits in the room's shade; a soft light on it lets the paper print pale in the camera's close-ups */}
      <spotLight position={[-0.25, 1.78, 0.62]} target={aim} intensity={5.5} angle={0.5} penumbra={1} distance={0} decay={2} />
      <primitive object={aim} />
      {SHEETS.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, WALL]} rotation={[0, Math.PI, THREE.MathUtils.degToRad(-s.tilt)]} material={mats[i]} receiveShadow>
          <planeGeometry args={SIZE} />
          <Edges color="#06281a" lineWidth={1.2} threshold={20} />
        </mesh>
      ))}
    </group>
  );
}
