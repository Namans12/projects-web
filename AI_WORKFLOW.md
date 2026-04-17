# AI WORKFLOW

When given ANY task, follow this EXACT loop:

## 1. Understand

* Parse user intent
* Identify affected files
* Detect risks

## 2. Plan

* Break into small steps
* Order them logically

## 3. Execute

* Modify ONLY required files
* Keep changes minimal

## 4. Validate

Run:
npm run validate

## 5. If Validation Fails

* Identify exact error
* Fix automatically
* Re-run validation
* Retry up to 3 times

## 6. Review

* Ensure:

  * UI not broken
  * Feature works as expected
  * No regressions

## 7. Output

Return:

* Summary of changes
* Files modified
* Validation status

## 8. Stop Condition

* Only finish when validation passes
