(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const container = document.getElementById("taskbar-apps");
    if (!container) return;

    const windows = Array.from(document.querySelectorAll("[data-window]"))
      .filter((el) => !el.classList.contains("widget"))
      .map((el) => ({
        id: el.dataset.window,
        label: el.dataset.windowLabel || el.dataset.window,
        el,
      }));

    const buttons = new Map();

    const ensureButton = (item) => {
      if (buttons.has(item.id)) return buttons.get(item.id);
      const btn = document.createElement("button");
      btn.className = "taskbar-app";
      btn.textContent = item.label;
      btn.addEventListener("click", () => {
        const isMinimized = item.el.classList.contains("window-minimized");
        const isHidden = item.el.classList.contains("window-hidden");
        if (isMinimized || isHidden) {
          Desktop.openWindow(item.el);
        } else {
          item.el.classList.add("window-minimized");
        }
        if (item.el.id === "projects-window") {
          Desktop.ensureReposLoaded();
        }
        setActive(item.id);
      });
      container.appendChild(btn);
      buttons.set(item.id, btn);
      return btn;
    };

    const setActive = (id) => {
      buttons.forEach((btn, key) => {
        btn.classList.toggle("active", key === id);
      });
    };

    Desktop.registerTaskbarSetter(setActive);

    windows.forEach((item) => {
      const btn = ensureButton(item);
      const updateVisibility = () => {
        const hidden = item.el.classList.contains("window-hidden");
        btn.style.display = hidden ? "none" : "inline-flex";
      };
      updateVisibility();

      const windowObserver = new MutationObserver(updateVisibility);
      windowObserver.observe(item.el, { attributes: true, attributeFilter: ["class"] });
    });
  });
})();
