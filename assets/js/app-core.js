(function () {
  const Desktop = {
    initCallbacks: [],
    _windowMap: new Map(),
    qs(selector, scope = document) {
      return scope.querySelector(selector);
    },
    qsa(selector, scope = document) {
      return Array.from(scope.querySelectorAll(selector));
    },
    onInit(callback) {
      if (typeof callback === "function") {
        this.initCallbacks.push(callback);
      }
    },
    refreshWindows() {
      this._windowMap = new Map();
      this.qsa("[data-window]").forEach((el) => {
        if (el.dataset.window) {
          this._windowMap.set(el.dataset.window, el);
        }
      });
    },
    getWindow(id) {
      return this._windowMap.get(id) || null;
    },
    getMainWindows() {
      return Array.from(this._windowMap.values()).filter((el) => !el.classList.contains("widget"));
    },
    openWindow(windowEl) {
      if (!windowEl) return;
      this.getMainWindows().forEach((el) => {
        if (el !== windowEl) {
          el.classList.add("window-hidden");
        }
      });
      windowEl.classList.remove("window-hidden", "window-minimized");
    },
    openWindowById(id) {
      this.openWindow(this.getWindow(id));
    },
    closeWindow(windowEl) {
      if (!windowEl) return;
      windowEl.classList.add("window-hidden");
      const anyVisible = this.getMainWindows().some(
        (el) => !el.classList.contains("window-hidden") && !el.classList.contains("window-minimized")
      );
      if (!anyVisible) {
        this.setActiveTaskbar(null);
      }
    },
    closeWindowById(id) {
      this.closeWindow(this.getWindow(id));
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
    Desktop.refreshWindows();
    Desktop.initCallbacks.forEach((callback) => callback());
  });
})();
