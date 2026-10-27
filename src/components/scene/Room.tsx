import { forwardRef } from "react";
import * as THREE from "three";
import { M } from "./materials";
import { Study } from "./Study";
import { Board } from "./Board";

type V3 = [number, number, number];

function Box({ p, s, m = M.white, r }: { p: V3; s: V3; m?: THREE.Material; r?: V3 }) {
  return (
    <mesh position={p} rotation={r} castShadow receiveShadow material={m}>
      <boxGeometry args={s} />
    </mesh>
  );
}

/** City beyond the study window (the window wall sits at x 1.62). */
function Skyline() {
  return (
    <group>
      {[[9, -3.0, 2.2], [11, -1.6, 3.4], [9.5, -0.2, 1.7], [12, 1.0, 4.2], [10, 2.2, 2.6], [12.5, -4.4, 3.0]].map(([x, z, h], i) => (
        <Box key={i} p={[x, h / 2 - 0.3, z]} s={[0.9, h, 0.8]} m={i % 2 ? M.mid : M.light} />
      ))}
    </group>
  );
}

export const Workstation = forwardRef<THREE.Group>(function Workstation(_, ref) {
  return (
    <group ref={ref}>
      <Study />
      <Board />
      <Skyline />
    </group>
  );
});
