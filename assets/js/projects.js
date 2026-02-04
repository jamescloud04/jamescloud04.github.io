(function () {
  const Desktop = window.Desktop || {
    onInit: (callback) => document.addEventListener("DOMContentLoaded", callback),
    ensureReposLoaded: () => {},
    openWindow: () => {},
    closeWindow: () => {},
    qs: (selector, scope = document) => scope.querySelector(selector),
    getWindow: () => null,
  };

  Desktop.onInit(() => {
    const reposBtn = Desktop.qs("#repos-btn");
    const reposWindow = Desktop.getWindow("projects") || Desktop.qs("#projects-window");
    const reposClose = Desktop.qs("#projects-close");
    const reposList = Desktop.qs("#repos-list");

    const fetchRepos = async () => {
      try {
        if (!reposList) return;
        const response = await fetch("https://api.github.com/users/jamescloud04/repos?sort=updated&per_page=100");
        const repos = await response.json();
        const validRepos = repos.filter((repo) => !repo.fork);

        const html = validRepos.slice(0, 20).map((repo) => {
          const pagesUrl = repo.homepage && repo.homepage.trim().length > 0
            ? repo.homepage
            : repo.has_pages
              ? `https://${repo.owner.login}.github.io/${repo.name}`
              : "";

          const isPages = repo.has_pages || (pagesUrl && pagesUrl.includes("github.io"));

          return `
            <div class="repo-item ${isPages ? "repo-pages" : ""}">
              <h4>
                <a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a>
                ${isPages ? "<span class=\"pages-badge\">Pages</span>" : ""}
              </h4>
              ${repo.description ? `<p>${repo.description}</p>` : ""}
              <div class="repo-meta">
                ${repo.language ? `<div class=\"repo-language\"><span class=\"language-dot\"></span>${repo.language}</div>` : ""}
                ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ""}
                ${isPages ? `<a href=\"${pagesUrl}\" target=\"_blank\" rel=\"noreferrer\" class=\"live-link\">🌐 Visit pages site</a>` : ""}
              </div>
            </div>
          `;
        }).join("");

        reposList.innerHTML = html || "<p class=\"loading\">No repositories found</p>";
        if (html) {
          reposList.dataset.loaded = "true";
        }
      } catch (error) {
        if (reposList) {
          reposList.innerHTML = "<p class=\"loading\">Failed to load repositories</p>";
        }
      }
    };

    Desktop.ensureReposLoaded = () => {
      if (!reposWindow || !reposList) return;
      if (reposList.dataset.loaded === "true") return;
      if (reposList.querySelector(".loading")) {
        fetchRepos();
      }
    };

    if (reposBtn && reposWindow && reposClose) {
      reposBtn.addEventListener("click", () => {
        Desktop.openWindow(reposWindow);
        Desktop.ensureReposLoaded();
      });

      reposClose.addEventListener("click", () => {
        Desktop.closeWindow(reposWindow);
      });
    }

    if (reposWindow && !reposWindow.classList.contains("window-hidden")) {
      Desktop.ensureReposLoaded();
    }

    if (!reposWindow && reposList) {
      fetchRepos();
    }
  });
})();
