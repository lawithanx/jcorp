import React from 'react';
import { Canvas } from '@react-three/fiber';
import { getCameraProps, getRendererProps } from '../../utils/threeConfig';

/**
 * Reusable Three.js Scene Component
 * Provides a configured Canvas with proper settings
 */
function Scene({ 
  children, 
  camera = {}, 
  style = {},
  className = '',
  onCreated = null,
  ...props 
}) {
  const cameraProps = getCameraProps(camera);
  const rendererProps = getRendererProps();

  return (
    <Canvas
      {...rendererProps}
      camera={cameraProps}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
      className={className}
      onCreated={onCreated}
      {...props}
    >
      {children}
    </Canvas>
  );
}

export default Scene;

