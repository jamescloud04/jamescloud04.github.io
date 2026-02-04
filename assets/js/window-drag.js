(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const windows = document.querySelectorAll(".window-shell");
    windows.forEach((windowEl) => {
      const handle = windowEl.querySelector(".window-titlebar") || windowEl;
      handle.classList.add("window-drag-handle");

      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      const onMove = (event) => {
        if (!isDragging) return;
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        const maxX = window.innerWidth - windowEl.offsetWidth;
        const maxY = window.innerHeight - windowEl.offsetHeight;
        windowEl.style.left = `${Math.min(Math.max(x, 0), Math.max(maxX, 0))}px`;
        windowEl.style.top = `${Math.min(Math.max(y, 0), Math.max(maxY, 0))}px`;
      };

      const onUp = () => {
        if (!isDragging) return;
        isDragging = false;
        windowEl.classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      handle.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        const rect = windowEl.getBoundingClientRect();
        Desktop.setWindowFloating(windowEl, true);
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        isDragging = true;
        windowEl.classList.add("dragging");
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    });
  });
})();
