(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const viewResumeBtn = document.getElementById('view-resume-btn');
    const viewResumeCta = document.getElementById('view-resume-cta');
    const resumeClose = document.getElementById('resume-close');
    const resumeEmbed = document.getElementById('resume-embed');
    const pdfFallback = document.querySelector('.pdf-fallback');

    const raiseResume = () => {
      const resumeWindow = Desktop.getWindow('resume');
      if (resumeWindow) {
        resumeWindow.style.zIndex = '1000';
      }
    };

    // Detect if PDF viewing is not supported (common on mobile)
    const checkPDFSupport = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      // iOS devices don't support iframe PDF viewing well
      if (isIOS || isMobile) {
        if (resumeEmbed && pdfFallback) {
          resumeEmbed.style.display = 'none';
          pdfFallback.style.display = 'block';
        }
      }
    };

    // Check PDF support on load
    if (resumeEmbed) {
      checkPDFSupport();
      
      // Also check if iframe fails to load
      resumeEmbed.addEventListener('error', () => {
        if (pdfFallback) {
          resumeEmbed.style.display = 'none';
          pdfFallback.style.display = 'block';
        }
      });
    }

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
