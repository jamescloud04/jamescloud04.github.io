(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const toggleBtn = Desktop.qs("#toggle-widgets");
    const widgetsContainer = Desktop.qs("#widgets-container");
    const mainContainer = Desktop.qs("main.container");
    const startMenu = Desktop.qs("#start-menu");

    if (!toggleBtn || !widgetsContainer || !mainContainer) return;

    let widgetsVisible = true;
    let autoHiddenByResize = false;

    const updateToggleText = () => {
      toggleBtn.textContent = widgetsVisible ? "Hide Widgets" : "Show Widgets";
    };

    const setWidgetsVisibility = (visible, isAutoHide = false) => {
      widgetsVisible = visible;
      autoHiddenByResize = isAutoHide;
      
      if (visible) {
        widgetsContainer.style.display = "";
        mainContainer.classList.remove("widgets-hidden");
      } else {
        widgetsContainer.style.display = "none";
        mainContainer.classList.add("widgets-hidden");
      }
      
      updateToggleText();
    };

    const checkScreenSize = () => {
      // Widgets no longer autohide on mobile devices
      // User can manually toggle if needed
    };

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      autoHiddenByResize = false;
      setWidgetsVisibility(!widgetsVisible, false);
      startMenu.setAttribute("aria-hidden", "true");
    });

    // Check on load and resize
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
  });
})();
