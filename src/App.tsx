import { useEffect, useState } from "react";
import { ProjectCard } from "./components/ProjectCard";
import { RepoManagerModal } from "./components/RepoManagerModal";
import { DoneConfirmModal } from "./components/DoneConfirmModal";
import { useProjects } from "./hooks/useProjects";
import type { Project, ProjectStatus } from "./types";

const cloudImage = "https://i.ibb.co/BKZ5z46/Mediamodifier-Design-Template.png";
const balloonImage =
  "https://i.ibb.co/rtvfLkh/kisspng-hot-air-ballooning-hot-air-balloon-festival-flight-balloon-festival-5b0c63bbf3e107-504475381.png";
const rocketImage =
  "https://i.ibb.co/LhFzH2X/kisspng-emoji-rocket-spacecraft-text-messaging-clip-art-rocket-5acb92ecc2cf10-049862491523290860798.png";

const normalizeRepoUrl = (value: string): string =>
  value.trim().match(/^https?:\/\//i) ? value.trim() : `https://${value.trim()}`;

const sortProjects = (items: Project[]): Project[] =>
  [...items].sort((left, right) => {
    if (left.favorite !== right.favorite) {
      return left.favorite ? -1 : 1;
    }

    return left.title.localeCompare(right.title);
  });

export const App = () => {
  const { projects, loading, error, setError, createProject, updateProject, deleteProject } = useProjects();
  const [currentProjectStatus, setCurrentProjectStatus] = useState<ProjectStatus>(() => {
    const savedStatus = localStorage.getItem("project-view");
    return savedStatus === "done" || savedStatus === "pending" ? savedStatus : "pending";
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [managerOpen, setManagerOpen] = useState(false);
  const [pendingDoneProjectId, setPendingDoneProjectId] = useState<string | null>(null);
  const [managerError, setManagerError] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("project-view", currentProjectStatus);
  }, [currentProjectStatus]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (pendingDoneProjectId) {
          setPendingDoneProjectId(null);
          return;
        }

        if (managerOpen) {
          setManagerOpen(false);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [managerOpen, pendingDoneProjectId]);

  const visibleProjects = sortProjects(projects).filter((project) => {
    if (project.status !== currentProjectStatus) {
      return false;
    }

    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return true;
    }

    return (
      project.title.toLowerCase().includes(normalizedSearch) ||
      project.repoUrl.toLowerCase().includes(normalizedSearch)
    );
  });

  const apiMessage =
    error ?? (loading ? "Loading repositories..." : "");

  return (
    <div className="page-shell">
      <nav className="navbar">
        <div className="brand">Projects</div>
        <div className="toggle-wrap">
          <label className="theme-switch" aria-label="Toggle dark mode">
            <input
              type="checkbox"
              id="theme-toggle"
              role="switch"
              aria-label="Toggle dark mode"
              checked={darkMode}
              onChange={() => setDarkMode((current) => !current)}
            />
            <span className="theme-slider round white">
              <img className="clouds cloud1" src={cloudImage} alt="Cloud layer one" />
              <img className="clouds cloud2" src={cloudImage} alt="Cloud layer two" />
              <span className="night"></span>
              <img className="balloon" src={balloonImage} alt="Hot air balloon" />
              <span className="star star-1">✦</span>
              <span className="star star-2">✦</span>
              <span className="star star-3">✦</span>
              <span className="star star-4">✦</span>
              <span className="star star-5">✦</span>
              <img className="spaceship" src={rocketImage} alt="Rocket" />
            </span>
          </label>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-top">
          <div className="hero-title-row">
            <h1 id="project-heading">{currentProjectStatus === "done" ? "Done" : "Pending"}</h1>
            <div className="hero-tools">
              <button
                id="add-project-button"
                className="add-project-button"
                type="button"
                aria-label="Add project card"
                onClick={() => {
                  setManagerError("");
                  setManagerOpen(true);
                }}
              >
                +
              </button>
              <div className="search-shell">
                <div className="search-input-wrapper">
                  <button className="search-icon" id="search-trigger" type="button" aria-label="Open search">
                    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M22 22L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>
                  <input
                    type="text"
                    id="project-search-input"
                    className="search-input"
                    placeholder="search.."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <label className="switch status-switch" aria-label="Toggle pending and done projects">
            <input
              className="switch__input"
              id="status-toggle"
              type="checkbox"
              role="switch"
              aria-label="Toggle pending and done projects"
              checked={currentProjectStatus === "done"}
              onChange={(event) => setCurrentProjectStatus(event.target.checked ? "done" : "pending")}
            />
            <span className="switch__base-outer"></span>
            <span className="switch__base-inner"></span>
            <svg className="switch__base-neon" viewBox="0 0 40 24" width="40" height="24" aria-hidden="true">
              <defs>
                <filter id="switch-glow">
                  <feGaussianBlur result="coloredBlur" stdDeviation="1"></feGaussianBlur>
                  <feMerge>
                    <feMergeNode in="coloredBlur"></feMergeNode>
                    <feMergeNode in="SourceGraphic"></feMergeNode>
                  </feMerge>
                </filter>
                <linearGradient id="switch-gradient1" x1="0" y1="0" x2="1" y2="0">
                  <stop className="switch-stop-1" offset="0%" stopColor="hsl(var(--filter-on-hue1),90%,70%)" />
                  <stop className="switch-stop-2" offset="100%" stopColor="hsl(var(--filter-on-hue2),90%,70%)" />
                </linearGradient>
                <linearGradient id="switch-gradient2" x1="0.7" y1="0" x2="0.3" y2="1">
                  <stop className="switch-stop-3" offset="25%" stopColor="hsla(var(--filter-on-hue1),90%,70%,0)" />
                  <stop className="switch-stop-4" offset="50%" stopColor="hsla(var(--filter-on-hue1),90%,70%,0.3)" />
                  <stop className="switch-stop-5" offset="100%" stopColor="hsla(var(--filter-on-hue2),90%,70%,0.3)" />
                </linearGradient>
              </defs>
              <path fill="none" filter="url(#switch-glow)" stroke="url(#switch-gradient1)" strokeWidth="1" strokeDasharray="0 104.26 0" strokeDashoffset="0.01" strokeLinecap="round" d="m.5,12C.5,5.649,5.649.5,12,.5h16c6.351,0,11.5,5.149,11.5,11.5s-5.149,11.5-11.5,11.5H12C5.649,23.5.5,18.351.5,12Z"></path>
            </svg>
            <span className="switch__knob-shadow"></span>
            <span className="switch__knob-container">
              <span className="switch__knob">
                <svg className="switch__knob-neon" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                  <circle fill="none" stroke="url(#switch-gradient2)" strokeDasharray="0 90.32 0 54.19" strokeLinecap="round" strokeWidth="1" r="23" cx="24" cy="24" transform="rotate(-112.5,24,24)" />
                </svg>
              </span>
            </span>
            <span className="switch__led"></span>
            <span className="switch__text">Project status filter</span>
          </label>
        </div>

        <p className="status-banner" id="api-status" hidden={!apiMessage}>
          {apiMessage}
        </p>

        <section className={`project-grid${loading ? " is-updating" : ""}`} id="project-grid" aria-label="Project cards">
          {loading ? (
            <p className="empty-state">Loading repositories...</p>
          ) : visibleProjects.length ? (
            visibleProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                index={index}
                project={project}
                onFavoriteChange={(projectId, favorite) =>
                  void updateProject(projectId, { favorite }).catch((nextError) =>
                    setError(nextError instanceof Error ? nextError.message : "Unable to favorite project.")
                  )
                }
                onRequestDone={setPendingDoneProjectId}
              />
            ))
          ) : (
            <p className="empty-state">No projects match this view right now.</p>
          )}
        </section>

        <button
          id="open-manager-button"
          className="repo-manager-fab"
          type="button"
          aria-label="Open repo manager"
          onClick={() => {
            setManagerError("");
            setManagerOpen(true);
          }}
        >
          Repo Manager
        </button>

        <RepoManagerModal
          open={managerOpen}
          currentStatus={currentProjectStatus}
          projects={sortProjects(projects)}
          errorMessage={managerError}
          onClose={() => setManagerOpen(false)}
          onClearError={() => setManagerError("")}
          onCreateProject={async (project) => {
            try {
              await createProject({
                ...project,
                repoUrl: normalizeRepoUrl(project.repoUrl),
              });
            } catch (nextError) {
              setManagerError(nextError instanceof Error ? nextError.message : "Unable to save project.");
              throw nextError;
            }
          }}
          onUpdateProject={async (projectId, patch) => {
            try {
              await updateProject(projectId, patch);
            } catch (nextError) {
              setManagerError(nextError instanceof Error ? nextError.message : "Unable to update project.");
            }
          }}
          onDeleteProject={async (projectId) => {
            try {
              await deleteProject(projectId);
            } catch (nextError) {
              setManagerError(nextError instanceof Error ? nextError.message : "Unable to delete project.");
            }
          }}
        />

        <DoneConfirmModal
          open={Boolean(pendingDoneProjectId)}
          onCancel={() => setPendingDoneProjectId(null)}
          onConfirm={() => {
            if (!pendingDoneProjectId) {
              return;
            }

            void updateProject(pendingDoneProjectId, { status: "done" })
              .then(() => setPendingDoneProjectId(null))
              .catch((nextError) => {
                setError(nextError instanceof Error ? nextError.message : "Unable to update project.");
                setPendingDoneProjectId(null);
              });
          }}
        />
      </main>
    </div>
  );
};
