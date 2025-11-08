/**
 * Three.js Configuration and Utilities
 * Centralized configuration for Three.js scenes
 */

export const THREE_CONFIG = {
  // Camera settings
  camera: {
    fov: 45,
    near: 0.1,
    far: 1000,
    position: [0, 0, 8],
  },

  // Renderer settings
  renderer: {
    antialias: true,
    alpha: true,
    shadowMap: true,
    shadowMapType: 'PCFSoft', // PCFSoft, PCF, Basic
    toneMapping: 'ACESFilmic', // ACESFilmic, Cineon, Reinhard, Linear
    toneMappingExposure: 1.2,
    outputEncoding: 'sRGB', // sRGB, Linear
  },

  // Lighting presets
  lighting: {
    ambient: {
      intensity: 0.8,
      color: '#ffffff',
    },
    directional: {
      main: {
        position: [5, 10, 5],
        intensity: 1.5,
        color: '#ffffff',
        castShadow: true,
      },
      fill: {
        position: [-5, 0, 5],
        intensity: 0.6,
        color: '#c0c0c0',
      },
    },
    point: {
      primary: {
        position: [3, 3, 5],
        intensity: 1.5,
        color: '#ffffff',
        distance: 20,
      },
      secondary: {
        position: [-3, -3, 5],
        intensity: 1.2,
        color: '#c0c0c0',
        distance: 20,
      },
    },
  },

  // Material presets
  materials: {
    metal: {
      metalness: 0.9,
      roughness: 0.1,
      envMapIntensity: 1.5,
    },
    glass: {
      metalness: 0.1,
      roughness: 0.05,
      transparent: true,
      opacity: 0.8,
    },
    emissive: {
      emissive: '#ffffff',
      emissiveIntensity: 0.4,
    },
  },

  // Performance settings
  performance: {
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    maxFPS: 60,
    enableShadows: true,
    shadowMapSize: 2048,
  },
};

/**
 * Get default camera props for React Three Fiber
 */
export const getCameraProps = (overrides = {}) => {
  return {
    fov: THREE_CONFIG.camera.fov,
    near: THREE_CONFIG.camera.near,
    far: THREE_CONFIG.camera.far,
    position: THREE_CONFIG.camera.position,
    ...overrides,
  };
};

/**
 * Get default renderer props
 */
export const getRendererProps = () => {
  return {
    gl: {
      antialias: THREE_CONFIG.renderer.antialias,
      alpha: THREE_CONFIG.renderer.alpha,
      shadowMap: {
        enabled: THREE_CONFIG.renderer.shadowMap,
        type: THREE_CONFIG.renderer.shadowMapType,
      },
      toneMapping: THREE_CONFIG.renderer.toneMapping,
      toneMappingExposure: THREE_CONFIG.renderer.toneMappingExposure,
      outputEncoding: THREE_CONFIG.renderer.outputEncoding,
    },
    dpr: THREE_CONFIG.performance.pixelRatio,
    shadows: THREE_CONFIG.performance.enableShadows,
  };
};

/**
 * Color helpers
 */
export const COLORS = {
  white: '#ffffff',
  black: '#000000',
  darkGray: '#1a1a1a',
  mediumGray: '#2a2a2a',
  silver: '#c0c0c0',
};

/**
 * Convert hex color to Three.js color
 */
export const hexToColor = (hex) => {
  return hex.replace('#', '0x');
};

/**
 * Animation helpers
 */
export const ANIMATION = {
  // Easing functions
  easeInOut: (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  },
  easeOut: (t) => {
    return t * (2 - t);
  },
  easeIn: (t) => {
    return t * t;
  },
  // Lerp (linear interpolation)
  lerp: (start, end, t) => {
    return start + (end - start) * t;
  },
};

/**
 * Geometry helpers
 */
export const GEOMETRY = {
  // Standard business card dimensions (in units)
  businessCard: {
    width: 3.5,
    height: 2,
    thickness: 0.05,
  },
};

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
  }

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - this.lastTime;

    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getFPS() {
    return this.fps;
  }
}

