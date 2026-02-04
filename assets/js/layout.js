(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const windows = Desktop.getWindows();
    windows.forEach((el) => {
      if (!el.classList.contains("dragging")) {
        Desktop.setWindowFloating(el, false);
      }
    });
  });
})();
