'use client';
import { useGLTF } from '@react-three/drei';
import type { JSX } from 'react';

type OldComputerModelProps = Omit<JSX.IntrinsicElements['primitive'], 'object'>;

export function OldComputerModel(props: OldComputerModelProps) {
  const { scene } = useGLTF('/models/old-computer.glb');
  return <primitive object={scene} {...props} />;
}

useGLTF.preload('/models/old-computer.glb');