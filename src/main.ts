import "./styles.css";

type ProjectStatus = "done" | "pending";

type Project = {
  id: string;
  title: string;
  repoUrl: string;
  status: ProjectStatus;
  favorite: boolean;
};

type CreateProjectInput = {
  title: string;
  repoUrl: string;
  status: ProjectStatus;
  favorite: boolean;
};

const cloudImage = "https://i.ibb.co/BKZ5z46/Mediamodifier-Design-Template.png";
const balloonImage =
  "https://i.ibb.co/rtvfLkh/kisspng-hot-air-ballooning-hot-air-balloon-festival-flight-balloon-festival-5b0c63bbf3e107-504475381.png";
const rocketImage =
  "https://i.ibb.co/LhFzH2X/kisspng-emoji-rocket-spacecraft-text-messaging-clip-art-rocket-5acb92ecc2cf10-049862491523290860798.png";
const apiBaseUrl =
  (globalThis as typeof globalThis & { __PROJECT_API_BASE__?: string }).__PROJECT_API_BASE__ ??
  "http://localhost:3001/api";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App mount element was not found.");
}

let projects: Project[] = [];
let currentProjectStatus: ProjectStatus = "pending";
let searchTerm = "";
let switchTimeoutId: number | undefined;
let pendingDoneProjectId: string | null = null;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeRepoUrl = (value: string): string =>
  value.trim().match(/^https?:\/\//i) ? value.trim() : `https://${value.trim()}`;

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const fetchProjects = async (): Promise<Project[]> => request<Project[]>("/projects");

const createProject = async (project: CreateProjectInput): Promise<Project> =>
  request<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

const updateProject = async (id: string, patch: Partial<CreateProjectInput>): Promise<Project> =>
  request<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });

const deleteProject = async (id: string): Promise<void> => {
  await request<{ success: true }>(`/projects/${id}`, {
    method: "DELETE",
  });
};

const sortProjects = (items: Project[]): Project[] =>
  [...items].sort((left, right) => {
    if (left.favorite !== right.favorite) {
      return left.favorite ? -1 : 1;
    }

    return left.title.localeCompare(right.title);
  });

const githubIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.73.8 1.18 1.82 1.18 3.07 0 4.41-2.68 5.39-5.24 5.67.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>
  </svg>
`;

const getVisibleProjects = (status: ProjectStatus): Project[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return sortProjects(projects).filter((project) => {
    if (project.status !== status) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return (
      project.title.toLowerCase().includes(normalizedSearch) ||
      project.repoUrl.toLowerCase().includes(normalizedSearch)
    );
  });
};

const renderCards = (status: ProjectStatus): string => {
  const filteredProjects = getVisibleProjects(status);

  if (!filteredProjects.length) {
    return '<p class="empty-state">No projects match this view right now.</p>';
  }

  return filteredProjects
    .map((project, index) => {
      const gradientClass = `card-gradient-${index % 20}`;
      const favoriteId = `favorite-${project.id}`;
      const doneId = `done-${project.id}`;

      return `
        <article class="project-card ${gradientClass}${project.favorite ? " project-card--favorite" : ""}">
          <div class="project-card__top">
            <h2>${escapeHtml(project.title)}</h2>
            <div title="Favorite" class="heart-container project-favorite-toggle">
              <input id="${favoriteId}" class="checkbox" type="checkbox" data-project-id="${project.id}" ${
                project.favorite ? "checked" : ""
              }>
              <div class="svg-container">
                <svg xmlns="http://www.w3.org/2000/svg" class="svg-outline" viewBox="0 0 24 24">
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="svg-filled" viewBox="0 0 24 24">
                  <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" height="100" width="100" class="svg-celebrate">
                  <polygon points="10,10 20,20"></polygon>
                  <polygon points="10,50 20,50"></polygon>
                  <polygon points="20,80 30,70"></polygon>
                  <polygon points="90,10 80,20"></polygon>
                  <polygon points="90,50 80,50"></polygon>
                  <polygon points="80,80 70,70"></polygon>
                </svg>
              </div>
            </div>
          </div>
          <div class="project-card__actions">
            <label class="project-tickbox" data-project-id="${project.id}" for="${doneId}">
              <input id="${doneId}" type="checkbox" ${project.status === "done" ? 'checked disabled' : ""} />
              <div class="checkmark"></div>
            </label>
            <a class="project-github-link" href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noreferrer noopener" aria-label="Open ${escapeHtml(project.title)} on GitHub">${githubIcon}</a>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderManagerRows = (): string => {
  if (!projects.length) {
    return '<p class="manager-empty-state">No repositories stored yet.</p>';
  }

  return sortProjects(projects)
    .map(
      (project) => `
        <article class="project-manager-row" data-project-id="${project.id}">
          <div class="project-manager-row__info">
            <h3>${escapeHtml(project.title)}</h3>
            <a href="${escapeHtml(project.repoUrl)}" target="_blank" rel="noreferrer noopener">${escapeHtml(project.repoUrl)}</a>
          </div>
          <div class="project-manager-row__actions">
            <label>
              Status
              <select class="manager-status-select input" data-project-id="${project.id}">
                <option value="pending" ${project.status === "pending" ? "selected" : ""}>Pending</option>
                <option value="done" ${project.status === "done" ? "selected" : ""}>Done</option>
              </select>
            </label>
            <label class="manager-favorite-toggle">
              <input class="manager-favorite-input" type="checkbox" data-project-id="${project.id}" ${
                project.favorite ? "checked" : ""
              }>
              Favorite
            </label>
            <button class="button-confirm manager-delete-button" type="button" data-project-id="${project.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
};

app.innerHTML = `
  <div class="page-shell">
    <nav class="navbar">
      <div class="brand">Projects</div>
      <div class="toggle-wrap">
        <label class="theme-switch" aria-label="Toggle dark mode">
          <input 
            type="checkbox" 
            id="theme-toggle" 
            role="switch" 
            aria-label="Toggle dark mode"
          />
          <span class="theme-slider round white">
            <img class="clouds cloud1" src="${cloudImage}" alt="Cloud layer one" />
            <img class="clouds cloud2" src="${cloudImage}" alt="Cloud layer two" />
            <span class="night"></span>
            <img class="balloon" src="${balloonImage}" alt="Hot air balloon" />
            <span class="star star-1">✦</span>
            <span class="star star-2">✦</span>
            <span class="star star-3">✦</span>
            <span class="star star-4">✦</span>
            <span class="star star-5">✦</span>
            <img class="spaceship" src="${rocketImage}" alt="Rocket" />
          </span>
        </label>
      </div>
    </nav>

    <main class="hero">
      <div class="hero-top">
        <div class="hero-title-row">
          <h1 id="project-heading">Pending</h1>
          <div class="hero-tools">
            <button id="add-project-button" class="add-project-button" type="button" aria-label="Add project card">+</button>
            <div class="search-shell">
              <div class="search-input-wrapper">
                <button class="search-icon" id="search-trigger" type="button" aria-label="Open search">
                  <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M22 22L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </button>
                <input type="text" id="project-search-input" class="search-input" placeholder="search.." value="${escapeHtml(searchTerm)}" />
              </div>
            </div>
          </div>
        </div>
        <label class="switch status-switch" aria-label="Toggle pending and done projects">
          <input class="switch__input" id="status-toggle" type="checkbox" role="switch" aria-label="Toggle pending and done projects">
          <span class="switch__base-outer"></span>
          <span class="switch__base-inner"></span>
          <svg class="switch__base-neon" viewBox="0 0 40 24" width="40" height="24" aria-hidden="true">
            <defs>
              <filter id="switch-glow">
                <feGaussianBlur result="coloredBlur" stdDeviation="1"></feGaussianBlur>
                <feMerge>
                  <feMergeNode in="coloredBlur"></feMergeNode>
                  <feMergeNode in="SourceGraphic"></feMergeNode>
                </feMerge>
              </filter>
              <linearGradient id="switch-gradient1" x1="0" y1="0" x2="1" y2="0">
                <stop class="switch-stop-1" offset="0%" stop-color="hsl(var(--filter-on-hue1),90%,70%)" />
                <stop class="switch-stop-2" offset="100%" stop-color="hsl(var(--filter-on-hue2),90%,70%)" />
              </linearGradient>
              <linearGradient id="switch-gradient2" x1="0.7" y1="0" x2="0.3" y2="1">
                <stop class="switch-stop-3" offset="25%" stop-color="hsla(var(--filter-on-hue1),90%,70%,0)" />
                <stop class="switch-stop-4" offset="50%" stop-color="hsla(var(--filter-on-hue1),90%,70%,0.3)" />
                <stop class="switch-stop-5" offset="100%" stop-color="hsla(var(--filter-on-hue2),90%,70%,0.3)" />
              </linearGradient>
            </defs>
            <path fill="none" filter="url(#switch-glow)" stroke="url(#switch-gradient1)" stroke-width="1" stroke-dasharray="0 104.26 0" stroke-dashoffset="0.01" stroke-linecap="round" d="m.5,12C.5,5.649,5.649.5,12,.5h16c6.351,0,11.5,5.149,11.5,11.5s-5.149,11.5-11.5,11.5H12C5.649,23.5.5,18.351.5,12Z"></path>
          </svg>
          <span class="switch__knob-shadow"></span>
          <span class="switch__knob-container">
            <span class="switch__knob">
              <svg class="switch__knob-neon" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                <circle fill="none" stroke="url(#switch-gradient2)" stroke-dasharray="0 90.32 0 54.19" stroke-linecap="round" stroke-width="1" r="23" cx="24" cy="24" transform="rotate(-112.5,24,24)" />
              </svg>
            </span>
          </span>
          <span class="switch__led"></span>
          <span class="switch__text">Project status filter</span>
        </label>
      </div>

      <p class="status-banner" id="api-status" hidden></p>

      <section class="project-grid" id="project-grid" aria-label="Project cards">
        <p class="empty-state">Loading repositories...</p>
      </section>

      <button id="open-manager-button" class="repo-manager-fab" type="button" aria-label="Open repo manager">
        Repo Manager
      </button>

      <div class="add-project-modal" id="manager-modal" hidden>
        <div class="add-project-modal__backdrop" id="manager-backdrop"></div>
        <section class="form manager-form-shell" aria-labelledby="manager-heading">
          <div class="manager-dialog__header">
            <div class="title" id="manager-heading">Repo Manager<br><span>Store, curate, and move projects across your board</span></div>
            <button id="close-manager-button" type="button" class="button-log manager-close-button" aria-label="Close repo manager">×</button>
          </div>

          <div class="login-with manager-chip-row" aria-hidden="true">
            <div class="button-log">★</div>
            <div class="button-log manager-chip-icon">${githubIcon}</div>
          </div>

          <form id="add-project-form" class="manager-add-form">
            <input id="project-title-input" type="text" required maxlength="100" placeholder="Project title" class="input" />
            <input id="project-repo-input" type="url" required placeholder="https://github.com/username/repo" class="input" />
            <div class="manager-add-row">
              <select id="project-status-input" class="input">
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
              <button type="submit" class="button-confirm">Save Repo</button>
            </div>
          </form>

          <p class="modal-feedback" id="manager-feedback" hidden></p>
          <div class="project-manager-list" id="project-manager-list"></div>
        </section>
      </div>

      <div class="add-project-modal" id="done-confirm-modal" hidden>
        <div class="add-project-modal__backdrop" id="done-confirm-backdrop"></div>
        <section class="confirm-dialog" aria-labelledby="done-confirm-heading">
          <h2 id="done-confirm-heading">Do you want to mark this project as Done?</h2>
          <div class="confirm-dialog__actions">
            <button id="confirm-done-no" class="confirm-button confirm-button--ghost" type="button">No</button>
            <button id="confirm-done-yes" class="confirm-button" type="button">Yes</button>
          </div>
        </section>
      </div>
    </main>
  </div>
`;

const themeToggle = app.querySelector<HTMLInputElement>("#theme-toggle");
const statusToggle = app.querySelector<HTMLInputElement>("#status-toggle");
const projectGrid = app.querySelector<HTMLElement>("#project-grid");
const projectHeading = app.querySelector<HTMLElement>("#project-heading");
const apiStatus = app.querySelector<HTMLElement>("#api-status");
const addProjectButton = app.querySelector<HTMLButtonElement>("#add-project-button");
const searchTrigger = app.querySelector<HTMLButtonElement>("#search-trigger");
const searchInput = app.querySelector<HTMLInputElement>("#project-search-input");
const openManagerButton = app.querySelector<HTMLButtonElement>("#open-manager-button");
const managerModal = app.querySelector<HTMLElement>("#manager-modal");
const managerBackdrop = app.querySelector<HTMLElement>("#manager-backdrop");
const addProjectForm = app.querySelector<HTMLFormElement>("#add-project-form");
const projectTitleInput = app.querySelector<HTMLInputElement>("#project-title-input");
const projectRepoInput = app.querySelector<HTMLInputElement>("#project-repo-input");
const projectStatusInput = app.querySelector<HTMLSelectElement>("#project-status-input");
const closeManagerButton = app.querySelector<HTMLButtonElement>("#close-manager-button");
const projectManagerList = app.querySelector<HTMLElement>("#project-manager-list");
const managerFeedback = app.querySelector<HTMLElement>("#manager-feedback");
const doneConfirmModal = app.querySelector<HTMLElement>("#done-confirm-modal");
const doneConfirmBackdrop = app.querySelector<HTMLElement>("#done-confirm-backdrop");
const confirmDoneNo = app.querySelector<HTMLButtonElement>("#confirm-done-no");
const confirmDoneYes = app.querySelector<HTMLButtonElement>("#confirm-done-yes");

if (
  !themeToggle ||
  !statusToggle ||
  !projectGrid ||
  !projectHeading ||
  !apiStatus ||
  !addProjectButton ||
  !searchTrigger ||
  !searchInput ||
  !openManagerButton ||
  !managerModal ||
  !managerBackdrop ||
  !addProjectForm ||
  !projectTitleInput ||
  !projectRepoInput ||
  !projectStatusInput ||
  !closeManagerButton ||
  !projectManagerList ||
  !managerFeedback ||
  !doneConfirmModal ||
  !doneConfirmBackdrop ||
  !confirmDoneNo ||
  !confirmDoneYes
) {
  throw new Error("One or more UI elements were not found.");
}

const setFeedback = (element: HTMLElement, message: string): void => {
  element.textContent = message;
  element.hidden = !message;
};

const setDarkMode = (enabled: boolean): void => {
  document.body.classList.toggle("dark", enabled);
  themeToggle.setAttribute("aria-checked", String(enabled));
};

const syncManagerList = (): void => {
  projectManagerList.innerHTML = renderManagerRows();
};

const setFilterState = (status: ProjectStatus): void => {
  projectGrid.classList.add("is-updating");
  window.clearTimeout(switchTimeoutId);

  switchTimeoutId = window.setTimeout(() => {
    projectGrid.innerHTML = renderCards(status);
    projectGrid.classList.remove("is-updating");
  }, 120);

  projectHeading.textContent = status === "done" ? "Done" : "Pending";
  statusToggle.checked = status === "done";
  statusToggle.setAttribute("aria-checked", String(statusToggle.checked));
  currentProjectStatus = status;
  localStorage.setItem("project-view", status);
  syncManagerList();
};

const refreshProjects = async (): Promise<void> => {
  projects = await fetchProjects();
  apiStatus.hidden = true;
  setFilterState(currentProjectStatus);
};

const openManagerModal = (): void => {
  setFeedback(managerFeedback, "");
  projectStatusInput.value = currentProjectStatus;
  syncManagerList();
  managerModal.hidden = false;
  projectTitleInput.focus();
};

const closeManagerModal = (): void => {
  managerModal.hidden = true;
  addProjectForm.reset();
  openManagerButton.focus();
};

const openDoneConfirmModal = (projectId: string): void => {
  pendingDoneProjectId = projectId;
  doneConfirmModal.hidden = false;
  confirmDoneNo.focus();
};

const closeDoneConfirmModal = (): void => {
  pendingDoneProjectId = null;
  doneConfirmModal.hidden = true;
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  themeToggle.checked = true;
  setDarkMode(true);
}

statusToggle.setAttribute("aria-checked", "false");

themeToggle.addEventListener("change", () => {
  const isDark = themeToggle.checked;
  setDarkMode(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

statusToggle.addEventListener("change", () => {
  const selectedStatus: ProjectStatus = statusToggle.checked ? "done" : "pending";
  setFilterState(selectedStatus);
});

addProjectButton.addEventListener("click", () => {
  openManagerModal();
});

searchTrigger.addEventListener("click", () => {
  searchInput.focus();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value;
  setFilterState(currentProjectStatus);
});

openManagerButton.addEventListener("click", () => {
  openManagerModal();
});

closeManagerButton.addEventListener("click", () => {
  closeManagerModal();
});

managerBackdrop.addEventListener("click", () => {
  closeManagerModal();
});

doneConfirmBackdrop.addEventListener("click", () => {
  closeDoneConfirmModal();
});

confirmDoneNo.addEventListener("click", () => {
  closeDoneConfirmModal();
});

confirmDoneYes.addEventListener("click", async () => {
  if (!pendingDoneProjectId) {
    closeDoneConfirmModal();
    return;
  }

  try {
    await updateProject(pendingDoneProjectId, { status: "done" });
    closeDoneConfirmModal();
    await refreshProjects();
  } catch (error) {
    closeDoneConfirmModal();
    apiStatus.hidden = false;
    apiStatus.textContent = error instanceof Error ? error.message : "Unable to update project.";
  }
});

addProjectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!projectTitleInput.value.trim() || !projectRepoInput.value.trim()) {
    addProjectForm.reportValidity();
    return;
  }

  try {
    setFeedback(managerFeedback, "");

    await createProject({
      title: projectTitleInput.value.trim(),
      repoUrl: normalizeRepoUrl(projectRepoInput.value),
      status: projectStatusInput.value === "done" ? "done" : "pending",
      favorite: false,
    });

    await refreshProjects();
    addProjectForm.reset();
    projectStatusInput.value = currentProjectStatus;
  } catch (error) {
    setFeedback(managerFeedback, error instanceof Error ? error.message : "Unable to save project.");
  }
});

projectGrid.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const tickbox = target.closest<HTMLElement>(".project-tickbox");

  if (!tickbox?.dataset.projectId) {
    return;
  }

  const project = projects.find((item) => item.id === tickbox.dataset.projectId);
  if (!project || project.status === "done") {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  openDoneConfirmModal(project.id);
});

projectGrid.addEventListener("change", async (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || !target.matches(".heart-container .checkbox")) {
    return;
  }

  if (!target.dataset.projectId) {
    return;
  }

  try {
    await updateProject(target.dataset.projectId, { favorite: target.checked });
    await refreshProjects();
  } catch (error) {
    target.checked = !target.checked;
    apiStatus.hidden = false;
    apiStatus.textContent = error instanceof Error ? error.message : "Unable to favorite project.";
  }
});

projectManagerList.addEventListener("change", async (event) => {
  const target = event.target as HTMLElement;
  const select = target.closest<HTMLSelectElement>(".manager-status-select");
  const favoriteToggle = target.closest<HTMLInputElement>(".manager-favorite-input");

  try {
    setFeedback(managerFeedback, "");

    if (select?.dataset.projectId) {
      await updateProject(select.dataset.projectId, {
        status: select.value === "done" ? "done" : "pending",
      });
      await refreshProjects();
      return;
    }

    if (favoriteToggle?.dataset.projectId) {
      await updateProject(favoriteToggle.dataset.projectId, {
        favorite: favoriteToggle.checked,
      });
      await refreshProjects();
    }
  } catch (error) {
    setFeedback(managerFeedback, error instanceof Error ? error.message : "Unable to update project.");
  }
});

projectManagerList.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
  const deleteButton = target.closest<HTMLButtonElement>(".manager-delete-button");

  if (!deleteButton?.dataset.projectId) {
    return;
  }

  try {
    setFeedback(managerFeedback, "");
    await deleteProject(deleteButton.dataset.projectId);
    await refreshProjects();
  } catch (error) {
    setFeedback(managerFeedback, error instanceof Error ? error.message : "Unable to delete project.");
  }
});

themeToggle.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    themeToggle.checked = !themeToggle.checked;
    themeToggle.dispatchEvent(new Event("change"));
  }
});

statusToggle.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    statusToggle.checked = !statusToggle.checked;
    statusToggle.dispatchEvent(new Event("change"));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!doneConfirmModal.hidden) {
      closeDoneConfirmModal();
      return;
    }

    if (!managerModal.hidden) {
      closeManagerModal();
    }
  }
});

const savedStatus = localStorage.getItem("project-view");
if (savedStatus === "done" || savedStatus === "pending") {
  currentProjectStatus = savedStatus;
}

refreshProjects().catch((error) => {
  apiStatus.hidden = false;
  apiStatus.textContent =
    error instanceof Error ? error.message : "Backend unavailable. Start the repo API server on port 3001.";
  projectGrid.innerHTML = `<p class="empty-state">${escapeHtml(apiStatus.textContent)}</p>`;
});
