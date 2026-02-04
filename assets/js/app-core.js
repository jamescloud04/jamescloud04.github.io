(function () {
  const Desktop = {
    initCallbacks: [],
    onInit(callback) {
      if (typeof callback === "function") {
        this.initCallbacks.push(callback);
      }
    },
    getWindows() {
      return Array.from(document.querySelectorAll(".window-shell"));
    },
    setWindowFloating(windowEl, isFloating) {
      if (!windowEl) return;
      if (isFloating) {
        const rect = windowEl.getBoundingClientRect();
        windowEl.classList.add("window-floating");
        windowEl.style.position = "fixed";
        windowEl.style.margin = "0";
        windowEl.style.width = `${rect.width}px`;
        windowEl.style.height = `${rect.height}px`;
        windowEl.style.left = `${rect.left}px`;
        windowEl.style.top = `${rect.top}px`;
        windowEl.style.transform = "none";
      } else {
        windowEl.classList.remove("window-floating");
        windowEl.style.position = "";
        windowEl.style.margin = "";
        windowEl.style.width = "";
        windowEl.style.height = "";
        windowEl.style.left = "";
        windowEl.style.top = "";
        windowEl.style.transform = "";
      }
    },
    openWindow(windowEl) {
      if (!windowEl) return;
      windowEl.classList.remove("window-hidden", "window-minimized");
    },
    closeWindow(windowEl) {
      if (!windowEl) return;
      windowEl.classList.add("window-hidden");
    },
    _setActiveTaskbar: null,
    setActiveTaskbar(id) {
      if (typeof this._setActiveTaskbar === "function") {
        this._setActiveTaskbar(id);
      }
    },
    registerTaskbarSetter(fn) {
      this._setActiveTaskbar = fn;
    },
    ensureReposLoaded() {},
  };

  window.Desktop = Desktop;

  document.addEventListener("DOMContentLoaded", () => {
    Desktop.initCallbacks.forEach((callback) => callback());
  });
})();
