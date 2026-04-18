export type ProjectStatus = "done" | "pending";

export type Project = {
  id: string;
  title: string;
  repoUrl: string;
  status: ProjectStatus;
  favorite: boolean;
};

export type ProjectInput = {
  title: string;
  repoUrl: string;
  status: ProjectStatus;
  favorite: boolean;
};
