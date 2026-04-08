# Guided Tutorial Tour

## Overview

A one-time guided tour that highlights the header buttons on first visit, powered by Driver.js. Users can replay it via a help button.

## Library

**Driver.js** (~5kb, no dependencies) loaded via CDN — consistent with how the project loads Vue, Tailwind, Chart.js, and Lucide.

## Tour Steps

| # | Target | Description |
|---|--------|-------------|
| 1 | Day selector group | "Choose how many days of data to display in the charts" |
| 2 | Refresh button | "Manually refresh the dashboard data" |
| 3 | Share button | "Copy a shareable link to this node's dashboard" |
| 4 | Theme toggle | "Switch between dark and light mode" |
| 5 | Settings button | "Configure auto-refresh interval and other options" |
| 6 | Help button | "Click here anytime to replay this tour" |

The day selector step targets the button group container, not individual day buttons.

## Trigger Logic

- On dashboard mount, check `localStorage.getItem('mni_tutorial_seen')`
- If not set: start tour automatically
- On tour complete OR early cancel/dismiss: set `mni_tutorial_seen` to `'true'`

## Help Button

- Added to the header icon button group, after the settings button
- Uses Lucide `circle-help` icon, same `w-4 h-4` sizing as other icons
- On click: removes `mni_tutorial_seen` from localStorage, then starts the tour
- Tour completion/cancellation re-sets `mni_tutorial_seen` to `'true'`

## Styling

Driver.js popover themed to match the existing dashboard aesthetic:
- Dark glass background matching `--card-bg` / surface tokens
- Purple brand accent for the progress/next buttons
- Border matching `--card-border`
- Light mode support via existing `.light` class overrides

## Persistence

Uses localStorage key `mni_tutorial_seen` — follows existing `mni_` prefix convention.

## Files Changed

- **index.html**: Add Driver.js CDN (CSS + JS), help button markup in header, custom Driver.js theme styles
- **app.js**: Tour configuration, start/restart functions, localStorage check on mount

No new files created beyond this spec.
