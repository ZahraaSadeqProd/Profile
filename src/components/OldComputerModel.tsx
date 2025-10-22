'use client';
import { useGLTF } from '@react-three/drei';

export function OldComputerModel(props: any) {
  // This hook loads the model from your public folder
  const { scene } = useGLTF('/models/old-computer.glb');
  return <primitive object={scene} {...props} />;
}

// Optional: preload for faster render
useGLTF.preload('/models/old-computer.glb');