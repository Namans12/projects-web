# togglepage

A minimal project showcase page built in vanilla TypeScript — no framework, no runtime dependencies.

> **Note:** the previous README described this as *"a project manager for github for locally managing repos by user"*. The code does not do that. There is no GitHub integration and no repository management — it is a static showcase page. If the repo manager is what you intended to build, this is the starting shell for it.

## Overview

A single page listing projects from a typed array. The entire application is one TypeScript file plus a stylesheet; the build is Vite with nothing else in the dependency tree.

Its interest is the tooling rather than the output: Playwright UI tests, strict type-checking, and a combined `validate` gate are all wired up for a page with no runtime dependencies at all.

## Features

- Project list rendered from a typed `Project[]`
- Zero runtime dependencies — no React, no framework
- Playwright UI testing
- ESLint + TypeScript strict checking
- Single `validate` script gating lint, types, and tests together

## Tech Stack

TypeScript 5.4 · Vite 5 · Playwright 1.59 · ESLint 8 + `@typescript-eslint` 8

Everything is a dev dependency. The shipped bundle is compiled TypeScript and CSS.

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
git clone https://github.com/Namans12/projects-web.git
cd projects-web
npm install
npx playwright install    # only if running UI tests
```

## Usage

```bash
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check then build |
| `npm run preview` | Serve the build |
| `npm run lint` | ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run test:ui` | Playwright tests |
| `npm run validate` | lint + type-check + tests — the full gate |
| `npm run ai` | Runs `ai-dev.js` (see below) |

## Editing the project list

Projects are defined at the top of [`src/main.ts`](src/main.ts):

```ts
type Project = {
  id: string
  title: string
  description: string
}
```

The committed entries are placeholders — *"Featured Build"*, *"UI Experiment"*, *"Next Release"* — with instructional copy rather than real content. Replace them with actual projects.

## Project Structure

```
src/
  main.ts          the entire application — project data and rendering
  styles.css
index.html
ai-dev.js          AI-assisted development runner
AI_AGENTS.md       multi-role agent prompt definitions
AI_RULES.md        constraints for AI-assisted edits
AI_WORKFLOW.md     the intended workflow
```

## AI-assisted development

This repo carries an AI-assisted workflow: [`AI_AGENTS.md`](AI_AGENTS.md) defines internal roles (planner and others) for a model to adopt, [`AI_RULES.md`](AI_RULES.md) sets constraints, and [`AI_WORKFLOW.md`](AI_WORKFLOW.md) describes the process. `npm run ai` invokes `ai-dev.js`.

This scaffolding is independent of the page itself and is arguably the more transferable part of the repository.

## Related Repositories

| Repo | Relationship |
|---|---|
| [`projects-library`](https://github.com/Namans12/projects-library) | Similar name, genuinely different — a React 19 scroll-driven project wall. The two share only config files |
| [`github-profiler`](https://github.com/Namans12/github-profiler) | **Actually does** what this README used to claim — a local-first Next.js app for managing GitHub data and local git repos |
