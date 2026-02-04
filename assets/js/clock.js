(function () {
  const registerInit = window.Desktop?.onInit
    ? window.Desktop.onInit.bind(window.Desktop)
    : (callback) => document.addEventListener("DOMContentLoaded", callback);

  registerInit(() => {
    const clock = document.getElementById("system-time");
    const systemDate = document.getElementById("system-date");
    const widgetClock = document.getElementById("widget-time");
    const widgetDate = document.getElementById("widget-date");
    if (!clock && !widgetClock) return;

    const formatTime = (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      const paddedMinutes = String(minutes).padStart(2, "0");
      return `${displayHours}:${paddedMinutes} ${period}`;
    };

    const updateClock = () => {
      const now = new Date();
      clock.textContent = formatTime(now);
      if (systemDate) {
        systemDate.textContent = now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      if (widgetClock) {
        widgetClock.textContent = formatTime(now);
      }
      if (widgetDate) {
        widgetDate.textContent = now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        updateClock();
      }
    });
  });
})();
