(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const toggleBtn = Desktop.qs("#toggle-widgets");
    const widgetsContainer = Desktop.qs("#widgets-container");
    const mainContainer = Desktop.qs("main.container");
    const startMenu = Desktop.qs("#start-menu");

    if (!toggleBtn || !widgetsContainer || !mainContainer) return;

    let widgetsVisible = true;

    const updateToggleText = () => {
      toggleBtn.textContent = widgetsVisible ? "Hide Widgets" : "Show Widgets";
    };

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      widgetsVisible = !widgetsVisible;
      
      if (widgetsVisible) {
        widgetsContainer.style.display = "";
        mainContainer.classList.remove("widgets-hidden");
      } else {
        widgetsContainer.style.display = "none";
        mainContainer.classList.add("widgets-hidden");
      }
      
      updateToggleText();
      
      startMenu.setAttribute("aria-hidden", "true");
    });
  });
})();
