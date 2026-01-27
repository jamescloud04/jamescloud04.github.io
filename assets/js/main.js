(function () {
  // Modal controls
  const contactBtn = document.getElementById('contact-btn');
  const contactModal = document.getElementById('contact-modal');
  const modalClose = document.getElementById('modal-close');

  if (contactBtn && contactModal && modalClose) {
    contactBtn.addEventListener('click', () => {
      contactModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => {
      contactModal.classList.remove('active');
    });

    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
      }
    });
  }

  const root = document.documentElement;
  const body = document.body;

  const palettes = {
    sunrise: { accent: "#f6c86e", strong: "#f97316", glow: "0 20px 60px rgba(249, 115, 22, 0.35)" },
    seafoam: { accent: "#5eead4", strong: "#14b8a6", glow: "0 20px 60px rgba(20, 184, 166, 0.35)" },
    neon: { accent: "#a855f7", strong: "#22d3ee", glow: "0 20px 60px rgba(34, 211, 238, 0.35)" },
    amber: { accent: "#fcd34d", strong: "#d97706", glow: "0 20px 60px rgba(217, 119, 6, 0.32)" },
  };

  const setPalette = (key) => {
    const palette = palettes[key];
    if (!palette) return;
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent-strong", palette.strong);
    root.style.setProperty("--glow", palette.glow);
  };

  const wirePaletteControls = () => {
    const swatches = document.querySelectorAll(".swatch[data-palette]");
    swatches.forEach((swatch) => {
      swatch.addEventListener("click", () => setPalette(swatch.dataset.palette));
    });
  };

  const wireMotionToggle = () => {
    const toggle = document.querySelector("[data-toggle='motion']");
    if (!toggle) return;

    const updateLabel = (isOn) => {
      toggle.textContent = isOn ? "Motion on" : "Motion off";
      toggle.setAttribute("aria-pressed", String(isOn));
    };

    toggle.addEventListener("click", () => {
      const isOff = body.classList.toggle("motion-off");
      updateLabel(!isOff);
    });
  };

  const wireDensityControls = () => {
    const buttons = document.querySelectorAll("[data-density]");
    if (!buttons.length) return;

    const setDensity = (value) => {
      buttons.forEach((btn) => btn.setAttribute("aria-pressed", String(btn.dataset.density === value)));
      if (value === "compact") {
        body.classList.add("density-compact");
      } else {
        body.classList.remove("density-compact");
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => setDensity(btn.dataset.density));
    });
  };

  const nudgeBlobs = () => {
    const blobs = document.querySelectorAll(".blob");
    window.addEventListener("pointermove", (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 20;
      const y = (event.clientY / innerHeight - 0.5) * 20;
      blobs.forEach((blob, idx) => {
        const factor = idx === 0 ? 1 : -1;
        blob.style.transform = `translate(${x * factor}px, ${y}px)`;
      });
    });
  };

  const init = () => {
    setPalette("sunrise");
    wirePaletteControls();
    wireMotionToggle();
    wireDensityControls();
    nudgeBlobs();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
