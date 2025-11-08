import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Custom hook for Three.js scene management
 */
export function useThreeScene() {
  const { scene, camera, gl } = useThree();
  const sceneRef = useRef(scene);

  useEffect(() => {
    sceneRef.current = scene;
  }, [scene]);

  // Set up scene background
  const setBackground = (color) => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(color);
    }
  };

  // Add fog to scene
  const addFog = (color = '#000000', near = 10, far = 50) => {
    if (sceneRef.current) {
      sceneRef.current.fog = new THREE.Fog(color, near, far);
    }
  };

  // Remove fog
  const removeFog = () => {
    if (sceneRef.current) {
      sceneRef.current.fog = null;
    }
  };

  // Get scene stats
  const getStats = () => {
    return {
      objects: sceneRef.current?.children.length || 0,
      geometries: sceneRef.current?.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          return obj.geometry;
        }
      }).length || 0,
    };
  };

  return {
    scene: sceneRef.current,
    camera,
    gl,
    setBackground,
    addFog,
    removeFog,
    getStats,
  };
}

/**
 * Custom hook for animation
 */
export function useAnimation(callback, dependencies = []) {
  const { clock } = useThree();
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (callback) {
        callback(clock.getElapsedTime(), clock.getDelta());
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, dependencies);
}

/**
 * Custom hook for responsive camera
 */
export function useResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [size, camera]);
}

