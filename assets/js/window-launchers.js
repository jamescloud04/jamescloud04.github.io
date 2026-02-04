(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const contactBtn = document.getElementById("contact-btn");
    const contactWindow = document.getElementById("contact-window");

    if (contactBtn && contactWindow) {
      contactBtn.addEventListener("click", () => {
        Desktop.openWindow(contactWindow);
      });
    }
  });
})();
