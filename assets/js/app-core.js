(function () {
  const Desktop = {
    initCallbacks: [],
    onInit(callback) {
      if (typeof callback === "function") {
        this.initCallbacks.push(callback);
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
