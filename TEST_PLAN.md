# TEST PLAN

## Core UI States

### 1. Default (Light Mode)

* Page loads correctly
* Navbar visible
* Project cards render (3 cards)
* Background gradient visible
* Toggle is OFF

### 2. Dark Mode

* Toggle switches ON
* Background changes to dark
* Text becomes light
* Stars and spaceship visible
* Clouds disappear

### 3. Responsive (Mobile)

* Layout stacks properly
* Navbar adjusts
* Cards remain readable

---

## Interactions

### Theme Toggle

* Clicking toggle switches theme
* Animation runs smoothly
* State persists after reload

---

## Visual Stability

The following must NOT break:

* Card layout
* Spacing
* Typography
* Toggle position
* Animations

---

## Acceptance Criteria

A change is valid ONLY if:

* No Playwright test fails
* No visual diff mismatch
* UI matches expected behavior
