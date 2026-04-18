import { useEffect, useState } from "react";
import { projectApi } from "../api/projects";
import type { Project, ProjectInput } from "../types";

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = async (): Promise<void> => {
    try {
      setError(null);
      const nextProjects = await projectApi.fetchProjects();
      setProjects(nextProjects);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Unable to load repositories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshProjects();
  }, []);

  const createProject = async (project: ProjectInput): Promise<void> => {
    setError(null);
    await projectApi.createProject(project);
    await refreshProjects();
  };

  const updateProject = async (id: string, patch: Partial<ProjectInput>): Promise<void> => {
    setError(null);
    await projectApi.updateProject(id, patch);
    await refreshProjects();
  };

  const deleteProject = async (id: string): Promise<void> => {
    setError(null);
    await projectApi.deleteProject(id);
    await refreshProjects();
  };

  return {
    projects,
    loading,
    error,
    setError,
    refreshProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
