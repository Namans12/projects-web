import { useEffect, useState } from "react";
import type { ProjectStatus } from "../types";

type AddProjectModalProps = {
  open: boolean;
  currentStatus: ProjectStatus;
  errorMessage: string;
  onClose: () => void;
  onClearError: () => void;
  onCreateProject: (project: { title: string; repoUrl: string; status: ProjectStatus; favorite: boolean }) => Promise<void>;
};

export const AddProjectModal = ({
  open,
  currentStatus,
  errorMessage,
  onClose,
  onClearError,
  onCreateProject,
}: AddProjectModalProps) => {
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
    <div className="add-project-modal" id="add-project-modal">
      <div className="add-project-modal__backdrop" id="add-project-backdrop" onClick={onClose}></div>
      <section className="form manager-form-shell add-project-dialog" aria-labelledby="add-project-heading">
        <div className="manager-dialog__header">
          <div className="title" id="add-project-heading">
            Add Repo
            <br />
            <span>Create a new project card for your board</span>
          </div>
          <button
            id="close-add-project-button"
            type="button"
            className="button-log manager-close-button"
            aria-label="Close add project dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          id="quick-add-project-form"
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
            onClose();
          }}
        >
          <input
            id="quick-project-title-input"
            type="text"
            required
            maxLength={100}
            placeholder="Project title"
            className="input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            id="quick-project-repo-input"
            type="url"
            required
            placeholder="https://github.com/username/repo"
            className="input"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
          />
          <div className="manager-add-row">
            <select
              id="quick-project-status-input"
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

        <p className="modal-feedback" id="quick-manager-feedback" hidden={!errorMessage}>
          {errorMessage}
        </p>
      </section>
    </div>
  );
};
