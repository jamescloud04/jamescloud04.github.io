(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const viewResumeCta = document.getElementById('view-resume-cta');
    const resumeClose = document.getElementById('resume-close');

    const raiseResume = () => {
      const resumeWindow = Desktop.getWindow('resume');
      if (resumeWindow) {
        resumeWindow.style.zIndex = '1000';
      }
    };

    if (viewResumeBtn) {
      viewResumeBtn.addEventListener('click', () => {
        Desktop.openWindowById('resume');
        raiseResume();
      });
    }

    if (viewResumeCta) {
      viewResumeCta.addEventListener('click', () => {
        Desktop.openWindowById('resume');
        raiseResume();
      });
    }

    if (resumeClose) {
      resumeClose.addEventListener('click', () => {
        Desktop.closeWindowById('resume');
        const resumeWindow = Desktop.getWindow('resume');
        if (resumeWindow) {
          resumeWindow.style.zIndex = '';
        }
      });
    }
  });
})();
