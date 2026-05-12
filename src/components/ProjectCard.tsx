import { useState } from "react";
import type { Project } from "../types";

const githubIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.69-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.14-1.17 3.14-1.17.63 1.59.24 2.76.12 3.05.73.8 1.18 1.82 1.18 3.07 0 4.41-2.68 5.39-5.24 5.67.41.35.78 1.05.78 2.11 0 1.52-.01 2.75-.01 3.12 0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

type ProjectCardProps = {
  index: number;
  project: Project;
  onFavoriteChange: (projectId: string, favorite: boolean) => void;
  onRequestDone: (projectId: string) => void;
};

export const ProjectCard = ({
  index,
  project,
  onFavoriteChange,
  onRequestDone,
}: ProjectCardProps) => {
  const [pendingHoverPreview, setPendingHoverPreview] = useState(false);
  const favoriteId = `favorite-${project.id}`;
  const doneId = `done-${project.id}`;
  const showDoneToggle = project.status !== "done";

  return (
    <article
      className={`project-card card-gradient-${index % 20}${project.favorite ? " project-card--favorite" : ""}`}
      data-project-id={project.id}
    >
      <div className="project-card__top">
        <h2>{project.title}</h2>
        <div title="Favorite" className="heart-container project-favorite-toggle">
          <input
            id={favoriteId}
            className="checkbox"
            type="checkbox"
            data-project-id={project.id}
            checked={project.favorite}
            onChange={(event) => onFavoriteChange(project.id, event.target.checked)}
          />
          <div className="svg-container">
            <svg xmlns="http://www.w3.org/2000/svg" className="svg-outline" viewBox="0 0 24 24">
              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="svg-filled" viewBox="0 0 24 24">
              <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="project-card__actions">
        <a
          className="project-github-link"
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${project.title} on GitHub`}
        >
          {githubIcon}
        </a>
        {showDoneToggle ? (
          <label
            className={`project-tickbox project-tickbox--pending${pendingHoverPreview ? " project-tickbox--preview" : ""}`}
            data-project-id={project.id}
            htmlFor={doneId}
            onMouseEnter={() => setPendingHoverPreview(true)}
            onMouseLeave={() => setPendingHoverPreview(false)}
            onPointerEnter={() => setPendingHoverPreview(true)}
            onPointerLeave={() => setPendingHoverPreview(false)}
            onFocus={() => setPendingHoverPreview(true)}
            onBlur={() => setPendingHoverPreview(false)}
          >
            <input
              id={doneId}
              type="checkbox"
              checked={false}
              onChange={() => {
                onRequestDone(project.id);
              }}
            />
            <div className="checkmark">
              <svg className="tick-mark" viewBox="0 0 58 58" aria-hidden="true">
                <path className="tick-path tick-stroke--short" d="M17 30.5L25 38.5" />
                <path className="tick-path tick-stroke--long" d="M25 38.5L42 21.5" />
              </svg>
            </div>
          </label>
        ) : null}
      </div>
    </article>
  );
};
