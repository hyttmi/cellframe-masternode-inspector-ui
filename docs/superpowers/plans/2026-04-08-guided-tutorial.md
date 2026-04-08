# Guided Tutorial Tour Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-time guided tour that highlights header buttons on first visit, with a help button to replay it.

**Architecture:** Driver.js loaded via CDN highlights elements with a popover overlay. Tour state persisted in localStorage. A help button in the header restarts the tour.

**Tech Stack:** Driver.js (CDN), Vue 3 Composition API, Tailwind CSS, localStorage

---

## File Map

- **Modify: `index.html`** — Add Driver.js CDN links (CSS + JS), add `id` attributes to tour target elements, add help button markup, add custom Driver.js theme CSS
- **Modify: `app.js`** — Add tour configuration, `startTutorial()` function, localStorage check in `onMounted`, expose to template

---

### Task 1: Add Driver.js CDN and custom theme CSS

**Files:**
- Modify: `index.html:1-14` (CDN links in `<head>`)
- Modify: `index.html:191-195` (custom CSS after `.btn-active`)

- [ ] **Step 1: Add Driver.js CDN links**

In `index.html`, after line 10 (`<script src="https://unpkg.com/lucide@latest"></script>`), add:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css">
<script src="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js"></script>
```

- [ ] **Step 2: Add custom Driver.js theme CSS**

In `index.html`, after the `.btn-active` block (after line 195), add:

```css
/* Driver.js tour theme */
.driver-popover {
    background: var(--card-bg) !important;
    border: 1px solid var(--card-border) !important;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: var(--text) !important;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5) !important;
}
.driver-popover .driver-popover-title {
    color: var(--text) !important;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 600;
}
.driver-popover .driver-popover-description {
    color: var(--text-secondary) !important;
    font-family: 'Outfit', system-ui, sans-serif;
}
.driver-popover .driver-popover-progress-text {
    color: var(--text-secondary) !important;
}
.driver-popover button.driver-popover-next-btn {
    background: linear-gradient(135deg, #7C3AED, #A78BFA) !important;
    color: #fff !important;
    border: none !important;
    border-radius: 0.5rem !important;
    font-family: 'Outfit', system-ui, sans-serif;
    font-weight: 600;
    text-shadow: none !important;
}
.driver-popover button.driver-popover-prev-btn,
.driver-popover button.driver-popover-close-btn {
    color: var(--text-secondary) !important;
    border: 1px solid var(--card-border) !important;
    border-radius: 0.5rem !important;
    font-family: 'Outfit', system-ui, sans-serif;
    text-shadow: none !important;
}
```

- [ ] **Step 3: Verify Driver.js loads**

Open the page in a browser, open DevTools console, type `driver` — should be defined. Check that the CSS doesn't cause visual regressions on existing elements.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Driver.js CDN and custom tour theme CSS"
```

---

### Task 2: Add ID attributes to tour target elements

**Files:**
- Modify: `index.html:357-381` (header button groups)

- [ ] **Step 1: Add IDs to the day selector group and each action button**

In `index.html`, update the header button area. Add `id="tour-days"` to the day selector container (line 357), and add IDs to each icon button:

Line 357 — day selector container, change:
```html
<div v-if="availableChartDays.length" class="h-8 inline-flex items-stretch bg-surface-1 rounded-lg border border-surface-2 divide-x divide-surface-2">
```
to:
```html
<div v-if="availableChartDays.length" id="tour-days" class="h-8 inline-flex items-stretch bg-surface-1 rounded-lg border border-surface-2 divide-x divide-surface-2">
```

Line 366 — refresh button, change:
```html
<button @click="refreshDashboard" class="px-2 hover:bg-surface-2 rounded-l-lg transition-colors flex items-center" title="Refresh">
```
to:
```html
<button id="tour-refresh" @click="refreshDashboard" class="px-2 hover:bg-surface-2 rounded-l-lg transition-colors flex items-center" title="Refresh">
```

Line 371 — share button, change:
```html
<button @click="shareNode(activeNodeIndex)" class="px-2 hover:bg-surface-2 transition-colors flex items-center" title="Share node link">
```
to:
```html
<button id="tour-share" @click="shareNode(activeNodeIndex)" class="px-2 hover:bg-surface-2 transition-colors flex items-center" title="Share node link">
```

Line 374 — theme toggle, change:
```html
<button @click="toggleTheme" class="px-2 hover:bg-surface-2 transition-colors flex items-center" title="Toggle theme">
```
to:
```html
<button id="tour-theme" @click="toggleTheme" class="px-2 hover:bg-surface-2 transition-colors flex items-center" title="Toggle theme">
```

Line 378 — settings button, change:
```html
<button @click="openSettings" class="px-2 hover:bg-surface-2 rounded-r-lg transition-colors flex items-center" title="Settings">
```
to:
```html
<button id="tour-settings" @click="openSettings" class="px-2 hover:bg-surface-2 transition-colors flex items-center" title="Settings">
```

Note: the settings button loses `rounded-r-lg` because it will no longer be the last button — the help button (Task 3) will be appended after it.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add tour target IDs to header buttons"
```

---

### Task 3: Add help button to the header

**Files:**
- Modify: `index.html:378-381` (after settings button, before closing `</div>`)

- [ ] **Step 1: Add help button markup**

In `index.html`, after the settings button (line 379-380) and before the closing `</div>` of the icon button group (line 381), add a new button:

```html
<button id="tour-help" @click="startTutorial(true)" class="px-2 hover:bg-surface-2 rounded-r-lg transition-colors flex items-center" title="Help / Replay tour">
    <i data-lucide="circle-help" class="w-4 h-4"></i>
</button>
```

The help button gets `rounded-r-lg` since it's now the last button in the group.

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add help button to header button group"
```

---

### Task 4: Implement tour logic in app.js

**Files:**
- Modify: `app.js:568-572` (onMounted block)
- Modify: `app.js:579-597` (return block)

- [ ] **Step 1: Add the startTutorial function**

In `app.js`, before the `// --- Lifecycle ---` comment (line 568), add:

```javascript
// --- Tutorial ---
const startTutorial = (manual = false) => {
    if (manual) localStorage.removeItem('mni_tutorial_seen');
    if (!manual && localStorage.getItem('mni_tutorial_seen')) return;

    const steps = [
        { element: '#tour-days', popover: { title: 'Chart Range', description: 'Choose how many days of data to display in the charts.', side: 'bottom' } },
        { element: '#tour-refresh', popover: { title: 'Refresh', description: 'Manually refresh the dashboard data.', side: 'bottom' } },
        { element: '#tour-share', popover: { title: 'Share', description: 'Copy a shareable link to this node\'s dashboard.', side: 'bottom' } },
        { element: '#tour-theme', popover: { title: 'Theme', description: 'Switch between dark and light mode.', side: 'bottom' } },
        { element: '#tour-settings', popover: { title: 'Settings', description: 'Configure auto-refresh interval and other options.', side: 'bottom' } },
        { element: '#tour-help', popover: { title: 'Help', description: 'Click here anytime to replay this tour.', side: 'bottom' } },
    ];

    // Filter out steps whose target element doesn't exist (e.g. day selector hidden when no data)
    const activeSteps = steps.filter(s => document.querySelector(s.element));

    const driverObj = window.driver.js.driver({
        showProgress: true,
        animate: true,
        onDestroyed: () => { localStorage.setItem('mni_tutorial_seen', 'true'); },
        steps: activeSteps,
    });
    driverObj.drive();
};
```

- [ ] **Step 2: Trigger the tour on first load**

In `app.js`, update the `onMounted` block (line 569-572). Change:

```javascript
onMounted(() => {
    if (loadActiveNode()) startPolling();
    nextTick(() => { try { lucide.createIcons(); } catch(e) {} });
});
```

to:

```javascript
onMounted(() => {
    if (loadActiveNode()) startPolling();
    nextTick(() => {
        try { lucide.createIcons(); } catch(e) {}
        if (!showSetup.value) startTutorial();
    });
});
```

The `!showSetup.value` check ensures the tour only runs when the dashboard is visible (not during initial setup).

- [ ] **Step 3: Expose startTutorial in the return block**

In `app.js`, add `startTutorial` to the return object. In the `// Actions` line (line 596), change:

```javascript
fetchAllData, refreshDashboard, startPolling, exportCSV, exportSovereignCSV,
```

to:

```javascript
fetchAllData, refreshDashboard, startPolling, exportCSV, exportSovereignCSV, startTutorial,
```

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: implement guided tour with Driver.js and localStorage persistence"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Test first-visit flow**

1. Open browser DevTools → Application → Local Storage
2. Remove `mni_tutorial_seen` key (if present)
3. Reload the page with a configured node
4. Tour should start automatically, stepping through each button
5. Complete the tour — `mni_tutorial_seen` should appear in localStorage

- [ ] **Step 2: Test persistence**

Reload the page. Tour should NOT start again.

- [ ] **Step 3: Test help button replay**

Click the help (?) button in the header. Tour should start from the beginning. Complete or dismiss it. Reload — tour should not auto-start.

- [ ] **Step 4: Test early dismissal**

Remove `mni_tutorial_seen` from localStorage, reload. When the tour starts, click outside or press Escape to dismiss. `mni_tutorial_seen` should still be set. Reload — tour should not restart.

- [ ] **Step 5: Test with no chart data**

If the day selector is hidden (no data), the tour should skip that step gracefully.

- [ ] **Step 6: Test light mode**

Toggle to light mode and replay the tour. Popover should remain readable with proper contrast.
