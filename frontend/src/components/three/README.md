# Three.js Components

This directory contains reusable Three.js components for the React frontend.

## Components

### Scene
Reusable Canvas component with pre-configured settings.

```jsx
import { Scene } from '../components/three';

<Scene shadows>
  {/* Your 3D content */}
</Scene>
```

### Lighting
Standard lighting setup with ambient, directional, and point lights.

```jsx
import { Lighting } from '../components/three';

<Lighting />
```

### OrbitControls
Orbit controls with default settings.

```jsx
import { OrbitControls } from '../components/three';

<OrbitControls enableZoom={false} enablePan={false} />
```

### BusinessCard
3D business card component with animations.

```jsx
import { BusinessCard } from '../components/three';

<BusinessCard floating={true} />
```

## Utilities

### threeConfig.js
Centralized configuration for Three.js scenes, including:
- Camera settings
- Renderer settings
- Lighting presets
- Material presets
- Performance settings
- Color constants
- Geometry helpers
- Animation helpers

### useThreeScene.js
Custom React hooks for Three.js:
- `useThreeScene()` - Scene management
- `useAnimation()` - Animation loop
- `useResponsiveCamera()` - Responsive camera updates

## Usage Example

```jsx
import React from 'react';
import { Scene, Lighting, OrbitControls, BusinessCard } from '../components/three';

function My3DComponent() {
  return (
    <Scene shadows>
      <Lighting />
      <BusinessCard floating={true} />
      <OrbitControls enableZoom={false} />
    </Scene>
  );
}
```

## Configuration

All Three.js settings can be customized in `utils/threeConfig.js`:
- Camera FOV, near, far, position
- Renderer antialiasing, shadows, tone mapping
- Lighting intensities and colors
- Material properties
- Performance settings

