import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { story } from "./story";
import { makeScreen } from "./screen";
import { Books } from "./Books";
import { Notes } from "./Notes";
import { Desk } from "./Desk";

// Built in Blender (tools/figure): the study, and "hijabi girl" by fatinnajwa (CC-BY-4.0) on her own rig, with the
// typing clip retargeted onto it. Blender units are metres; the group below fits it to the site's camera path.
const STUDY = "/models/study.glb";
const SHOULDER_LIGHT = 14;
export const STUDY_TRANSFORM = { position: [0.12, 0, -0.68] as const, rotation: Math.PI, scale: 1.2 };

// Only luminance survives the print pass. Pale surfaces print bone in sun and green in shade; dark ones print
// green in sun and ink in shade. Values are tuned against the lights in Workbench.
const pale = new THREE.MeshLambertMaterial({ color: "#f2f2f2" });
const dark = new THREE.MeshLambertMaterial({ color: "#6e6e6e" });
const ink = new THREE.MeshLambertMaterial({ color: "#202020" });
const MATERIAL: Record<string, THREE.Material> = {
  room_shell: pale,
  room_bone: pale,
  room_dark: dark,
  room_ink: ink,
};
// her garments, keyed by material (three.js strips the dots from node names): a dark hijab over a light blouse and
// trousers, so her head and shoulders read against the room
const GARMENT: Record<string, THREE.Material> = {
  Hijab: new THREE.MeshLambertMaterial({ color: "#4a4a4a", side: THREE.DoubleSide }),
  Outfit: new THREE.MeshLambertMaterial({ color: "#bdbdbd", side: THREE.DoubleSide }),
  Skin: new THREE.MeshLambertMaterial({ color: "#6a6a6a", side: THREE.DoubleSide }),
  Shoes: new THREE.MeshLambertMaterial({ color: "#2a2a2a", side: THREE.DoubleSide }),
};

export function Study() {
  const { scene, animations } = useGLTF(STUDY);
  const screen = useMemo(() => (typeof document === "undefined" ? null : makeScreen()), []);
  const mixer = useMemo(() => new THREE.AnimationMixer(scene), [scene]);
  useEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = m.receiveShadow = true;
      if (m.name === "screen") {
        if (screen) m.material = screen;
        // the export tilts the plane 6° back while the monitor leans 6° forward (tools/figure/room.py, export.py);
        // turn it 12° about x to lie flat on the panel, where it already sits 5 mm proud, and add 2 mm more
        if (!m.userData.lifted) {
          m.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-12)));
          m.position.addScaledVector(new THREE.Vector3(0, -0.105, -0.995), 0.002);
          m.userData.lifted = true;
        }
        // the export drops texture coordinates; the screen is a unit plane in x/z, so derive them
        const g = m.geometry;
        if (!g.attributes.uv) {
          const pos = g.attributes.position, uv = new Float32Array(pos.count * 2);
          for (let i = 0; i < pos.count; i++) { uv[i * 2] = (pos.getX(i) + 1) / 2; uv[i * 2 + 1] = (1 - pos.getZ(i)) / 2; }
          g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
        }
        m.castShadow = false;
        return;
      }
      // strict mode runs this twice; keep the glTF material name from the first pass
      m.userData.mat ??= (m.material as THREE.Material).name;
      m.material = MATERIAL[m.name] ?? GARMENT[m.userData.mat] ?? pale;
      if ((m as THREE.SkinnedMesh).isSkinnedMesh) m.frustumCulled = false;
    });
    const action = mixer.clipAction(animations[0]);
    action.play();
    // a held frame for reduced motion, mid-keystroke
    if (story.reduced) mixer.setTime(3);
    return () => { action.stop(); };
  }, [scene, animations, mixer, screen]);
  useFrame((_, dt) => { if (!story.reduced) mixer.update(Math.min(dt, 0.1)); });
  const { position, rotation, scale } = STUDY_TRANSFORM;
  // a key light over her shoulder (study units: y up, the desk towards +z), so the bone top reads against the shaded room
  const [back] = useState(() => { const o = new THREE.Object3D(); o.position.set(0.05, 0.62, 0.0); return o; });
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={scene} />
      <primitive object={back} />
      <Books />
      <Notes />
      <Desk />
      <spotLight position={[0.35, 2.0, -0.95]} target={back} intensity={SHOULDER_LIGHT} angle={0.24} penumbra={0.75}
        decay={2} distance={5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004} />
      {/* spill from the monitor onto the keyboard and her hands */}
      <pointLight position={[-0.1, 0.95, 0.62]} intensity={0.45} distance={1.1} decay={2} />
    </group>
  );
}

useGLTF.preload(STUDY);
