import { useEffect, useMemo } from "react";
import * as THREE from "three";

// The mug and the arm lamp, modelled here rather than in the room build, which made them from bare cylinders
// (tools/figure/room.py; 3_props.py cuts those out). Study units, metres, y up; blender (x, y, z) is (x, z, -y) here.
// The print pass only outlines big depth jumps, so each part carries an ink hull: a copy pushed out along its normals
// and drawn from the back, which reads as a line round its silhouette.
const DESK = 0.61;
const INK = "#06281a";
const HULL = 0.0016;

function hull(src: THREE.BufferGeometry, t = HULL) {
  const g = src.clone(); g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, p.getX(i) + n.getX(i) * t, p.getY(i) + n.getY(i) * t, p.getZ(i) + n.getZ(i) * t);
  return g;
}

type Part = { geo: THREE.BufferGeometry; mat: THREE.Material; at?: THREE.Vector3; q?: THREE.Quaternion; outline?: boolean };

function Parts({ parts, ink }: { parts: Part[]; ink: THREE.Material }) {
  const hulls = useMemo(() => parts.map((p) => (p.outline === false ? null : hull(p.geo))), [parts]);
  useEffect(() => () => { parts.forEach((p) => p.geo.dispose()); hulls.forEach((h) => h?.dispose()); }, [parts, hulls]);
  return (
    <>
      {parts.map((p, i) => (
        <group key={i} position={p.at} quaternion={p.q}>
          <mesh geometry={p.geo} material={p.mat} castShadow receiveShadow />
          {hulls[i] && <mesh geometry={hulls[i]!} material={ink} />}
        </group>
      ))}
    </>
  );
}

const up = new THREE.Vector3(0, 1, 0);
const along = (dir: THREE.Vector3) => new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());

// a rod from a to b
function rod(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material): Part {
  const d = b.clone().sub(a);
  return { geo: new THREE.CylinderGeometry(r, r, d.length(), 14), mat, at: a.clone().addScaledVector(d, 0.5), q: along(d) };
}

// a coil spring from a to b
function spring(a: THREE.Vector3, b: THREE.Vector3, mat: THREE.Material): Part {
  const d = b.clone().sub(a), L = d.length(), turns = 14, R = 0.0055;
  const pts = Array.from({ length: turns * 12 + 1 }, (_, i) => {
    const t = i / (turns * 12), a2 = t * turns * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a2) * R, t * L - L / 2, Math.sin(a2) * R);
  });
  return { geo: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns * 24, 0.0012, 6), mat, at: a.clone().addScaledVector(d, 0.5), q: along(d), outline: false };
}

function useMaterials() {
  const m = useMemo(() => ({
    ink: new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }),
    china: new THREE.MeshLambertMaterial({ color: "#e4e4e4" }),
    coffee: new THREE.MeshLambertMaterial({ color: "#2a2a2a" }),
    metal: new THREE.MeshLambertMaterial({ color: "#3a3a3a" }),
    joint: new THREE.MeshLambertMaterial({ color: "#4a4a4a" }),
    inside: new THREE.MeshLambertMaterial({ color: "#d6d6d6", side: THREE.BackSide }),
    bulb: new THREE.MeshBasicMaterial({ color: "#f6f6f6" }),
  }), []);
  useEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m]);
  return m;
}

function Mug({ m }: { m: ReturnType<typeof useMaterials> }) {
  const parts = useMemo<Part[]>(() => {
    // body: a lathe with a real wall, a rolled rim and a foot
    const profile = [[0, 0], [0.034, 0], [0.038, 0.003], [0.0395, 0.012], [0.041, 0.088], [0.0415, 0.093], [0.0405, 0.0955],
      [0.0375, 0.0955], [0.0365, 0.092], [0.0355, 0.012], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
    const body = new THREE.LatheGeometry(profile, 56);
    // the handle: a D-shaped loop on the +x side
    const loop = new THREE.CatmullRomCurve3([[0.038, 0.078], [0.062, 0.08], [0.074, 0.06], [0.072, 0.036], [0.058, 0.022], [0.039, 0.022]]
      .map(([x, y]) => new THREE.Vector3(x, y, 0)));
    const handle = new THREE.TubeGeometry(loop, 40, 0.0055, 12);
    const coffee = new THREE.CircleGeometry(0.0358, 40).rotateX(-Math.PI / 2).translate(0, 0.078, 0);
    return [{ geo: body, mat: m.china }, { geo: handle, mat: m.china }, { geo: coffee, mat: m.coffee, outline: false }];
  }, [m]);
  return (
    <group position={[-0.13, DESK, 0.7]} rotation={[0, THREE.MathUtils.degToRad(-25), 0]}>
      <Parts parts={parts} ink={m.ink} />
    </group>
  );
}

// joints of the arm, from room.py: base, elbow, and the knuckle the shade hangs from
const A1 = new THREE.Vector3(-0.48, DESK + 0.035, 0.92);
const A2 = new THREE.Vector3(-0.43, DESK + 0.44, 0.82);
const A3 = new THREE.Vector3(-0.47, DESK + 0.38, 0.56);
const AIM = new THREE.Vector3(0.05, -1, -0.62).normalize();  // where the shade opens: down onto the desk, towards her, tipped enough that the camera sees its lit inside

function Lamp({ m }: { m: ReturnType<typeof useMaterials> }) {
  const parts = useMemo<Part[]>(() => {
    const out: Part[] = [];
    // weighted base with a rounded edge, and the pivot block on it
    const base = new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.075, 0.004], [0.075, 0.014], [0.07, 0.02], [0, 0.02]]
      .map(([x, y]) => new THREE.Vector2(x, y)), 48);
    out.push({ geo: base, mat: m.metal, at: new THREE.Vector3(A1.x, DESK, A1.z) });
    out.push({ geo: new THREE.BoxGeometry(0.03, 0.022, 0.03), mat: m.joint, at: new THREE.Vector3(A1.x, DESK + 0.03, A1.z) });
    // each arm is a pair of rods either side of the joint, with a spring alongside the lower one
    const side = new THREE.Vector3(0.011, 0, 0);
    for (const [a, b] of [[A1, A2], [A2, A3]] as const) for (const s of [-1, 1]) out.push(rod(a.clone().addScaledVector(side, s), b.clone().addScaledVector(side, s), 0.0042, m.metal));
    const d = A2.clone().sub(A1);
    const off = new THREE.Vector3(0, 0, 0.022);
    out.push(spring(A1.clone().addScaledVector(d, 0.12).add(off), A1.clone().addScaledVector(d, 0.62).add(off), m.metal));
    // joint drums, across the arm
    const across = along(new THREE.Vector3(1, 0, 0));
    for (const p of [A1, A2, A3]) out.push({ geo: new THREE.CylinderGeometry(0.014, 0.014, 0.034, 20), mat: m.joint, at: p, q: across });
    // the shade: a domed cone with a rolled lip, dark outside and pale inside, and the bulb
    const shade = [[0.012, 0], [0.026, 0.006], [0.034, 0.03], [0.05, 0.075], [0.07, 0.11], [0.074, 0.114]].map(([x, y]) => new THREE.Vector2(x, y));
    const q = along(AIM);
    const at = A3.clone().addScaledVector(AIM, 0.012);
    out.push({ geo: new THREE.LatheGeometry(shade, 48), mat: m.metal, at, q });
    out.push({ geo: new THREE.LatheGeometry(shade, 48), mat: m.inside, at, q, outline: false });
    out.push({ geo: new THREE.SphereGeometry(0.021, 20, 14), mat: m.bulb, at: at.clone().addScaledVector(AIM, 0.07), outline: false });
    return out;
  }, [m]);
  return <Parts parts={parts} ink={m.ink} />;
}

export function Desk() {
  const m = useMaterials();
  return (
    <>
      <Mug m={m} />
      <Lamp m={m} />
    </>
  );
}
