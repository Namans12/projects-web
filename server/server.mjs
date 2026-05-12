import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "projects.json");
const port = Number(process.env.PORT ?? 3001);

const sendJson = (response, statusCode, payload) => {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(JSON.stringify(payload));
};

const sendText = (response, statusCode, message) => {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  response.end(message);
};

const normalizeProject = (project) => {
  if (!project || typeof project !== "object") {
    return null;
  }

  const title = typeof project.title === "string" ? project.title.trim() : "";
  const repoUrl = typeof project.repoUrl === "string" ? project.repoUrl.trim() : "";
  const status = project.status === "done" ? "done" : project.status === "pending" ? "pending" : null;
  const id = typeof project.id === "string" ? project.id.trim() : "";
  const favorite = typeof project.favorite === "boolean" ? project.favorite : false;
  const favoriteOrder =
    typeof project.favoriteOrder === "number" && Number.isFinite(project.favoriteOrder)
      ? project.favoriteOrder
      : null;

  if (!id || !title || !repoUrl || !status) {
    return null;
  }

  return { id, title, repoUrl, status, favorite, favoriteOrder };
};

const ensureDataFile = async () => {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(
      dataFile,
      JSON.stringify(
        [
          {
            id: "video-analyzer",
            title: "Video Analyzer",
            repoUrl: "https://github.com/Namans12/4K-Videolyzer-2.git",
            status: "done",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "music-piper",
            title: "Music Piper",
            repoUrl: "https://github.com/Namans12/musicpipeline--best.git",
            status: "done",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "water-blogger",
            title: "Water Blogger",
            repoUrl: "https://github.com/Namans12/water-logger.git",
            status: "done",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "health-hub",
            title: "Health Hub",
            repoUrl: "https://github.com/Namans12/health-hub.git",
            status: "done",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "watcher",
            title: "Watcher",
            repoUrl: "https://github.com/Namans12/watchlist.git",
            status: "done",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "invoice-dashboard",
            title: "Invoice Dashboard",
            repoUrl: "https://github.com/your-username/invoice-dashboard",
            status: "pending",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "cli-repo-reporter",
            title: "CLI Repo Reporter",
            repoUrl: "https://github.com/your-username/repo-reporter",
            status: "pending",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "changelog-generator",
            title: "Changelog Generator",
            repoUrl: "https://github.com/your-username/changelog-generator",
            status: "pending",
            favorite: false,
            favoriteOrder: null,
          },
          {
            id: "docs-search-agent",
            title: "Docs Search Agent",
            repoUrl: "https://github.com/your-username/docs-search-agent",
            status: "pending",
            favorite: false,
            favoriteOrder: null,
          },
        ],
        null,
        2
      )
    );
  }
};

const readProjects = async () => {
  await ensureDataFile();
  const raw = await readFile(dataFile, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("Projects data file must contain an array.");
  }

  return parsed.map(normalizeProject).filter(Boolean);
};

const writeProjects = async (projects) => {
  await writeFile(dataFile, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
};

const readBody = async (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large."));
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });

const parsePayload = async (request) => {
  const raw = await readBody(request);
  return raw ? JSON.parse(raw) : {};
};

const validateRepoUrl = (repoUrl) => {
  try {
    const parsed = new URL(repoUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeTitleKey = (title) => title.trim().toLocaleLowerCase();

const normalizeRepoUrlKey = (repoUrl) => {
  const parsed = new URL(repoUrl.trim());
  const normalizedPath = parsed.pathname.replace(/\/+$/, "").toLocaleLowerCase() || "/";
  const normalizedSearch = parsed.search.toLocaleLowerCase();
  return `${parsed.hostname.toLocaleLowerCase()}${normalizedPath}${normalizedSearch}`;
};

const projectConflicts = (projects, { title, repoUrl }, ignoreId = null) =>
  projects.find((project) => {
    if (ignoreId && project.id === ignoreId) {
      return false;
    }

    return (
      normalizeTitleKey(project.title) === normalizeTitleKey(title) ||
      normalizeRepoUrlKey(project.repoUrl) === normalizeRepoUrlKey(repoUrl)
    );
  });

const getNextFavoriteOrder = (projects) =>
  projects.reduce((max, project) => {
    if (typeof project.favoriteOrder === "number" && project.favoriteOrder > max) {
      return project.favoriteOrder;
    }

    return max;
  }, 0) + 1;

const createId = () => `repo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const server = createServer(async (request, response) => {
  if (!request.url || !request.method) {
    sendText(response, 400, "Invalid request.");
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  const url = new URL(request.url, `http://localhost:${port}`);

  try {
    if (request.method === "GET" && url.pathname === "/api/projects") {
      sendJson(response, 200, await readProjects());
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/projects") {
      const payload = await parsePayload(request);
      const title = typeof payload.title === "string" ? payload.title.trim() : "";
      const repoUrl = typeof payload.repoUrl === "string" ? payload.repoUrl.trim() : "";
      const status = payload.status === "done" ? "done" : payload.status === "pending" ? "pending" : null;
      const favorite = typeof payload.favorite === "boolean" ? payload.favorite : false;

      if (!title || !repoUrl || !status) {
        sendText(response, 400, "title, repoUrl and status are required.");
        return;
      }

      if (!validateRepoUrl(repoUrl)) {
        sendText(response, 400, "repoUrl must be a valid http or https URL.");
        return;
      }

      const projects = await readProjects();
      if (projectConflicts(projects, { title, repoUrl })) {
        sendText(response, 400, "Project title or repo URL already exists.");
        return;
      }

      const nextProject = {
        id: createId(),
        title,
        repoUrl,
        status,
        favorite,
        favoriteOrder: favorite ? getNextFavoriteOrder(projects) : null,
      };
      projects.push(nextProject);
      await writeProjects(projects);
      sendJson(response, 201, nextProject);
      return;
    }

    if (url.pathname.startsWith("/api/projects/")) {
      const projectId = decodeURIComponent(url.pathname.replace("/api/projects/", ""));
      const projects = await readProjects();
      const projectIndex = projects.findIndex((project) => project.id === projectId);

      if (projectIndex === -1) {
        sendText(response, 404, "Project not found.");
        return;
      }

      if (request.method === "PATCH") {
        const payload = await parsePayload(request);
        const nextProject = { ...projects[projectIndex] };
        let nextTitle = nextProject.title;
        let nextRepoUrl = nextProject.repoUrl;

        if (typeof payload.title === "string" && payload.title.trim()) {
          nextTitle = payload.title.trim();
        }

        if (typeof payload.repoUrl === "string" && payload.repoUrl.trim()) {
          if (!validateRepoUrl(payload.repoUrl.trim())) {
            sendText(response, 400, "repoUrl must be a valid http or https URL.");
            return;
          }

          nextRepoUrl = payload.repoUrl.trim();
        }

        const conflict = projectConflicts(projects, { title: nextTitle, repoUrl: nextRepoUrl }, nextProject.id);
        if (conflict) {
          sendText(response, 400, "Project title or repo URL already exists.");
          return;
        }

        nextProject.title = nextTitle;
        nextProject.repoUrl = nextRepoUrl;

        if (payload.status === "done" || payload.status === "pending") {
          nextProject.status = payload.status;
        }

        if (typeof payload.favorite === "boolean") {
          nextProject.favorite = payload.favorite;
          nextProject.favoriteOrder = payload.favorite
            ? nextProject.favoriteOrder ?? getNextFavoriteOrder(projects)
            : null;
        }

        projects[projectIndex] = nextProject;
        await writeProjects(projects);
        sendJson(response, 200, nextProject);
        return;
      }

      if (request.method === "DELETE") {
        projects.splice(projectIndex, 1);
        await writeProjects(projects);
        sendJson(response, 200, { success: true });
        return;
      }
    }

    sendText(response, 404, "Route not found.");
  } catch (error) {
    sendText(response, 500, error instanceof Error ? error.message : "Unknown server error.");
  }
});

server.listen(port, () => {
  console.log(`Repo API server listening on http://localhost:${port}`);
});
