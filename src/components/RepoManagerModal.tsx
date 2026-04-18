import { useEffect, useState } from "react";
import type { Project, ProjectStatus } from "../types";

const githubIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.73.8 1.18 1.82 1.18 3.07 0 4.41-2.68 5.39-5.24 5.67.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

type RepoManagerModalProps = {
  open: boolean;
  currentStatus: ProjectStatus;
  projects: Project[];
  errorMessage: string;
  onClose: () => void;
  onCreateProject: (project: { title: string; repoUrl: string; status: ProjectStatus; favorite: boolean }) => Promise<void>;
  onUpdateProject: (projectId: string, patch: { status?: ProjectStatus; favorite?: boolean }) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onClearError: () => void;
};

export const RepoManagerModal = ({
  open,
  currentStatus,
  projects,
  errorMessage,
  onClose,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onClearError,
}: RepoManagerModalProps) => {
  const [title, setTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(currentStatus);

  useEffect(() => {
    if (open) {
      setStatus(currentStatus);
    }
  }, [currentStatus, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="add-project-modal" id="manager-modal">
      <div className="add-project-modal__backdrop" id="manager-backdrop" onClick={onClose}></div>
      <section className="form manager-form-shell" aria-labelledby="manager-heading">
        <div className="manager-dialog__header">
          <div className="title" id="manager-heading">
            Repo Manager
            <br />
            <span>Store, curate, and move projects across your board</span>
          </div>
          <button
            id="close-manager-button"
            type="button"
            className="button-log manager-close-button"
            aria-label="Close repo manager"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="login-with manager-chip-row" aria-hidden="true">
          <div className="button-log">★</div>
          <div className="button-log manager-chip-icon">{githubIcon}</div>
        </div>

        <form
          id="add-project-form"
          className="manager-add-form"
          onSubmit={async (event) => {
            event.preventDefault();
            onClearError();
            await onCreateProject({
              title,
              repoUrl,
              status,
              favorite: false,
            });
            setTitle("");
            setRepoUrl("");
            setStatus(currentStatus);
          }}
        >
          <input
            id="project-title-input"
            type="text"
            required
            maxLength={100}
            placeholder="Project title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            id="project-repo-input"
            type="url"
            required
            placeholder="https://github.com/username/repo"
            className="input"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
          />
          <div className="manager-add-row">
            <select
              id="project-status-input"
              className="input"
              value={status}
              onChange={(event) => setStatus(event.target.value === "done" ? "done" : "pending")}
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            <button type="submit" className="button-confirm">
              Save Repo
            </button>
          </div>
        </form>

        <p className="modal-feedback" id="manager-feedback" hidden={!errorMessage}>
          {errorMessage}
        </p>

        <div className="project-manager-list" id="project-manager-list">
          {projects.length ? (
            projects.map((project) => (
              <article key={project.id} className="project-manager-row" data-project-id={project.id}>
                <div className="project-manager-row__info">
                  <h3>{project.title}</h3>
                  <a href={project.repoUrl} target="_blank" rel="noreferrer noopener">
                    {project.repoUrl}
                  </a>
                </div>
                <div className="project-manager-row__actions">
                  <label>
                    Status
                    <select
                      className="manager-status-select input"
                      data-project-id={project.id}
                      value={project.status}
                      onChange={(event) =>
                        void onUpdateProject(project.id, {
                          status: event.target.value === "done" ? "done" : "pending",
                        })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                    </select>
                  </label>
                  <label className="manager-favorite-toggle">
                    <input
                      className="manager-favorite-input"
                      type="checkbox"
                      data-project-id={project.id}
                      checked={project.favorite}
                      onChange={(event) =>
                        void onUpdateProject(project.id, {
                          favorite: event.target.checked,
                        })
                      }
                    />
                    Favorite
                  </label>
                  <button
                    className="button-confirm manager-delete-button"
                    type="button"
                    data-project-id={project.id}
                    onClick={() => void onDeleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="manager-empty-state">No repositories stored yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};
