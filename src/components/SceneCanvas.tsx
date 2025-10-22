'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { OldComputerModel } from './OldComputerModel';

export default function SceneCanvas() {
  return (
    <div className="w-[400px] h-[260px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        {/* Ambient lights */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 3]} intensity={1.2} />
        <Environment preset="city" />

        {/* Make it hover and spin slightly */}
        <Float speed={2} rotationIntensity={1.2} floatIntensity={0.8}>
          <OldComputerModel
            scale={0.45}
            position={[0, -0.6, 0]} // adjust Y to center it
          />
        </Float>

        {/* Allow user to rotate the model */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.3} />
      </Canvas>
    </div>
  );
}