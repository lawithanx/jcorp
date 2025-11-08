/**
 * Three.js 3D Business Card Component
 * Features: PBR materials, interactive controls, HDR lighting, download functionality
 */

class BusinessCard3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        // Scene setup
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.card = null;
        this.controls = null;
        this.animationId = null;
        this.composer = null;
        this.time = 0;

        // Interaction state
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.isDragging = false;
        this.touchStart = { x: 0, y: 0 };

        // Initialize
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupPostProcessing();
        this.setupLighting();
        this.createBusinessCard();
        this.setupControls();
        this.animate();
        this.setupResize();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 10, 50);
        
        // Ensure container has dimensions
        if (this.container.clientWidth === 0 || this.container.clientHeight === 0) {
            console.warn('Container has zero dimensions, using defaults');
            this.container.style.width = '600px';
            this.container.style.height = '400px';
        }
    }

    setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 8);
    }

    setupRenderer() {
        const width = this.container.clientWidth || 600;
        const height = this.container.clientHeight || 400;
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000, 0); // Transparent background

        this.container.appendChild(this.renderer.domElement);
        console.log('Renderer created with size:', width, height);
    }

    setupPostProcessing() {
        try {
            // Create render target for main scene
            this.mainRenderTarget = new THREE.WebGLRenderTarget(
                this.container.clientWidth || 600,
                this.container.clientHeight || 400,
                {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    format: THREE.RGBAFormat
                }
            );

            // Create custom shader material for post-processing effects
            this.postProcessMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(this.container.clientWidth, this.container.clientHeight) },
                uBloomIntensity: { value: 1.2 },
                uVignetteIntensity: { value: 0.5 },
                uChromaticAberration: { value: 0.002 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform float uBloomIntensity;
                uniform float uVignetteIntensity;
                uniform float uChromaticAberration;
                varying vec2 vUv;

                // Bloom effect
                vec3 bloom(vec2 uv) {
                    vec3 color = vec3(0.0);
                    float samples = 16.0;
                    float radius = 0.02;
                    
                    for (float i = 0.0; i < samples; i++) {
                        float angle = (i / samples) * 3.14159 * 2.0;
                        vec2 offset = vec2(cos(angle), sin(angle)) * radius;
                        vec3 sample = texture2D(tDiffuse, uv + offset).rgb;
                        // Extract bright areas
                        float brightness = dot(sample, vec3(0.299, 0.587, 0.114));
                        if (brightness > 0.7) {
                            color += sample * uBloomIntensity;
                        }
                    }
                    return color / samples;
                }

                // Vignette effect
                float vignette(vec2 uv) {
                    vec2 center = vec2(0.5, 0.5);
                    float dist = distance(uv, center);
                    return 1.0 - smoothstep(0.3, 1.0, dist) * uVignetteIntensity;
                }

                // Chromatic aberration
                vec3 chromaticAberration(vec2 uv) {
                    vec2 offset = (uv - 0.5) * uChromaticAberration;
                    float r = texture2D(tDiffuse, uv + offset).r;
                    float g = texture2D(tDiffuse, uv).g;
                    float b = texture2D(tDiffuse, uv - offset).b;
                    return vec3(r, g, b);
                }

                void main() {
                    vec2 uv = vUv;
                    vec3 color = texture2D(tDiffuse, uv).rgb;
                    
                    // Apply chromatic aberration
                    color = chromaticAberration(uv);
                    
                    // Add bloom effect
                    vec3 bloomColor = bloom(uv);
                    color += bloomColor;
                    
                    // Apply vignette
                    float vig = vignette(uv);
                    color *= vig;
                    
                    // Add subtle color grading
                    color = pow(color, vec3(0.95)); // Slight contrast boost
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });

            // Create fullscreen quad for post-processing
            this.postProcessQuad = new THREE.Mesh(
                new THREE.PlaneGeometry(2, 2),
                this.postProcessMaterial
            );
            this.postProcessScene = new THREE.Scene();
            this.postProcessScene.add(this.postProcessQuad);
            this.postProcessCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            
            console.log('Post-processing initialized successfully');
        } catch (error) {
            console.warn('Post-processing setup failed, using direct rendering:', error);
            this.mainRenderTarget = null;
            this.postProcessMaterial = null;
            this.postProcessScene = null;
            this.postProcessCamera = null;
            this.postProcessQuad = null;
        }
    }

    setupLighting() {
        // Ambient light - increased for better visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Main directional light (simulating HDR environment)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 10, 5);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        mainLight.shadow.camera.near = 0.5;
        mainLight.shadow.camera.far = 50;
        mainLight.shadow.camera.left = -10;
        mainLight.shadow.camera.right = 10;
        mainLight.shadow.camera.top = 10;
        mainLight.shadow.camera.bottom = -10;
        this.scene.add(mainLight);

        // Fill light
        const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.6);
        fillLight.position.set(-5, 0, 5);
        this.scene.add(fillLight);

        // Rim light for edge highlights
        const rimLight = new THREE.DirectionalLight(0x00ff88, 0.8);
        rimLight.position.set(0, 0, -10);
        this.scene.add(rimLight);

        // Point lights for emissive highlights
        const pointLight1 = new THREE.PointLight(0x00ff88, 1.5, 20);
        pointLight1.position.set(3, 3, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4a90e2, 1.2, 20);
        pointLight2.position.set(-3, -3, 5);
        this.scene.add(pointLight2);
    }

    createBusinessCard() {
        const cardGroup = new THREE.Group();

        // Card dimensions (standard business card: 3.5" x 2")
        const width = 3.5;
        const height = 2;
        const thickness = 0.05;

        // Create card geometry
        const cardGeometry = new THREE.BoxGeometry(width, height, thickness);
        
        // PBR Material with metal/glass effects - make it more visible
        const cardMaterial = new THREE.MeshStandardMaterial({
            color: 0x2a2a2a,
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 1.5,
            emissive: 0x00ff88,
            emissiveIntensity: 0.4
        });

        // Main card mesh
        const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
        cardMesh.castShadow = true;
        cardMesh.receiveShadow = true;
        cardGroup.add(cardMesh);

        // Add emissive highlights (glowing edges)
        const edgeGeometry = new THREE.BoxGeometry(width + 0.02, height + 0.02, thickness + 0.01);
        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6,
            side: THREE.BackSide
        });
        const edgeMesh = new THREE.Mesh(edgeGeometry, edgeMaterial);
        cardGroup.add(edgeMesh);

        // Front face text/logo (using simple geometry for performance)
        this.createCardFront(cardGroup, width, height, thickness);

        // Back face details
        this.createCardBack(cardGroup, width, height, thickness);

        // Add subtle rotation animation
        cardGroup.rotation.y = 0.1;

        this.card = cardGroup;
        this.scene.add(cardGroup);
        console.log('Business card created and added to scene', {
            card: this.card,
            scene: this.scene,
            camera: this.camera,
            renderer: this.renderer
        });
    }

    createCardFront(group, width, height, thickness) {
        // Company name text (using geometry for performance)
        const nameGeometry = new THREE.PlaneGeometry(width * 0.8, height * 0.2);
        const nameMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        const nameMesh = new THREE.Mesh(nameGeometry, nameMaterial);
        nameMesh.position.set(0, height * 0.3, thickness / 2 + 0.01);
        group.add(nameMesh);

        // Tagline
        const taglineGeometry = new THREE.PlaneGeometry(width * 0.7, height * 0.1);
        const taglineMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.2,
            metalness: 0.5,
            roughness: 0.3
        });
        const taglineMesh = new THREE.Mesh(taglineGeometry, taglineMaterial);
        taglineMesh.position.set(0, 0, thickness / 2 + 0.01);
        group.add(taglineMesh);

        // Contact info highlights
        const contactGeometry = new THREE.PlaneGeometry(width * 0.6, height * 0.15);
        const contactMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            emissive: 0x4a90e2,
            emissiveIntensity: 0.3,
            metalness: 0.7,
            roughness: 0.2
        });
        const contactMesh = new THREE.Mesh(contactGeometry, contactMaterial);
        contactMesh.position.set(0, -height * 0.3, thickness / 2 + 0.01);
        group.add(contactMesh);
    }

    createCardBack(group, width, height, thickness) {
        // Back face pattern/logo
        const backGeometry = new THREE.PlaneGeometry(width * 0.9, height * 0.9);
        const backMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.6,
            roughness: 0.4,
            emissive: 0x000000,
            emissiveIntensity: 0
        });
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.position.set(0, 0, -thickness / 2 - 0.01);
        backMesh.rotation.y = Math.PI;
        group.add(backMesh);
    }

    setupControls() {
        // Mouse controls
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', () => this.onMouseUp());
        this.renderer.domElement.addEventListener('mouseleave', () => this.onMouseUp());

        // Touch controls
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', () => this.onTouchEnd());

        // Hover effect
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onHover(e));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.mouse.x = (e.clientX / this.container.clientWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / this.container.clientHeight) * 2 + 1;
    }

    onMouseMove(e) {
        if (this.isDragging) {
            const newX = (e.clientX / this.container.clientWidth) * 2 - 1;
            const newY = -(e.clientY / this.container.clientHeight) * 2 + 1;

            this.targetRotation.y += (newX - this.mouse.x) * 2;
            this.targetRotation.x += (newY - this.mouse.y) * 2;

            this.mouse.x = newX;
            this.mouse.y = newY;
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onTouchStart(e) {
        e.preventDefault();
        this.isDragging = true;
        const touch = e.touches[0];
        this.touchStart.x = touch.clientX;
        this.touchStart.y = touch.clientY;
    }

    onTouchMove(e) {
        if (this.isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - this.touchStart.x;
            const deltaY = touch.clientY - this.touchStart.y;

            this.targetRotation.y += deltaX * 0.01;
            this.targetRotation.x -= deltaY * 0.01;

            this.touchStart.x = touch.clientX;
            this.touchStart.y = touch.clientY;
        }
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    onHover(e) {
        if (!this.isDragging && this.card) {
            const rect = this.container.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.targetRotation.y = x * 0.3;
            this.targetRotation.x = y * 0.3;
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        if (this.card) {
            // Smooth rotation interpolation
            this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
            this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

            this.card.rotation.x = this.currentRotation.x;
            this.card.rotation.y = this.currentRotation.y;

            // Subtle floating animation
            this.card.position.y = Math.sin(Date.now() * 0.001) * 0.1;

            // Update emissive intensity based on rotation
            const emissiveIntensity = 0.3 + Math.abs(this.card.rotation.y) * 0.2;
            this.card.children.forEach((child) => {
                if (child.material && child.material.emissive) {
                    child.material.emissiveIntensity = Math.min(emissiveIntensity, 0.8);
                }
            });
        }

        // Render main scene - use direct rendering to ensure card is visible
        try {
            // Always use direct rendering for now to ensure card shows
            this.renderer.setRenderTarget(null);
            this.renderer.render(this.scene, this.camera);
        } catch (error) {
            console.error('Rendering error:', error);
            this.renderer.setRenderTarget(null);
            this.renderer.render(this.scene, this.camera);
        }
    }

    setupResize() {
        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Update render targets and post-processing resolution
            if (this.mainRenderTarget) {
                this.mainRenderTarget.setSize(width, height);
            }
            if (this.postProcessMaterial) {
                this.postProcessMaterial.uniforms.uResolution.value.set(width, height);
            }
        });
    }

    // Download functionality
    downloadImage() {
        const width = 2048;
        const height = 1024;
        const tempRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        tempRenderer.setSize(width, height);
        tempRenderer.setPixelRatio(1);
        tempRenderer.outputEncoding = THREE.sRGBEncoding;
        tempRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        tempRenderer.toneMappingExposure = 1.2;

        // Render to canvas
        tempRenderer.render(this.scene, this.camera);

        // Convert to blob and download
        tempRenderer.domElement.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'jcorp-business-card.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(url), 100);
            }
        }, 'image/png');

        // Cleanup
        setTimeout(() => tempRenderer.dispose(), 1000);
    }

    downloadPDF() {
        // Create canvas for PDF
        const width = 2048;
        const height = 1024;
        const tempRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });
        tempRenderer.setSize(width, height);
        tempRenderer.setPixelRatio(1);
        tempRenderer.outputEncoding = THREE.sRGBEncoding;
        tempRenderer.toneMapping = THREE.ACESFilmicToneMapping;
        tempRenderer.toneMappingExposure = 1.2;

        tempRenderer.render(this.scene, this.camera);

        // Use jsPDF if available, otherwise fallback to image
        if (typeof window.jsPDF !== 'undefined' || (window.jspdf && window.jspdf.jsPDF)) {
            const jsPDF = window.jsPDF || window.jspdf.jsPDF;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'in',
                format: [3.5, 2]
            });
            const imgData = tempRenderer.domElement.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2);
            pdf.save('jcorp-business-card.pdf');
        } else {
            // Fallback to image download
            console.log('jsPDF not available, downloading as image instead');
            this.downloadImage();
        }

        // Cleanup
        setTimeout(() => tempRenderer.dispose(), 1000);
    }

    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded. Please check the script tag.');
            return;
        }
        
        // Check if container exists
        const container = document.getElementById('business-card-3d-container');
        if (!container) {
            console.error('Container with id "business-card-3d-container" not found');
            return;
        }
        
        // Initialize business card
        window.businessCard3D = new BusinessCard3D('business-card-3d-container');
        
        if (!window.businessCard3D.renderer) {
            console.error('Failed to initialize business card renderer');
        } else {
            console.log('Business card 3D initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing business card:', error);
    }
});

