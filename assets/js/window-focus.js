(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const windows = Array.from(document.querySelectorAll(".window-shell"));
    let zIndexCounter = windows.reduce((max, el) => {
      const current = Number.parseInt(window.getComputedStyle(el).zIndex, 10);
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 10);

    windows.forEach((windowEl) => {
      windowEl.addEventListener(
        "pointerdown",
        () => {
          zIndexCounter += 1;
          windowEl.style.zIndex = String(zIndexCounter);
          const windowId = windowEl.dataset.window;
          if (windowId) {
            Desktop.setActiveTaskbar(windowId);
          }
        },
        { capture: true }
      );
    });
  });
})();
