# Graph Report - .  (2026-04-18)

## Corpus Check
- Corpus is ~28,090 words - fits in a single context window. You may not need a graph.

## Summary
- 60 nodes · 81 edges · 8 communities detected
- Extraction: 77% EXTRACTED · 23% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Agent Workflow Roles|Agent Workflow Roles]]
- [[_COMMUNITY_Pending Cards Interface|Pending Cards Interface]]
- [[_COMMUNITY_Validation and Test Gates|Validation and Test Gates]]
- [[_COMMUNITY_Premium Card Visual System|Premium Card Visual System]]
- [[_COMMUNITY_Project App Core Functions|Project App Core Functions]]
- [[_COMMUNITY_Dark Mode Toggle Header|Dark Mode Toggle Header]]
- [[_COMMUNITY_UI Test Harness|UI Test Harness]]
- [[_COMMUNITY_Light Mode Snapshot|Light Mode Snapshot]]

## God Nodes (most connected - your core abstractions)
1. `Pending Section Title` - 9 edges
2. `AI Agents System Document` - 8 edges
3. `Pending Heading` - 8 edges
4. `Mandatory Validation` - 7 edges
5. `Glassmorphism Panel Container` - 6 edges
6. `AI Rules Document` - 5 edges
7. `Acceptance Criteria` - 5 edges
8. `Gradient Glow Card Style` - 5 edges
9. `Soft Glassmorphism Card Style` - 5 edges
10. `npm run validate Command` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Stop When Validation Passes` --conceptually_related_to--> `Mandatory Validation`  [INFERRED]
  AI_WORKFLOW.md → AI_RULES.md
- `Never Skip Validation Directive` --conceptually_related_to--> `Mandatory Validation`  [INFERRED]
  SYSTEM_PROMPT.md → AI_RULES.md
- `Tester Agent` --conceptually_related_to--> `npm run validate Command`  [INFERRED]
  AI_AGENTS.md → AI_RULES.md
- `Fixer Agent` --conceptually_related_to--> `Retry Up To 3 Times`  [INFERRED]
  AI_AGENTS.md → AI_RULES.md
- `Execution Order` --conceptually_related_to--> `Exact Workflow Loop`  [INFERRED]
  AI_AGENTS.md → AI_WORKFLOW.md

## Hyperedges (group relationships)
- **Validation Governance Bundle** — ai_rules_validation_mandatory, ai_workflow_validate_step, system_prompt_never_skip_validation, ai_agents_tester_agent [INFERRED 0.86]
- **UI Acceptance Gate** — test_plan_acceptance_criteria, test_plan_playwright_test_pass, test_plan_visual_diff_match [EXTRACTED 1.00]
- **Pending Cards Group** — dark_mode_win32_project_card_realtime_notes_app, dark_mode_win32_project_card_invoice_dashboard, dark_mode_win32_project_card_cli_repo_reporter, dark_mode_win32_project_card_changelog_generator, dark_mode_win32_project_card_docs_search_agent [EXTRACTED 0.98]
- **Pending Panel Composition** — dark_mode_win32_glassmorphism_container, dark_mode_win32_pending_section_title, dark_mode_win32_pending_status_toggle, dark_mode_win32_project_card_realtime_notes_app, dark_mode_win32_project_card_invoice_dashboard, dark_mode_win32_project_card_cli_repo_reporter, dark_mode_win32_project_card_changelog_generator, dark_mode_win32_project_card_docs_search_agent [EXTRACTED 0.94]
- **Theme Control Intent** — dark_mode_win32_theme_toggle_switch_topbar, dark_mode_win32_pending_status_toggle, dark_mode_win32_dark_mode_visual_theme [INFERRED 0.83]
- **Pending Project Cards Group** — light_mode_win32_pending_heading, light_mode_win32_project_card_realtime_notes_app, light_mode_win32_project_card_invoice_dashboard, light_mode_win32_project_card_cli_repo_reporter, light_mode_win32_project_card_changelog_generator, light_mode_win32_project_card_docs_search_agent [EXTRACTED 1.00]
- **UI Control Cluster** — light_mode_win32_day_sky_toggle, light_mode_win32_status_toggle, light_mode_win32_add_button [INFERRED 0.72]

## Communities

### Community 0 - "Agent Workflow Roles"
Cohesion: 0.18
Nodes (13): Coder Agent, Correctness Over Speed Priority, AI Agents System Document, Execution Order, Fixer Agent, Planner Agent, Reviewer Agent, Retry Up To 3 Times (+5 more)

### Community 1 - "Pending Cards Interface"
Cohesion: 0.23
Nodes (12): Add Button, Day Sky Theme Toggle, Soft Glassmorphism Card Style, Pending Heading, Changelog Generator Card, CLI Repo Reporter Card, Docs Search Agent Card, Invoice Dashboard Card (+4 more)

### Community 2 - "Validation and Test Gates"
Cohesion: 0.33
Nodes (10): Tester Agent, AI Rules Document, npm run validate Command, Playwright Tests Requirement, Mandatory Validation, Validate Step, Acceptance Criteria, Test Plan Document (+2 more)

### Community 3 - "Premium Card Visual System"
Cohesion: 0.47
Nodes (9): Glassmorphism Panel Container, Gradient Glow Card Style, Pending Section Title, Plus Action Button, Changelog Generator Card, CLI Repo Reporter Card, Docs Search Agent Card, Invoice Dashboard Card (+1 more)

### Community 4 - "Project App Core Functions"
Cohesion: 0.25
Nodes (0): 

### Community 5 - "Dark Mode Toggle Header"
Cohesion: 0.4
Nodes (5): Dark Mode Visual Theme, Pending Status Toggle, Projects Header, Top Bar Theme Toggle Switch, Dark Mode Projects UI Screenshot

### Community 6 - "UI Test Harness"
Cohesion: 1.0
Nodes (0): 

### Community 7 - "Light Mode Snapshot"
Cohesion: 1.0
Nodes (1): Light Mode UI Screenshot

## Knowledge Gaps
- **10 isolated node(s):** `Planner Agent`, `Coder Agent`, `Reviewer Agent`, `Projects Header`, `Plus Action Button` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `UI Test Harness`** (2 nodes): `ui.spec.ts`, `stabilize()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Light Mode Snapshot`** (1 nodes): `Light Mode UI Screenshot`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AI Agents System Document` connect `Agent Workflow Roles` to `Validation and Test Gates`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `Mandatory Validation` connect `Validation and Test Gates` to `Agent Workflow Roles`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `System Prompt Document` connect `Agent Workflow Roles` to `Validation and Test Gates`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Mandatory Validation` (e.g. with `Validate Step` and `Stop When Validation Passes`) actually correct?**
  _`Mandatory Validation` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Planner Agent`, `Coder Agent`, `Reviewer Agent` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._