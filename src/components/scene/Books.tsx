import { useEffect, useMemo, useState } from "react";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

// The stack on the desk, left of the monitor, with titles on the spines that face the camera and on the top cover.
// Study units (y up, the desk towards +z); the blank stack baked into study.glb was cut out for these
// (tools/figure/girl/3_props.py). Only luminance survives the print pass, so pale books carry dark type and dark
// books pale type.
const DESK = 0.61;
const AT: [number, number] = [0.75, 0.93];
const BOOKS = [
  { title: "DEEP LEARNING", w: 0.26, t: 0.046, pale: true, yaw: 4 },
  { title: "ALGORITHMS", w: 0.24, t: 0.04, pale: false, yaw: -6 },
  { title: "MACHINE LEARNING", w: 0.25, t: 0.036, pale: true, yaw: 7 },
  { title: "DATA STRUCTURES", w: 0.22, t: 0.036, pale: false, yaw: -3 },
];
const DEPTH = 0.17;
const BOARD = 0.004;  // cover board thickness
const INSET = 0.005;  // how far the boards overhang the page block
const INK = "#06281a";
const EDGE = 1.4;     // outline width, in CSS pixels

// the page block's sides: fine lines along the pages, so the block reads as paper rather than a solid
function pagesTexture() {
  const c = document.createElement("canvas"); c.width = 64; c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ededed"; g.fillRect(0, 0, 64, 256);
  g.fillStyle = "#bcbcbc";
  for (let y = 3; y < 256; y += 6 + (y % 5)) g.fillRect(0, y, 64, 1);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

// next/font hashes the family name; read it from the variable the page sets
const DISPLAY = () =>
  (getComputedStyle(document.querySelector(".app") ?? document.body).getPropertyValue("--font-display").trim() || "Arial Narrow") +
  ", Arial Narrow, sans-serif";

function label(title: string, w: number, h: number, pale: boolean, cover: boolean) {
  const W = 1024, H = Math.round((W * h) / w);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  // the stack faces the camera across the desk, so the cover's +y face reads upside down unless turned
  if (cover) { tex.center.set(0.5, 0.5); tex.rotation = Math.PI; }
  const draw = () => {
    const g = c.getContext("2d")!;
    const bg = pale ? "#e6e6e6" : "#363636", fg = pale ? "#262626" : "#f2f2f2";
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = fg;
    if (cover) {
      // a rule above and below a centred title, like a textbook cover
      const size = Math.round(W * 0.09);
      g.font = `700 ${size}px ${DISPLAY()}`; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillRect(W * 0.12, H * 0.3, W * 0.76, size * 0.08); g.fillRect(W * 0.12, H * 0.7, W * 0.76, size * 0.08);
      g.fillText(title, W / 2, H / 2, W * 0.76);
    } else {
      // spine: bands at both ends and the title filling most of the height
      g.fillRect(W * 0.03, 0, W * 0.02, H); g.fillRect(W * 0.95, 0, W * 0.02, H);
      g.font = `700 ${Math.round(H * 0.62)}px ${DISPLAY()}`; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(title, W / 2, H * 0.54, W * 0.8);
    }
    tex.needsUpdate = true;
  };
  draw();
  document.fonts?.ready.then(draw);
  return tex;
}

// One hardcover: two boards and a spine around an inset page block, each outlined in ink. The print pass only draws
// edges at big depth jumps, which a stack of books on a desk never has.
function Book({ b, top, at }: { b: (typeof BOOKS)[number]; top: boolean; at: number }) {
  const m = useMemo(() => {
    const plain = new THREE.MeshLambertMaterial({ color: b.pale ? "#e6e6e6" : "#363636" });
    const spine = new THREE.MeshLambertMaterial({ map: label(b.title, b.w, b.t, b.pale, false) });
    const cover = top ? new THREE.MeshLambertMaterial({ map: label(b.title, b.w, DEPTH, b.pale, true) }) : plain;
    const tex = pagesTexture(); tex.repeat.set(1, (b.t - 2 * BOARD) / 0.03);
    const pages = new THREE.MeshLambertMaterial({ map: tex });
    // BoxGeometry faces: +x, -x, +y, -y, +z, -z; the camera looks at the -z side
    return { plain, spine: [plain, plain, plain, plain, plain, spine], board: [plain, plain, cover, plain, plain, plain], pages: [pages, pages, plain, plain, pages, plain], all: [plain, spine, cover, pages] };
  }, [b, top]);
  useEffect(() => () => m.all.forEach((x) => { x.map?.dispose(); x.dispose(); }), [m]);
  const inner = b.t - 2 * BOARD;
  const pd = DEPTH - BOARD - INSET;  // page block depth, from the spine to just short of the fore edge
  const edges = <Edges color={INK} lineWidth={EDGE} threshold={20} />;
  return (
    <group position={[0, at + b.t / 2, 0]} rotation={[0, THREE.MathUtils.degToRad(b.yaw), 0]}>
      {[-1, 1].map((sgn) => (
        <mesh key={sgn} position={[0, sgn * (b.t - BOARD) / 2, 0]} material={sgn > 0 ? m.board : m.plain} castShadow receiveShadow>
          <boxGeometry args={[b.w, BOARD, DEPTH]} />{edges}
        </mesh>
      ))}
      <mesh position={[0, 0, -DEPTH / 2 + BOARD / 2]} material={m.spine} castShadow receiveShadow>
        <boxGeometry args={[b.w, inner, BOARD]} />{edges}
      </mesh>
      <mesh position={[0, 0, -DEPTH / 2 + BOARD + pd / 2]} material={m.pages} castShadow receiveShadow>
        <boxGeometry args={[b.w - 2 * INSET, inner, pd]} />{edges}
      </mesh>
    </group>
  );
}

export function Books() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  let y = DESK;
  return (
    <group position={[AT[0], 0, AT[1]]}>
      {BOOKS.map((b, i) => {
        const at = y; y += b.t;
        return <Book key={b.title} b={b} top={i === BOOKS.length - 1} at={at} />;
      })}
    </group>
  );
}
