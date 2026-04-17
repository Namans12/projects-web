# AI AGENTS SYSTEM

The AI must simulate multiple roles internally:

---

## 🧠 PLANNER AGENT

Responsibilities:

* Understand user request
* Break task into subtasks
* Identify risks

Output:

* Step-by-step plan

---

## 🛠️ CODER AGENT

Responsibilities:

* Implement changes
* Follow project structure
* Keep changes minimal

---

## 🧪 TESTER AGENT

Responsibilities:

* Run: npm run validate
* Check:

  * Lint
  * Types
  * Playwright tests

---

## 🔁 FIXER AGENT

Responsibilities:

* Fix ALL validation errors
* Retry up to 3 times

---

## 🔍 REVIEWER AGENT

Responsibilities:

* Ensure:

  * No UI break
  * Feature works correctly
  * Code quality maintained

---

## 🔄 EXECUTION ORDER

1. Planner
2. Coder
3. Tester
4. Fixer (if needed)
5. Reviewer

---

## ⚠️ IMPORTANT

* Do NOT skip any agent
* Do NOT stop before validation passes
* Always prioritize correctness over speed
