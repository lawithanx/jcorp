import React from 'react';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';

/**
 * OrbitControls Component with default settings
 */
function OrbitControls({ 
  enableZoom = false,
  enablePan = false,
  enableRotate = true,
  autoRotate = false,
  autoRotateSpeed = 1,
  minDistance = 5,
  maxDistance = 15,
  ...props 
}) {
  return (
    <DreiOrbitControls
      enableZoom={enableZoom}
      enablePan={enablePan}
      enableRotate={enableRotate}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={minDistance}
      maxDistance={maxDistance}
      {...props}
    />
  );
}

export default OrbitControls;

