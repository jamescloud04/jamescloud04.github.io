(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const startButton = document.querySelector(".start-btn");
    const startMenu = document.getElementById("start-menu");
    const openPortfolioBtn = document.getElementById("start-open-portfolio");
    const openProjectsBtn = document.getElementById("start-open-projects");
    const openContactBtn = document.getElementById("start-open-contact");
    const openResume = document.querySelector(".start-menu [href='jamescloud_resume.pdf']");
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
      const portfolioWindow = document.querySelector(".content.window");
      Desktop.openWindow(portfolioWindow);
    });

    openProjectsBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      const projectsWindow = document.getElementById("projects-window");
      Desktop.openWindow(projectsWindow);
      Desktop.ensureReposLoaded();
    });

    openContactBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      closeMenu();
      const contactWin = document.getElementById("contact-window");
      Desktop.openWindow(contactWin);
    });

    openResume?.addEventListener("click", () => {
      closeMenu();
    });
  });
})();
