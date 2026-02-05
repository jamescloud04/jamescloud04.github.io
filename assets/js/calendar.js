(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    const calendarWidget = document.getElementById("calendar-widget");
    if (!calendarWidget) return;

    const renderCalendar = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let html = `<div style="margin-bottom: 8px; font-weight: bold; text-align: center;">${monthNames[month]} ${year}</div>`;
      html += '<div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center;">';
      
      const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
      dayLabels.forEach(day => {
        html += `<div style="font-size: 9px; font-weight: bold;">${day}</div>`;
      });
      
      for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
      }
      
      const currentDay = now.getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDay ? 'font-weight: bold; background: #0a246a; color: white; padding: 2px;' : '';
        html += `<div style="font-size: 10px; ${isToday}">${day}</div>`;
      }
      
      html += '</div>';
      calendarWidget.innerHTML = html;
    };

    renderCalendar();
    
    setInterval(renderCalendar, 60000);
  });
})();
