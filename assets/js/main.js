(() => {
  const USER = "Kaztral-ar";
  const API = "https://api.github.com";

  const esc = (value = "") =>
    String(value).replace(/[&<>"']/g, c => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[c]));

  const projects = document.getElementById("projects");

  async function github(path) {
    const response = await fetch(API + path, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("GitHub API " + response.status);
    return response.json();
  }

  function renderProjects(repos) {
    if (!repos.length) {
      projects.innerHTML = '<div class="loading">No public repositories found.</div>';
      return;
    }

    projects.innerHTML = repos.slice(0, 8).map(repo => {
      const language = repo.language || "Code";
      const description = repo.description || "Open-source project by Kaztral.";
      return `
        <a class="project" href="${esc(repo.html_url)}" target="_blank" rel="noopener">
          <div class="project-top">
            <span class="project-name">${esc(repo.name)}</span>
            <span class="project-arrow">↗</span>
          </div>
          <p class="project-description">${esc(description)}</p>
          <div class="project-meta">
            <span>${esc(language)}</span>
            <span>★ ${repo.stargazers_count}</span>
            <span>⑂ ${repo.forks_count}</span>
            <span>Updated ${new Date(repo.updated_at).toLocaleDateString()}</span>
          </div>
        </a>
      `;
    }).join("");
  }

  async function loadProfile() {
    try {
      const [profile, repos] = await Promise.all([
        github("/users/" + USER),
        github("/users/" + USER + "/repos?per_page=100&type=owner&sort=updated")
      ]);

      document.getElementById("repoCount").textContent = profile.public_repos;
      document.getElementById("followers").textContent = profile.followers;
      document.getElementById("following").textContent = profile.following;

      const owned = repos.filter(repo => !repo.fork);
      renderProjects(owned);

      document.getElementById("activityYear").textContent =
        new Date().getFullYear().toString();
    } catch (error) {
      console.warn("GitHub data could not be loaded:", error);
      projects.innerHTML = '<div class="loading">GitHub data is temporarily unavailable.</div>';
    }
  }

  loadProfile();
})();
