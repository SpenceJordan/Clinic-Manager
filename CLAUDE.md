# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Med+ ("Clinic Manager") is a front-end-only demo of a clinic management app: Next.js 15 (App Router) + React 19, plain JavaScript/JSX, no TypeScript, no backend. All data is seeded in memory and resets on refresh, except accounts and dashboard layouts, which are saved in `localStorage`. `PLANNED_CHANGES.md` is the running plan and changelog (design direction, what's done, what's next, security gaps); read it before larger work and keep it updated.

## Commands

- `npm run dev`: dev server on http://localhost:3000
- `npm run build`: production build
- `npm run lint` runs `next lint`, but no ESLint config is checked in

There is no test suite. Changes are verified in a real browser (the app is driven with Playwright from outside the repo).

Don't run `next build` in the project folder while `npm run dev` is running: it overwrites `.next` and breaks the dev server (fix: stop it, `rm -rf .next`, `npm run dev`). To check a production build, build a copy of `app/`, `components/`, `package.json` and `next.config.mjs` elsewhere.

Demo logins (seeded in `components/lib/data.js`, `INIT_ACCOUNTS`): `admin`/`Admin1234!`, `doctor`/`Doctor1234!`, `nurse`/`Nurse1234!`, `receptionist`/`Recept1234!`. If saved accounts in the browser get in the way, clear the `medplus.accounts` localStorage key.

## Architecture

`app/page.js` renders `components/App.jsx` (the only `"use client"` file). There is no router: `App` holds all state with `useState` and switches pages by a `page` id through a `pages` map, passing state and setters down as props. It also owns the session (signed-in account id), theme, the work/manage area, the messages dock and the global modals (follow-up, end-of-day).

- `components/lib/`: no UI. `data.js` is the seed data (`INIT_*`) plus `DEMO_TODAY`/`DEMO_NOW`; `accounts.js` holds permissions and the staff context; `print.js` has the `html` tagged template for printouts; `utils.js` holds date and name helpers.
- `components/ui.jsx`: theme object `C` and the shared parts (`Modal`, `Card`, `PageHeader`, `StatCard`, `Badge`, `Alert`, `Segmented`, buttons `PB`/`XB`, form styles `IS`/`SS`/`LS`, …). Reuse these instead of new one-off styles.
- `components/shell.jsx` (sidebar, top bar, search, login), `dashboard.jsx` (`DashboardLayout` + per-role dashboards), `modals.jsx`, `Messages.jsx`, and `pages/` with one file per page. The patient chart is `pages/PatientChart.jsx` (`PatientProfile`), opened from `pages/PatientsPage.jsx`.

### Rules that span files

- **The demo runs on a fixed day.** Use `DEMO_TODAY` (2026-02-25) for anything compared with appointments, recalls or schedules, not `new Date()`/`today()`. Mixing the two has caused bugs (e.g. the end-of-day checklist never appearing).
- **Permissions:** always check `permsFor(user)` (role defaults in `PERMS` merged with the account's own `perms` overrides), never `user.role`, for what someone may see or do. To add a permission: add the key to every role in `PERMS`, list it in `PERM_GROUPS` so the admin can switch it, and check it with `permsFor`. "Admin access" is the `admin` key: the `admin` role (office admin) always has it and gets admin pages in its sidebar; any other account with it gets a separate "Manage clinic" area (`MANAGE_NAV`, `area` state in `App`). The last active admin can't lose admin access.
- **Staff list:** read accounts with `useStaff()` (React context provided by `App`), not the `INIT_ACCOUNTS` constant, so new accounts show up everywhere.
- **Dashboards** are panel maps rendered by `DashboardLayout`; layouts are saved per account under `medplus.dashboard.user.<username>`.
- **Printouts** (`window.open` + `document.write`) must be built with `` html`...` `` from `lib/print.js`, which escapes every value. Never interpolate patient data into raw HTML strings.
- **Hooks:** some chart tabs render through inline `(()=>{...})()` blocks. Don't call hooks inside them (it crashes the app when the tab opens); put state at the top of the component.
- **Theme:** colours are CSS variables in `app/globals.css` (light in `:root`, dark under `[data-dark]` on `<html>`), reached through `C.*`. Use `tint(color, %)` for transparent versions (hex-plus-alpha strings don't work with CSS variables), one easing curve `var(--ease)`, lucide icons via `Icon`, and sentence case for all labels. Ink (`C.navyMid`) is the only action colour; other colours are for statuses.
- `Modal` closes with Escape (top dialog only); custom overlays should use `useEscapeToClose` and `role="dialog"`.

## Other folders

- `clinic-demo/`: the older Vite version of the app, not used by the Next.js app.
- `Doctor.jsx` (repo root): an older standalone component, not imported anywhere.
- `step6-emoji-inventory.md`: reference notes from the emoji-to-icon cleanup.

## Git

Don't add `Co-Authored-By` or other Claude attribution lines to commits.
