import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface CyberOrbProps {
  progress: number;
}

const Orb = ({ progress }: { progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Color transitions from red (low progress) to cyan (high progress)
  const color = new THREE.Color();
  if (progress < 30) color.set('#ff3333');
  else if (progress < 70) color.set('#ffcc00');
  else color.set('#00f0ff');

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

export const CyberOrb: React.FC<CyberOrbProps> = ({ progress }) => {
  return (
    <div className="w-16 h-16 relative">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Orb progress={progress} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent rounded-full" />
    </div>
  );
};
