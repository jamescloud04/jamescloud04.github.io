(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const container = document.getElementById("retro-3d");
    const mainContainer = document.querySelector("main.container");
    if (!container || !mainContainer || !window.THREE) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xaac0d8, 6, 30);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(5.5, 4.5, 8.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const controls = THREE.OrbitControls
      ? new THREE.OrbitControls(camera, renderer.domElement)
      : null;

    if (controls) {
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.target.set(0, -0.2, 0);
      controls.minDistance = 4;
      controls.maxDistance = 18;
      controls.maxPolarAngle = Math.PI * 0.48;
    }

    const light = new THREE.DirectionalLight(0xffffff, 1.1);
    light.position.set(6, 8, 6);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x7aa2d6, 0.85));
    const fillLight = new THREE.PointLight(0x88a6d8, 0.65, 20);
    fillLight.position.set(-6, 4, 4);
    scene.add(fillLight);

    const deskGroup = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
      color: 0x8fb6d8,
      roughness: 0.32,
      metalness: 0.18,
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(6, 0.6, 4), material);
    base.position.y = -0.9;
    deskGroup.add(base);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.25), material);
    monitor.position.set(0, 0.2, -0.9);
    deskGroup.add(monitor);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 1.35),
      new THREE.MeshStandardMaterial({ color: 0x274d86, emissive: 0x0f2a4f, emissiveIntensity: 0.65 })
    );
    screen.position.set(0, 0.2, -0.77);
    deskGroup.add(screen);

    const tower = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 1), material);
    tower.position.set(2.4, -0.1, -0.4);
    deskGroup.add(tower);

    const keyboard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.7), material);
    keyboard.position.set(0, -0.55, 0.6);
    deskGroup.add(keyboard);

    const mousePad = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.05, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x2c4a76, roughness: 0.6, metalness: 0.05 })
    );
    mousePad.position.set(1.4, -0.68, 0.55);
    deskGroup.add(mousePad);

    scene.add(deskGroup);

    const retroCube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x7fc5ff,
        roughness: 0.2,
        metalness: 0.6,
        emissive: 0x123f6a,
        emissiveIntensity: 0.4,
      })
    );
    retroCube.position.set(-2.6, 0, 0);
    scene.add(retroCube);

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    const dragRotate = (dx, dy) => {
      const rotY = dx * 0.004;
      const rotX = dy * 0.004;
      deskGroup.rotation.y += rotY;
      deskGroup.rotation.x = Math.max(-0.35, Math.min(0.35, deskGroup.rotation.x + rotX));
      retroCube.rotation.y += rotY * 1.2;
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

    let isVisible = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };

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
        retroCube.rotation.y += 0.003;
        retroCube.rotation.x += 0.0015;
        controls?.update();
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };

    animate();
  });
})();
