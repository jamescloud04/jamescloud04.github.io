(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const uptimeEl = document.getElementById("widget-uptime");
    const motionEl = document.getElementById("widget-motion");
    if (uptimeEl || motionEl) {
      const start = Date.now();
      const updateUptime = () => {
        if (!uptimeEl) return;
        const diff = Date.now() - start;
        const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        uptimeEl.textContent = `${hours}:${minutes}:${seconds}`;
      };

      const updateMotion = () => {
        if (!motionEl) return;
        motionEl.textContent = document.body.classList.contains("motion-off") ? "Off" : "On";
      };

      updateUptime();
      updateMotion();
      setInterval(updateUptime, 1000);
      document.addEventListener("click", updateMotion);
    }

    const widgets = document.querySelectorAll(".widget");
    widgets.forEach((widget) => {
      const handle = widget.querySelector(".window-titlebar") || widget;
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      const onMove = (event) => {
        if (!isDragging) return;
        const x = event.clientX - offsetX;
        const y = event.clientY - offsetY;
        const maxX = window.innerWidth - widget.offsetWidth;
        const maxY = window.innerHeight - widget.offsetHeight - 28;
        widget.style.left = `${Math.min(Math.max(x, 0), Math.max(maxX, 0))}px`;
        widget.style.top = `${Math.min(Math.max(y, 0), Math.max(maxY, 0))}px`;
      };

      const onUp = () => {
        if (!isDragging) return;
        isDragging = false;
        widget.classList.remove("dragging");
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      handle.addEventListener("mousedown", (event) => {
        if (event.button !== 0) return;
        const rect = widget.getBoundingClientRect();
        widget.style.position = "fixed";
        widget.style.margin = "0";
        widget.style.left = `${rect.left}px`;
        widget.style.top = `${rect.top}px`;
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        isDragging = true;
        widget.classList.add("dragging");
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    });
  });
})();
