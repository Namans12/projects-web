import "./styles.css";

type Project = {
  id: string;
  title: string;
  description: string;
};

const projects: Project[] = [
  {
    id: "01",
    title: "Featured Build",
    description: "Use this space for a highlighted project, case study, or current work.",
  },
  {
    id: "02",
    title: "UI Experiment",
    description: "Keep another project summary here with a short, readable description.",
  },
  {
    id: "03",
    title: "Next Release",
    description: "Add future work, tools, or concepts you want visitors to notice first.",
  },
];

const cloudImage = "https://i.ibb.co/BKZ5z46/Mediamodifier-Design-Template.png";
const balloonImage =
  "https://i.ibb.co/rtvfLkh/kisspng-hot-air-ballooning-hot-air-balloon-festival-flight-balloon-festival-5b0c63bbf3e107-504475381.png";
const rocketImage =
  "https://i.ibb.co/LhFzH2X/kisspng-emoji-rocket-spacecraft-text-messaging-clip-art-rocket-5acb92ecc2cf10-049862491523290860798.png";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App mount element was not found.");
}

const projectCards = projects
  .map(
    (project) => `
      <article class="project-card">
        <span>${project.id}</span>
        <h2>${project.title}</h2>
        <p>${project.description}</p>
      </article>
    `
  )
  .join("");

app.innerHTML = `
  <div class="page-shell">
    <nav class="navbar">
      <div class="brand">Projects</div>
      <div class="toggle-wrap">
        <label class="switch" aria-label="Toggle dark mode">
          <input 
            type="checkbox" 
            id="theme-toggle" 
            role="switch" 
            aria-label="Toggle dark mode"
          />
          <span class="slider round white">
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
      <h1>Projects</h1>

      <section class="project-grid" aria-label="Project cards">
        ${projectCards}
      </section>
    </main>
  </div>
`;

const themeToggle = app.querySelector<HTMLInputElement>("#theme-toggle");

if (!themeToggle) {
  throw new Error("Theme toggle element was not found.");
}

// Apply theme
const setDarkMode = (enabled: boolean): void => {
  document.body.classList.toggle("dark", enabled);
  themeToggle.setAttribute("aria-checked", String(enabled));
};

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  themeToggle.checked = true;
  setDarkMode(true);
}

// Toggle event
themeToggle.addEventListener("change", () => {
  const isDark = themeToggle.checked;
  setDarkMode(isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Keyboard accessibility
themeToggle.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    themeToggle.checked = !themeToggle.checked;
    themeToggle.dispatchEvent(new Event("change"));
  }
});