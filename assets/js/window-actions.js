(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const actionSets = document.querySelectorAll(".window-actions");
    actionSets.forEach((actions) => {
      const maxBtn = actions.querySelector(".window-maximize");
      if (maxBtn) {
        maxBtn.remove();
      }

      const windowEl = actions.closest(".content, .widget, .window");
      if (!windowEl) return;

      const minBtn = actions.querySelector(".window-minimize");
      const closeBtn = actions.querySelector(".modal-close");

      minBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        windowEl.classList.add("window-minimized");
      });

      closeBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        Desktop.closeWindow(windowEl);
      });
    });
  });
})();
