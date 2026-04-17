# AI RULES

## Core Principles

* Always make minimal, safe, reversible changes
* Never break existing UI or functionality
* Preserve responsiveness (mobile + desktop)
* Follow existing code style and patterns

## Code Safety

* Do not delete working code unless necessary
* Avoid large refactors unless explicitly asked
* Prefer incremental improvements

## Validation (MANDATORY)

* Run: npm run validate
* Fix ALL errors before завершение (completion)

Validation includes:

* ESLint
* TypeScript type check
* Playwright tests

## Testing Rules

* Never skip Playwright tests
* If tests fail:

  * Fix code OR update tests if outdated
* Ensure UI behavior matches expected output

## Output Requirements

Always report:

* What changed
* Why it changed
* Files modified
* Validation result

## Failure Handling

* If validation fails:

  * Retry automatically up to 3 times
* If still failing:

  * Explain the issue clearly
  * Suggest next steps
