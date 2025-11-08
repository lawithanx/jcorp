import React from 'react';
import { THREE_CONFIG } from '../../utils/threeConfig';

/**
 * Standard Lighting Setup Component
 * Provides ambient, directional, and point lights
 */
function Lighting({ 
  ambient = true,
  directional = true,
  point = true,
  custom = null 
}) {
  const { lighting } = THREE_CONFIG;

  return (
    <>
      {/* Ambient Light */}
      {ambient && (
        <ambientLight 
          intensity={lighting.ambient.intensity}
          color={lighting.ambient.color}
        />
      )}

      {/* Directional Lights */}
      {directional && (
        <>
          <directionalLight
            position={lighting.directional.main.position}
            intensity={lighting.directional.main.intensity}
            color={lighting.directional.main.color}
            castShadow={lighting.directional.main.castShadow}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight
            position={lighting.directional.fill.position}
            intensity={lighting.directional.fill.intensity}
            color={lighting.directional.fill.color}
          />
        </>
      )}

      {/* Point Lights */}
      {point && (
        <>
          <pointLight
            position={lighting.point.primary.position}
            intensity={lighting.point.primary.intensity}
            color={lighting.point.primary.color}
            distance={lighting.point.primary.distance}
          />
          <pointLight
            position={lighting.point.secondary.position}
            intensity={lighting.point.secondary.intensity}
            color={lighting.point.secondary.color}
            distance={lighting.point.secondary.distance}
          />
        </>
      )}

      {/* Custom lighting */}
      {custom}
    </>
  );
}

export default Lighting;

