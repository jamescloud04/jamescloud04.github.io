(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const container = document.getElementById("retro-3d");
    const mainContainer = document.querySelector("main.container");
    if (!container || !mainContainer || !window.THREE) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0f, 8, 40);
    
    // Gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#151520');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(8, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    container.appendChild(renderer.domElement);

    const controls = THREE.OrbitControls
      ? new THREE.OrbitControls(camera, renderer.domElement)
      : null;

    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, 0, 0);
      controls.minDistance = 5;
      controls.maxDistance = 25;
      controls.maxPolarAngle = Math.PI * 0.9;
    }

    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(5, 8, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    
    scene.add(new THREE.AmbientLight(0x7aa2d6, 1.0));
    const fillLight1 = new THREE.PointLight(0xff6b9d, 0.8, 20);
    fillLight1.position.set(-8, 3, 5);
    scene.add(fillLight1);
    
    const fillLight2 = new THREE.PointLight(0x00d9ff, 0.8, 20);
    fillLight2.position.set(8, 3, -5);
    scene.add(fillLight2);

    const geometryGroup = new THREE.Group();

    // Create a morphing sphere using vertex manipulation
    const sphereGeometry = new THREE.IcosahedronGeometry(2.5, 4);
    const positions = sphereGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      const wave = Math.sin(dist * 2) * 0.3;
      positions[i] += (x / dist) * wave;
      positions[i + 1] += (y / dist) * wave;
      positions[i + 2] += (z / dist) * wave;
    }
    sphereGeometry.attributes.position.needsUpdate = true;
    sphereGeometry.computeVertexNormals();
    
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00d9ff,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0088ff,
      emissiveIntensity: 0.3,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    geometryGroup.add(sphere);

    // Add wireframe sphere
    const wireframeSphere = new THREE.Mesh(
      sphereGeometry.clone(),
      new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      })
    );
    wireframeSphere.scale.setScalar(1.05);
    geometryGroup.add(wireframeSphere);

    // Create particle system following a 3D curve (helix)
    const particleCount = 800;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 10;
      const radius = 4 + Math.sin(t * 0.3) * 0.8;
      
      particlePositions[i * 3] = radius * Math.cos(t);
      particlePositions[i * 3 + 1] = radius * Math.sin(t);
      particlePositions[i * 3 + 2] = (t - Math.PI * 5) * 0.25;
      
      const colorMix = i / particleCount;
      particleColors[i * 3] = 1 - colorMix * 0.5; // R
      particleColors[i * 3 + 1] = 0.3; // G
      particleColors[i * 3 + 2] = colorMix; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    geometryGroup.add(particles);

    // Add torus knot for extra complexity
    const torusKnotGeometry = new THREE.TorusKnotGeometry(1.8, 0.4, 120, 20, 3, 2);
    const torusKnotMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b9d,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xff0080,
      emissiveIntensity: 0.4,
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.castShadow = true;
    torusKnot.receiveShadow = true;
    geometryGroup.add(torusKnot);

    scene.add(geometryGroup);

    let isVisible = false;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const dragRotate = (dx, dy) => {
      const rotY = dx * 0.004;
      const rotX = dy * 0.004;
      geometryGroup.rotation.y += rotY;
      geometryGroup.rotation.x = Math.max(-0.5, Math.min(0.5, geometryGroup.rotation.x + rotX));
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("pointerdown", (event) => {
      if (!isVisible || controls) return;
      isDragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    });

    window.addEventListener("pointermove", (event) => {
      if (!isVisible || controls || !isDragging) return;
      dragRotate(event.clientX - lastX, event.clientY - lastY);
      lastX = event.clientX;
      lastY = event.clientY;
    });

    window.addEventListener("pointerup", () => {
      isDragging = false;
    });

    const updateVisibility = () => {
      const windows = Desktop.getMainWindows();
      const anyVisible = windows.some(
        (el) => !el.classList.contains("window-hidden") && !el.classList.contains("window-minimized")
      );
      isVisible = !anyVisible;
      mainContainer.classList.toggle("show-3d", isVisible);
      container.setAttribute("aria-hidden", String(!isVisible));
      if (isVisible) {
        resize();
      }
    };

    const observer = new MutationObserver(updateVisibility);
    Desktop.getMainWindows().forEach((windowEl) => {
      observer.observe(windowEl, { attributes: true, attributeFilter: ["class"] });
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    updateVisibility();
    resize();

    const animate = () => {
      if (isVisible) {
        const time = Date.now() * 0.0005;
        
        // Rotate morphed sphere
        const sphere = geometryGroup.children[0];
        if (sphere) {
          sphere.rotation.y = time * 0.4;
          sphere.rotation.x = Math.sin(time * 0.5) * 0.3;
        }
        
        // Rotate wireframe slightly faster
        const wireframe = geometryGroup.children[1];
        if (wireframe) {
          wireframe.rotation.y = time * 0.45;
          wireframe.rotation.z = time * 0.2;
        }
        
        // Rotate particle helix
        const particles = geometryGroup.children[2];
        if (particles) {
          particles.rotation.y = time * 0.5;
          particles.rotation.x = Math.sin(time * 0.3) * 0.4;
        }
        
        // Rotate torus knot
        const torusKnot = geometryGroup.children[3];
        if (torusKnot) {
          torusKnot.rotation.x = time * 0.6;
          torusKnot.rotation.y = time * 0.4;
        }
        
        controls?.update();
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };

    animate();
  });
})();
