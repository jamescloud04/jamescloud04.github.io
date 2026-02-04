(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const container = Desktop.qs("#taskbar-apps");
    if (!container) return;

    const windows = Desktop.getMainWindows()
      .filter((el) => !el.dataset.noTaskbar)
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
          Desktop.closeWindow(item.el);
          setActive("portfolio");
          return;
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
      btn.style.display = "inline-flex";
    });

    const initial = windows.find((item) => !item.el.classList.contains("window-hidden"));
    if (initial) {
      setActive(initial.id);
    }
  });
})();
