(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const emailLinks = document.querySelectorAll(".email-link");
    emailLinks.forEach((link) => {
      link.style.cursor = "pointer";
      link.style.userSelect = "none";
      
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const email = link.dataset.email;
        navigator.clipboard.writeText(email).then(() => {
          const originalText = link.textContent;
          link.textContent = "Copied!";
          setTimeout(() => {
            link.textContent = originalText;
          }, 2000);
        }).catch(() => {
          link.textContent = "Failed to copy";
          setTimeout(() => {
            link.textContent = originalText;
          }, 2000);
        });
      });
    });
  });
})();
