(function () {
  let setActiveTaskbar = () => {};
  // Window controls
  const contactBtn = document.getElementById('contact-btn');
  const contactWindow = document.getElementById('contact-window');
  const contactClose = document.getElementById('contact-close');

  const openWindow = (windowEl) => {
    if (!windowEl) return;
    windowEl.classList.remove("window-hidden", "window-minimized");
  };

  const closeWindow = (windowEl) => {
    if (!windowEl) return;
    windowEl.classList.add("window-hidden");
  };

  if (contactBtn && contactWindow && contactClose) {
    contactBtn.addEventListener('click', () => {
      openWindow(contactWindow);
    });

    contactClose.addEventListener('click', () => {
      closeWindow(contactWindow);
    });
  }

  // Repos Modal controls
  const reposBtn = document.getElementById('repos-btn');
  const reposWindow = document.getElementById('projects-window');
  const reposClose = document.getElementById('projects-close');
  const reposList = document.getElementById('repos-list');

  async function fetchRepos() {
    try {
      if (!reposList) return;
      const response = await fetch('https://api.github.com/users/jamescloud04/repos?sort=updated&per_page=100');
      const repos = await response.json();
      const validRepos = repos.filter(repo => !repo.fork);

      const html = validRepos.slice(0, 20).map(repo => {
        const pagesUrl = repo.homepage && repo.homepage.trim().length > 0
          ? repo.homepage
          : repo.has_pages
            ? `https://${repo.owner.login}.github.io/${repo.name}`
            : '';

        const isPages = repo.has_pages || (pagesUrl && pagesUrl.includes('github.io'));

        return `
          <div class="repo-item ${isPages ? 'repo-pages' : ''}">
            <h4>
              <a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a>
              ${isPages ? '<span class="pages-badge">Pages</span>' : ''}
            </h4>
            ${repo.description ? `<p>${repo.description}</p>` : ''}
            <div class="repo-meta">
              ${repo.language ? `<div class="repo-language"><span class="language-dot"></span>${repo.language}</div>` : ''}
              ${repo.stargazers_count > 0 ? `<span>⭐ ${repo.stargazers_count}</span>` : ''}
              ${isPages ? `<a href="${pagesUrl}" target="_blank" rel="noreferrer" class="live-link">🌐 Visit pages site</a>` : ''}
            </div>
          </div>
        `;
      }).join('');

      reposList.innerHTML = html || '<p class="loading">No repositories found</p>';
      if (html) {
        reposList.dataset.loaded = "true";
      }
    } catch (error) {
      if (reposList) {
        reposList.innerHTML = '<p class="loading">Failed to load repositories</p>';
      }
    }
  }

  const ensureReposLoaded = () => {
    if (!reposWindow || !reposList) return;
    /* Legacy file retained intentionally. Logic has been moved into modular scripts. */
    if (reposList.querySelector('.loading')) {
