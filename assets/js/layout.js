(function () {
  const Desktop = window.Desktop;

  Desktop.onInit(() => {
    requestAnimationFrame(() => {
      const windows = Array.from(document.querySelectorAll(".window-shell"))
        .filter((el) => !el.classList.contains("widget"));
      const widgetsContainer = document.getElementById("widgets-container");
      const widgets = widgetsContainer
        ? Array.from(widgetsContainer.querySelectorAll(".widget.window-shell"))
        : [];
      if (!windows.length && !widgets.length) return;

      const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

      const padding = 24;
      const topStart = 24;
      const taskbarHeight = 28;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const maxY = viewportHeight - taskbarHeight - padding;

      const applyBase = (el) => {
        if (!el) return;
        el.style.position = "fixed";
        el.style.margin = "0";
        el.style.transform = "none";
      };

      widgets.forEach(applyBase);
      windows.forEach(applyBase);

      // Phase 1: Position widgets in top-right, tracking all rectangles
      const widgetRects = new Map();
      let rightmostX = viewportWidth - padding;
      let currentY = topStart;
      let currentColumnX = viewportWidth - padding;
      let maxColumnWidth = 0;

      widgets.forEach((widget) => {
        const rect = widget.getBoundingClientRect();
        const widgetWidth = rect.width || 180;
        const widgetHeight = rect.height || 120;

        // If this widget would go below maxY, start a new column to the left
        if (currentY + widgetHeight > maxY && currentY > topStart) {
          currentColumnX -= maxColumnWidth + padding;
          currentY = topStart;
          maxColumnWidth = 0;
        }

        const widgetX = currentColumnX - widgetWidth;
        const clampedX = clamp(widgetX, padding, viewportWidth - widgetWidth - padding);
        const clampedY = clamp(currentY, topStart, maxY - widgetHeight);

        widget.style.left = `${clampedX}px`;
        widget.style.top = `${clampedY}px`;

        widgetRects.set(widget, {
          left: clampedX,
          top: clampedY,
          right: clampedX + widgetWidth,
          bottom: clampedY + widgetHeight,
          width: widgetWidth,
          height: widgetHeight
        });

        rightmostX = Math.min(rightmostX, clampedX - padding);
        maxColumnWidth = Math.max(maxColumnWidth, widgetWidth);
        currentY += widgetHeight + padding;
      });

      // Phase 2: Position windows with awareness of widget boundaries
      const pick = (id) => windows.find((el) => el.dataset.window === id);
      const portfolio = pick("portfolio");
      const projects = pick("projects");
      const contact = pick("contact");

      const maxWindowRight = rightmostX;

      // Column 1: Portfolio takes full height
      if (portfolio) {
        const portfolioWidth = portfolio.getBoundingClientRect().width || 500;
        const column1X = padding;
        const column1Right = column1X + portfolioWidth;

        // Ensure portfolio doesn't exceed widget boundary
        let finalWidth = portfolioWidth;
        if (column1Right > maxWindowRight) {
          finalWidth = maxWindowRight - column1X - padding;
        }

        portfolio.style.left = `${column1X}px`;
        portfolio.style.top = `${topStart}px`;
        portfolio.style.height = `${maxY - topStart}px`;
        portfolio.style.width = `${finalWidth}px`;
      }

      // Column 2: Projects and Contact stacked
      const column1Width = portfolio
        ? (portfolio.getBoundingClientRect().width || 500)
        : 500;
      let column2X = padding + column1Width + padding;
      column2X = clamp(column2X, padding, maxWindowRight - 360);

      let column2Y = topStart;
      let column2ContentHeight = 0;

      if (projects) {
        const projectsWidth = projects.getBoundingClientRect().width || 460;
        const projectsHeight = projects.getBoundingClientRect().height || 360;

        // Ensure projects fits before widgets
        let adjustedWidth = projectsWidth;
        if (column2X + projectsWidth > maxWindowRight) {
          adjustedWidth = maxWindowRight - column2X - padding;
        }

        projects.style.left = `${column2X}px`;
        projects.style.top = `${column2Y}px`;
        projects.style.height = "auto";
        projects.style.width = `${adjustedWidth}px`;

        const projectsRect = projects.getBoundingClientRect();
        column2ContentHeight = projectsRect.height;
        column2Y += column2ContentHeight + padding;
      }

      if (contact) {
        const contactWidth = contact.getBoundingClientRect().width || 360;
        const contactHeight = contact.getBoundingClientRect().height || 200;

        // Check if contact fits vertically in column 2
        const contactWillFit = column2Y + contactHeight <= maxY;

        if (contactWillFit) {
          // Contact goes in column 2 below projects
          let adjustedWidth = contactWidth;
          if (column2X + contactWidth > maxWindowRight) {
            adjustedWidth = maxWindowRight - column2X - padding;
          }

          contact.style.left = `${column2X}px`;
          contact.style.top = `${column2Y}px`;
          contact.style.height = "auto";
          contact.style.width = `${adjustedWidth}px`;
        } else if (column2Y <= topStart) {
          // Column 2 is empty, contact can go next to portfolio
          contact.style.left = `${column2X}px`;
          contact.style.top = `${topStart}px`;
          contact.style.height = "auto";
          contact.style.width = `${contactWidth}px`;
        } else {
          // Not enough vertical space, move contact to third column
          const column3X = clamp(column2X + 360 + padding, padding, maxWindowRight - 220);
          contact.style.left = `${column3X}px`;
          contact.style.top = `${topStart}px`;
          contact.style.height = "auto";
          contact.style.width = `${contactWidth}px`;
        }
      }

      // Phase 3: Handle any other windows (leftovers)
      const ordered = [portfolio, projects, contact].filter(Boolean);
      const leftovers = windows.filter((el) => !ordered.includes(el));
      if (leftovers.length) {
        let lx = clamp(column2X + 360 + padding, padding, maxWindowRight - 220);
        let ly = topStart;
        leftovers.forEach((el) => {
          el.style.left = `${lx}px`;
          el.style.top = `${ly}px`;
          el.style.height = "auto";
          const rect = el.getBoundingClientRect();
          ly = Math.min(ly + rect.height + padding, maxY - rect.height);
        });
      }
    });
  });
})();
