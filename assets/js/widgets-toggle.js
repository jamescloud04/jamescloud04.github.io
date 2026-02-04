(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const toggleBtn = Desktop.qs("#toggle-widgets");
    const widgetsContainer = Desktop.qs("#widgets-container");
    const startMenu = Desktop.qs("#start-menu");

    if (!toggleBtn || !widgetsContainer) return;

    let widgetsVisible = true;

    const updateToggleText = () => {
      toggleBtn.textContent = widgetsVisible ? "Hide Widgets" : "Show Widgets";
    };

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      widgetsVisible = !widgetsVisible;
      
      if (widgetsVisible) {
        widgetsContainer.style.display = "";
      } else {
        widgetsContainer.style.display = "none";
      }
      
      updateToggleText();
      
      startMenu.setAttribute("aria-hidden", "true");
    });
  });
})();
