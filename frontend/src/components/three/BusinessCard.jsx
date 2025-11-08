import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { GEOMETRY, COLORS } from '../../utils/threeConfig';

/**
 * 3D Business Card Component
 * Interactive business card with PBR materials
 */
function BusinessCard({ 
  rotation = [0.1, 0.2, 0],
  position = [0, 0, 0],
  floating = true,
  floatingSpeed = 0.001,
  ...props 
}) {
  const cardRef = useRef();
  const { businessCard } = GEOMETRY;

  // Floating animation
  useFrame((state) => {
    if (floating && cardRef.current) {
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatingSpeed * 1000) * 0.1;
    }
  });

  return (
    <group 
      ref={cardRef}
      rotation={rotation}
      position={position}
      {...props}
    >
      {/* Main card body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[businessCard.width, businessCard.height, businessCard.thickness]} />
        <meshStandardMaterial 
          color={COLORS.mediumGray}
          metalness={0.9}
          roughness={0.1}
          emissive={COLORS.white}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Front face - Company name */}
      <mesh position={[0, businessCard.height * 0.3, businessCard.thickness / 2 + 0.01]}>
        <planeGeometry args={[businessCard.width * 0.8, businessCard.height * 0.2]} />
        <meshStandardMaterial 
          color={COLORS.white}
          emissive={COLORS.white}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Front face - Tagline */}
      <mesh position={[0, 0, businessCard.thickness / 2 + 0.01]}>
        <planeGeometry args={[businessCard.width * 0.7, businessCard.height * 0.1]} />
        <meshStandardMaterial 
          color={COLORS.white}
          emissive={COLORS.white}
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Front face - Contact info */}
      <mesh position={[0, -businessCard.height * 0.3, businessCard.thickness / 2 + 0.01]}>
        <planeGeometry args={[businessCard.width * 0.6, businessCard.height * 0.15]} />
        <meshStandardMaterial 
          color={COLORS.silver}
          emissive={COLORS.silver}
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Edge glow effect */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[
          businessCard.width + 0.02, 
          businessCard.height + 0.02, 
          businessCard.thickness + 0.01
        ]} />
        <meshStandardMaterial 
          color={COLORS.white}
          emissive={COLORS.white}
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.6}
          side={2} // BackSide
        />
      </mesh>
    </group>
  );
}

export default BusinessCard;

