import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Jaguar({ position = [0, 0, 0], rotation = [0, 0, 0], ...props }) {
  const jaguarRef = useRef();
  
  useFrame((state) => {
    if (jaguarRef.current) {
      jaguarRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={jaguarRef} position={position} rotation={rotation} {...props}>
      <mesh>
        <boxGeometry args={[2, 1, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
          emissive="#00ff88"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[-0.8, -0.3, 0.4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.3, 0.4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.8, -0.3, -0.4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.3, -0.4]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

export default Jaguar;

