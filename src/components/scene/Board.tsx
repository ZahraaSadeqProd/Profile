import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { M } from "./materials";

// The embedded years: a processor board laid out like a real one. Copper, pads and silkscreen are painted into the
// board's top texture; the parts are geometry, the small repeated ones instanced. Units are metres; the board is
// a 32 x 22 cm evaluation board, so parts are drawn at life size.
const W = 0.32, D = 0.22, T = 0.0016 * 4; // board thickness exaggerated a little so its edge reads
const TOP = T / 2;

type Part = { x: number; z: number; w: number; d: number; h: number; r?: number };
const CPU: Part = { x: -0.045, z: -0.005, w: 0.04, d: 0.04, h: 0.0035 };          // 176-pin QFP processor
const DSP: Part = { x: 0.07, z: -0.045, w: 0.027, d: 0.027, h: 0.0028 };          // BGA DSP (no visible pins)
const RAM: Part[] = [{ x: 0.06, z: 0.03, w: 0.022, d: 0.011, h: 0.0012 }, { x: 0.06, z: 0.052, w: 0.022, d: 0.011, h: 0.0012 }];
const FLASH: Part = { x: -0.045, z: 0.07, w: 0.013, d: 0.009, h: 0.0016 };
const HDR = { x: -0.1, z: -0.095, n: 20 };                                       // 2 x 20 header along the top edge
const JTAG: Part = { x: 0.125, z: 0.07, w: 0.026, d: 0.01, h: 0.0085 };           // shrouded debug header
const RJ45: Part = { x: 0.142, z: -0.06, w: 0.022, d: 0.017, h: 0.0135 };          // network jack on the edge
const XTAL: Part = { x: -0.005, z: -0.048, w: 0.011, d: 0.0045, h: 0.0035 };
const CAPS = [[-0.115, 0.03], [-0.115, 0.055], [0.11, 0.0]] as const;             // electrolytics

/** copper, pads, vias and silkscreen, drawn in board coordinates (x right, z towards the viewer) */
function paint(g: CanvasRenderingContext2D, PX: number, PZ: number) {
  const X = (x: number) => ((x + W / 2) / W) * PX, Z = (z: number) => ((z + D / 2) / D) * PZ, S = PX / W;
  const mask = "#5e5e5e", copper = "#787878", pad = "#cfcfcf", silk = "#f2f2f2";
  g.fillStyle = mask; g.fillRect(0, 0, PX, PZ);
  // a faint ground pour with a clearance border
  g.fillStyle = "#636363"; g.fillRect(X(-0.15), Z(-0.1), 0.3 * S, 0.2 * S);
  g.fillStyle = mask; g.fillRect(X(-0.152), Z(-0.102), 0.004 * S, 0.204 * S);

  const trace = (pts: [number, number][], w = 0.0005) => {
    g.strokeStyle = copper; g.lineWidth = w * S; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
    pts.forEach(([x, z], i) => (i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z)))); g.stroke();
  };
  const via = (x: number, z: number) => {
    g.fillStyle = pad; g.beginPath(); g.arc(X(x), Z(z), 0.0007 * S, 0, 7); g.fill();
    g.fillStyle = "#3a3a3a"; g.beginPath(); g.arc(X(x), Z(z), 0.00032 * S, 0, 7); g.fill();
  };
  // processor fan-out: a bus from each side, bending 45 degrees towards its neighbour
  const half = CPU.w / 2 + 0.003;
  for (let i = 0; i < 16; i++) {
    const o = -0.015 + i * 0.002;
    // east to the DSP and RAM
    trace([[CPU.x + half, CPU.z + o], [CPU.x + half + 0.012, CPU.z + o], [CPU.x + half + 0.012 + 0.02, CPU.z + o - 0.02 + (i < 8 ? 0 : 0.045)], [0.045, CPU.z + o - 0.02 + (i < 8 ? 0 : 0.045)]]);
    // south to the flash
    if (i < 10) trace([[CPU.x + o, CPU.z + half], [CPU.x + o, CPU.z + half + 0.01], [FLASH.x - 0.005 + i * 0.001, FLASH.z - 0.008]]);
    // north to the header
    trace([[CPU.x + o, CPU.z - half], [CPU.x + o, CPU.z - half - 0.008], [HDR.x + 0.005 + i * 0.00508, HDR.z + 0.012], [HDR.x + 0.005 + i * 0.00508, HDR.z + 0.004]]);
    if (i % 3 === 0) via(CPU.x + half + 0.012 + 0.02, CPU.z + o - 0.02 + (i < 8 ? 0 : 0.045));
  }
  // west: power, to the electrolytics and regulators
  for (let i = 0; i < 5; i++) trace([[CPU.x - half, CPU.z - 0.01 + i * 0.005], [-0.095, CPU.z - 0.01 + i * 0.005], [-0.105, 0.03 + i * 0.006]], 0.0012);
  // differential pairs to the network jack
  for (let i = 0; i < 4; i++) {
    const z = DSP.z - 0.006 + i * 0.004;
    trace([[DSP.x + DSP.w / 2 + 0.002, z], [0.11, z], [0.122, RJ45.z - 0.006 + i * 0.004], [RJ45.x - RJ45.w / 2, RJ45.z - 0.006 + i * 0.004]], 0.0004);
  }
  // pads under every footprint
  const padsQFP = (p: Part, n: number) => {
    const pitch = (p.w - 0.006) / n;
    for (let i = 0; i < n; i++) {
      const o = -p.w / 2 + 0.003 + (i + 0.5) * pitch;
      g.fillStyle = pad;
      g.fillRect(X(p.x + o) - 0.00012 * S, Z(p.z - p.d / 2 - 0.0028), 0.00024 * S, 0.0024 * S);
      g.fillRect(X(p.x + o) - 0.00012 * S, Z(p.z + p.d / 2 + 0.0004), 0.00024 * S, 0.0024 * S);
      g.fillRect(X(p.x - p.w / 2 - 0.0028), Z(p.z + o) - 0.00012 * S, 0.0024 * S, 0.00024 * S);
      g.fillRect(X(p.x + p.w / 2 + 0.0004), Z(p.z + o) - 0.00012 * S, 0.0024 * S, 0.00024 * S);
    }
  };
  padsQFP(CPU, 44);
  // silkscreen: outlines, reference designators, pin-1 marks, the board name
  g.strokeStyle = silk; g.fillStyle = silk; g.lineWidth = 0.00025 * S;
  const box = (p: Part, label: string, lx = 0, lz = -0.004) => {
    g.strokeRect(X(p.x - p.w / 2 - 0.0015), Z(p.z - p.d / 2 - 0.0015), (p.w + 0.003) * S, (p.d + 0.003) * S);
    g.font = `600 ${0.0026 * S}px monospace`; g.fillText(label, X(p.x - p.w / 2 + lx), Z(p.z - p.d / 2 + lz));
  };
  box({ ...CPU, w: CPU.w + 0.006, d: CPU.d + 0.006 }, "U1", 0, -0.0025);
  box(DSP, "U2"); RAM.forEach((r, i) => box(r, `U${3 + i}`)); box(FLASH, "U5"); box(JTAG, "J2 JTAG"); box(RJ45, "J3");
  box(XTAL, "Y1");
  g.font = `600 ${0.0026 * S}px monospace`; g.fillText("J1", X(HDR.x - 0.008), Z(HDR.z + 0.001));
  CAPS.forEach(([x, z], i) => { g.beginPath(); g.arc(X(x), Z(z), 0.0055 * S, 0, 7); g.stroke(); g.fillText(`C${10 + i}`, X(x + 0.007), Z(z)); });
  g.beginPath(); g.arc(X(CPU.x - CPU.w / 2 - 0.004), Z(CPU.z - CPU.d / 2 - 0.004), 0.0008 * S, 0, 7); g.fill();
  g.font = `700 ${0.0045 * S}px monospace`; g.fillText("MPC-EVB  REV C", X(-0.14), Z(0.098));
  g.font = `500 ${0.0028 * S}px monospace`; g.fillText("ASSY 4410-02   2021", X(0.04), Z(0.098));
  // mounting holes, plated
  [[-0.15, -0.1], [0.15, -0.1], [-0.15, 0.1], [0.15, 0.1]].forEach(([x, z]) => {
    g.fillStyle = pad; g.beginPath(); g.arc(X(x), Z(z), 0.0042 * S, 0, 7); g.fill();
    g.fillStyle = "#1a1a1a"; g.beginPath(); g.arc(X(x), Z(z), 0.0024 * S, 0, 7); g.fill();
  });
}

/** many identical small parts in one draw */
function Instances({ geo, mat, items }: { geo: THREE.BufferGeometry; mat: THREE.Material; items: [number, number, number, number?][] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), one = new THREE.Vector3(1, 1, 1);
    items.forEach(([x, y, z, r = 0], i) => { q.setFromEuler(e.set(0, r, 0)); ref.current!.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, z), q, one)); });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={ref} args={[geo, mat, items.length]} castShadow receiveShadow />;
}

function Chip({ p, m = M.black }: { p: Part; m?: THREE.Material }) {
  return (
    <mesh position={[p.x, TOP + p.h / 2, p.z]} castShadow receiveShadow material={m}>
      <boxGeometry args={[p.w, p.h, p.d]} />
    </mesh>
  );
}

export function Board() {
  const top = useMemo(() => {
    if (typeof document === "undefined") return M.board;
    const c = document.createElement("canvas"); c.width = 2560; c.height = Math.round((2560 * D) / W);
    paint(c.getContext("2d")!, c.width, c.height);
    const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshLambertMaterial({ map: t });
  }, []);
  const parts = useMemo(() => {
    const pin: [number, number, number, number?][] = [];
    // gull-wing leads round the processor: 44 a side
    const n = 44, pitch = (CPU.w - 0.006) / n;
    for (let i = 0; i < n; i++) {
      const o = -CPU.w / 2 + 0.003 + (i + 0.5) * pitch;
      pin.push([CPU.x + o, TOP + 0.0005, CPU.z - CPU.d / 2 - 0.0012], [CPU.x + o, TOP + 0.0005, CPU.z + CPU.d / 2 + 0.0012]);
      pin.push([CPU.x - CPU.w / 2 - 0.0012, TOP + 0.0005, CPU.z + o, Math.PI / 2], [CPU.x + CPU.w / 2 + 0.0012, TOP + 0.0005, CPU.z + o, Math.PI / 2]);
    }
    // TSOP memory leads on the long sides
    const tsop: [number, number, number, number?][] = [];
    for (const r of [...RAM, FLASH]) {
      const k = r === FLASH ? 8 : 22;
      for (let i = 0; i < k; i++) {
        const x = r.x - r.w / 2 + ((i + 0.5) * r.w) / k;
        tsop.push([x, TOP + 0.0004, r.z - r.d / 2 - 0.0009], [x, TOP + 0.0004, r.z + r.d / 2 + 0.0009]);
      }
    }
    // header pins (2 x 20, 2.54 mm) and the debug header's pins
    const hp: [number, number, number, number?][] = [];
    for (let i = 0; i < HDR.n; i++) for (const row of [0, 0.00254]) hp.push([HDR.x + i * 0.00254, TOP + 0.0055, HDR.z + row]);
    for (let i = 0; i < 10; i++) for (const row of [-0.00127, 0.00127]) hp.push([JTAG.x - 0.0114 + i * 0.00254, TOP + 0.0055, JTAG.z + row]);
    // 0603 passives: decoupling round the processor and DSP, plus a resistor row
    const smd: [number, number, number, number?][] = [];
    for (let i = 0; i < 12; i++) {
      const o = -0.018 + i * 0.0033;
      smd.push([CPU.x + o, TOP + 0.0004, CPU.z - CPU.d / 2 - 0.0065], [CPU.x - CPU.w / 2 - 0.0065, TOP + 0.0004, CPU.z + o, Math.PI / 2]);
    }
    for (let i = 0; i < 6; i++) smd.push([DSP.x - 0.01 + i * 0.004, TOP + 0.0004, DSP.z + DSP.d / 2 + 0.004]);
    for (let i = 0; i < 10; i++) smd.push([-0.12 + i * 0.0035, TOP + 0.0004, -0.03, Math.PI / 2]);
    return { pin, tsop, hp, smd };
  }, []);
  const geo = useMemo(() => ({
    pin: new THREE.BoxGeometry(0.00028, 0.0006, 0.0024),
    tsop: new THREE.BoxGeometry(0.0003, 0.0005, 0.0014),
    hp: new THREE.BoxGeometry(0.00064, 0.006, 0.00064),
    smd: new THREE.BoxGeometry(0.0016, 0.0008, 0.0008),
  }), []);
  const edge = useMemo(() => [M.dark, M.dark, top, M.dark, M.dark, M.dark], [top]);
  return (
    <group position={[0.684, 0.738, -1.28]} rotation={[0, -0.35, 0]}>
      <mesh material={edge} castShadow receiveShadow><boxGeometry args={[W, T, D]} /></mesh>
      <Chip p={CPU} />
      <Chip p={DSP} />
      {RAM.map((r, i) => <Chip key={i} p={r} />)}
      <Chip p={FLASH} />
      <Instances geo={geo.pin} mat={M.light} items={parts.pin} />
      <Instances geo={geo.tsop} mat={M.light} items={parts.tsop} />
      <Instances geo={geo.hp} mat={M.light} items={parts.hp} />
      <Instances geo={geo.smd} mat={M.mid} items={parts.smd} />
      {/* header bodies */}
      <mesh position={[HDR.x + ((HDR.n - 1) * 0.00254) / 2, TOP + 0.00125, HDR.z + 0.00127]} material={M.black} castShadow>
        <boxGeometry args={[HDR.n * 0.00254, 0.0025, 0.00508]} />
      </mesh>
      <mesh position={[JTAG.x, TOP + 0.0045, JTAG.z]} material={M.black} castShadow receiveShadow>
        <boxGeometry args={[JTAG.w, 0.009, JTAG.d]} />
      </mesh>
      {/* network jack: a metal can with a dark mouth */}
      <mesh position={[RJ45.x, TOP + RJ45.h / 2, RJ45.z]} material={M.light} castShadow receiveShadow>
        <boxGeometry args={[RJ45.w, RJ45.h, RJ45.d]} />
      </mesh>
      <mesh position={[RJ45.x + RJ45.w / 2 + 0.0002, TOP + RJ45.h * 0.45, RJ45.z]} material={M.black}>
        <boxGeometry args={[0.0006, RJ45.h * 0.55, RJ45.d * 0.62]} />
      </mesh>
      {/* crystal can */}
      <mesh position={[XTAL.x, TOP + XTAL.h / 2, XTAL.z]} material={M.light} castShadow>
        <capsuleGeometry args={[XTAL.d / 2, XTAL.w - XTAL.d, 4, 12]} />
      </mesh>
      {/* electrolytics with their vent cross and polarity band */}
      {CAPS.map(([x, z], i) => (
        <group key={i} position={[x, TOP, z]}>
          <mesh position={[0, 0.005, 0]} material={M.mid} castShadow receiveShadow><cylinderGeometry args={[0.005, 0.005, 0.01, 28]} /></mesh>
          <mesh position={[0, 0.0101, 0]} material={M.light}><cylinderGeometry args={[0.0046, 0.0046, 0.0004, 28]} /></mesh>
          <mesh position={[-0.0035, 0.005, 0]} material={M.dark}><boxGeometry args={[0.0032, 0.0098, 0.0058]} /></mesh>
        </group>
      ))}
      {/* power and status LEDs */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.1 + i * 0.006, TOP + 0.0005, 0.09]} material={i === 0 ? M.paper : M.light}>
          <boxGeometry args={[0.0016, 0.001, 0.0008]} />
        </mesh>
      ))}
    </group>
  );
}
