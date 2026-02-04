(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const startButton = Desktop.qs(".start-btn");
    const startMenu = Desktop.qs("#start-menu");
    const openPortfolioBtn = Desktop.qs("#start-open-portfolio");
    const openProjectsBtn = Desktop.qs("#start-open-projects");
    const openContactBtn = Desktop.qs("#start-open-contact");
    const openResume = Desktop.qs(".start-menu [href='jamescloud_resume.pdf']");
    if (!startButton || !startMenu) return;

    const closeMenu = () => {
      startMenu.classList.remove("open");
      startMenu.setAttribute("aria-hidden", "true");
    };

    startButton.addEventListener("click", (event) => {
      event.stopPropagation();
      startMenu.classList.toggle("open");
      startMenu.setAttribute("aria-hidden", String(!startMenu.classList.contains("open")));
    });

    document.addEventListener("click", (event) => {
      if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        closeMenu();
      }
    });

    openPortfolioBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      Desktop.openWindowById("portfolio");
    });

    openProjectsBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      Desktop.openWindowById("projects");
      Desktop.ensureReposLoaded();
    });

    openContactBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      Desktop.openWindowById("contact");
    });

    openResume?.addEventListener("click", () => {
      closeMenu();
    });
  });
})();
