import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { story, range, type ChapterId } from "./story";
import { Workstation } from "./Room";

/* ---------------- camera path ---------------- */

const at = (id: ChapterId, f: number) => {
  const [a, b] = range(id);
  return a + (b - a) * f;
};
type Key = { p: number; pos: [number, number, number]; tgt: [number, number, number] };
const KEYS: Key[] = [
  { p: 0, pos: [-1.75, 2.2, 1.95], tgt: [0.15, 0.85, -1.3] },
  { p: at("hero", 1), pos: [-1.6, 2.0, 1.3], tgt: [0.12, 0.9, -1.4] },
  { p: at("shoulder", 1), pos: [-0.5, 1.6, -0.08], tgt: [0.06, 0.95, -1.55] },
  // over her shoulder at the screen while the Sappers Group panel is up, then down to the board as the Raytheon panel
  // slides in. A panel leaves once its section's bottom passes 105% to 80% of the viewport (pages/index.tsx), about
  // halfway through a 2-viewport chapter, and the next panel rises over the half after that.
  { p: at("sappers", 0.15), pos: [-0.42, 1.42, -0.62], tgt: [0.0, 1.14, -1.6] },
  { p: at("sappers", 0.5), pos: [-0.34, 1.39, -0.7], tgt: [0.02, 1.13, -1.6] },
  { p: at("sappers", 0.68), pos: [0.3, 1.66, -0.78], tgt: [0.4, 0.9, -1.35] },  // up and over her head, not through it
  { p: at("sappers", 0.85), pos: [0.86, 1.18, -0.86], tgt: [0.684, 0.74, -1.28] },
  { p: at("raytheon", 0.45), pos: [0.92, 1.08, -0.94], tgt: [0.684, 0.74, -1.3] },
  // then up to the pin board above the monitor, where the projects hang, and in to each poster in turn. Posters are
  // pinned in Notes.tsx; their world centres follow from the Study transform (x -> 0.12 - 1.2x, y -> 1.2y, z -> -0.68 - 1.2z)
  { p: at("raytheon", 0.75), pos: [0.42, 1.56, -1.2], tgt: [0.42, 1.42, -2.26] },
  { p: at("nesvia", 0), pos: [0.443, 1.6, -1.62], tgt: [0.443, 1.56, -2.24] },
  { p: at("nesvia", 0.5), pos: [0.443, 1.59, -1.66], tgt: [0.443, 1.56, -2.24] },
  { p: at("nesvia", 0.8), pos: [0.713, 1.6, -1.62], tgt: [0.713, 1.56, -2.24] },
  { p: at("swazona", 0.5), pos: [0.713, 1.59, -1.66], tgt: [0.713, 1.56, -2.24] },
  // and back out to the room
  { p: at("finale", 0.55), pos: [-0.8, 1.6, 0.3], tgt: [-0.2, 0.95, -1.45] },
  { p: 1, pos: [-1.0, 1.12, -0.95], tgt: [-0.45, 0.92, -1.62] },
];
const smooth = (x: number) => x * x * (3 - 2 * x);
const HERO_END = range("hero")[1];

function CameraRig() {
  const camera = useThree((s) => s.camera);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const tgt = useMemo(() => new THREE.Vector3(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const size = useThree((s) => s.size);
  const lastShift = useRef(-1);
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, []);
  useFrame((_, dt) => {
    // ease toward the scroll target (Lenis already smooths; this removes residual jitter)
    story.p += (story.target - story.p) * Math.min(1, dt * 6);
    const p = story.p;
    let i = 0;
    while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
    const k0 = KEYS[i], k1 = KEYS[i + 1];
    const raw = Math.min(1, Math.max(0, (p - k0.p) / Math.max(1e-6, k1.p - k0.p)));
    const t = story.reduced ? (raw < 0.5 ? 0 : 1) : smooth(raw);
    pos.copy(a.set(...k0.pos)).lerp(b.set(...k1.pos), t);
    tgt.copy(a.set(...k0.tgt)).lerp(b.set(...k1.tgt), t);
    if (!story.reduced) {
      pos.x += pointer.current.x * 0.04;
      pos.y -= pointer.current.y * 0.025;
    }
    camera.position.copy(pos);
    camera.lookAt(tgt);
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width, h = size.height;
    // x: make room for the chapter panels; y: centre the scene in the hero's lower window while the frame is closed
    const shiftX = w > 860 ? Math.min(1, Math.max(0, (p - HERO_END) / 0.03)) * w * 0.17 : 0;
    const shiftY = (1 - story.open) * h * 0.25;
    const key = Math.round(shiftX) * 10000 + Math.round(shiftY);
    if (key !== lastShift.current) {
      lastShift.current = key;
      if (shiftX > 0 || shiftY > 0) cam.setViewOffset(w, h, -shiftX, -shiftY, w, h);
      else cam.clearViewOffset();
    }
  });
  return null;
}

/* ---------------- duotone print pass ---------------- */

function DuotonePass() {
  const { gl, scene, camera, size, viewport } = useThree();
  const rt = useMemo(() => {
    const t = new THREE.WebGLRenderTarget(2, 2);
    t.depthTexture = new THREE.DepthTexture(2, 2);
    t.depthTexture.type = THREE.UnsignedIntType;
    return t;
  }, []);
  useEffect(() => {
    const w = Math.floor(size.width * viewport.dpr), h = Math.floor(size.height * viewport.dpr);
    rt.setSize(w, h);
    quad.material.uniforms.uRes.value.set(w, h);
  });
  const quadAndScene = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        tColor: { value: rt.texture },
        tDepth: { value: rt.depthTexture },
        uRes: { value: new THREE.Vector2(1, 1) },
        uNear: { value: 0.05 },
        uFar: { value: 120 },
        uTime: { value: 0 },
        // the ramp, dark to light: ink, deep, emerald, green-2, jade, lime, bone (values are display colours)
        uRamp: { value: ["#06281a", "#0a4a2e", "#0f7a4a", "#1f9a5e", "#3fb37a", "#b8e07a", "#efe9dc"].map((h) => new THREE.Color().setStyle(h, THREE.LinearSRGBColorSpace)) },
        uInk: { value: new THREE.Color().setStyle("#06281a", THREE.LinearSRGBColorSpace) },
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform sampler2D tColor, tDepth;
        uniform vec2 uRes; uniform float uNear, uFar, uTime;
        uniform vec3 uRamp[7]; uniform vec3 uInk;
        float lin(float d){ float z = d * 2.0 - 1.0; return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear)); }
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        // luminance stops for the seven ramp colours
        const float S0 = 0.05, S1 = 0.13, S2 = 0.24, S3 = 0.36, S4 = 0.48, S5 = 0.60, S6 = 0.74;
        vec3 ramp(float l){
          if (l < S1) return mix(uRamp[0], uRamp[1], smoothstep(S0, S1, l));
          if (l < S2) return mix(uRamp[1], uRamp[2], smoothstep(S1, S2, l));
          if (l < S3) return mix(uRamp[2], uRamp[3], smoothstep(S2, S3, l));
          if (l < S4) return mix(uRamp[3], uRamp[4], smoothstep(S3, S4, l));
          if (l < S5) return mix(uRamp[4], uRamp[5], smoothstep(S4, S5, l));
          return mix(uRamp[5], uRamp[6], smoothstep(S5, S6, l));
        }
        void main(){
          vec4 src = texture2D(tColor, vUv);
          vec3 c = src.rgb;
          vec2 px = 1.0 / uRes;
          float d0 = lin(texture2D(tDepth, vUv).r);
          float dx = lin(texture2D(tDepth, vUv + vec2(px.x, 0.0)).r) - lin(texture2D(tDepth, vUv - vec2(px.x, 0.0)).r);
          float dy = lin(texture2D(tDepth, vUv + vec2(0.0, px.y)).r) - lin(texture2D(tDepth, vUv - vec2(0.0, px.y)).r);
          float edge = smoothstep(0.035, 0.07, (abs(dx) + abs(dy)) / max(d0, 0.001));
          float grain = hash(floor(vUv * uRes / 1.5) + floor(uTime * 8.0)) - 0.5;
          // the monitor writes alpha 0.5: it is a lit display, so it keeps its own (palette) colours
          if (src.a < 0.75) {
            gl_FragColor = vec4(c + grain * 0.025, 1.0);
            return;
          }
          float l = dot(c, vec3(0.299, 0.587, 0.114)) + grain * 0.03;
          // soft banding: mostly stepped like a print, with enough of the continuous ramp left to model form
          float stepped = floor(l * 14.0 + 0.5) / 14.0;
          vec3 col = mix(ramp(l), ramp(stepped), 0.55);
          // aerial depth: far surfaces drift towards a pale green, near ones stay saturated
          col = mix(col, uRamp[4], smoothstep(2.5, 9.0, d0) * 0.22);
          // a gentle vignette so the frame has a centre
          vec2 q = vUv - 0.5;
          col = mix(col, uInk, smoothstep(0.35, 0.9, dot(q, q) * 2.2) * 0.35);
          col = mix(col, uInk, edge * 0.85);
          gl_FragColor = vec4(col, 1.0);
        }`,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), m);
    mesh.frustumCulled = false;
    // scene and quad are built together: a quad can only have one parent, and strict mode runs memos twice
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { mesh: mesh as THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>, scene };
  }, [rt]);
  const post = quadAndScene.scene;
  const quad = quadAndScene.mesh;
  const ortho = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

  useFrame(({ clock }) => {
    if (!story.active) return;
    quad.material.uniforms.uTime.value = story.reduced ? 0 : clock.elapsedTime;
    gl.setRenderTarget(rt);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.render(post, ortho);
  }, 1);
  return null;
}

/* ---------------- scene ---------------- */

function Scene() {
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.8} />
      {/* the sun through the study window, matching the Blender scene: hard shadows of the mullions and lamp */}
      <directionalLight
        position={[8, 5.44, 3.04]}
        intensity={9}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.015}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={24}
      />
      <Suspense fallback={null}>
        <Workstation />
      </Suspense>
      <CameraRig />
      <DuotonePass />
    </>
  );
}

export default function Workbench() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 38, near: 0.05, far: 120, position: [2.5, 1.7, 2.2] }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      aria-hidden="true"
    >
      <Scene />
    </Canvas>
  );
}

