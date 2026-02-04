(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const resumeClose = document.getElementById('resume-close');

    if (viewResumeBtn) {
      viewResumeBtn.addEventListener('click', () => {
        Desktop.openWindowById('resume');
      });
    }

    if (resumeClose) {
      resumeClose.addEventListener('click', () => {
        Desktop.closeWindowById('resume');
      });
    }
  });
})();
