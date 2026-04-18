import type { Project, ProjectInput } from "../types";

const apiBaseUrl =
  (globalThis as typeof globalThis & { __PROJECT_API_BASE__?: string }).__PROJECT_API_BASE__ ??
  "http://localhost:3001/api";

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

export const projectApi = {
  fetchProjects: () => request<Project[]>("/projects"),
  createProject: (project: ProjectInput) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),
  updateProject: (id: string, patch: Partial<ProjectInput>) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteProject: (id: string) =>
    request<{ success: true }>(`/projects/${id}`, {
      method: "DELETE",
    }),
};
