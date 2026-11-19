# Planned Changes

Last updated: 2026-11-16

---

## ✅ Done: Admin role redesign (built 2026-11-14, not committed yet)

Admin keeps access to everything but no longer does clinical work. Everything is in `components/App.jsx`.

**Permissions (`PERMS`, admin row)**
- Turned off: `writeRx`, `prescriptions`, `refillApprove`, `writeNotes`, `notes`, `vitals`
- New `viewVitals` permission (true for admin, doctor and nurse), so admin can still see the Vitals tab and vitals summary
- Removed the hardcoded admin access for problem-list editing and lab ordering
- The "+ Record via Form" and "Record now" vitals buttons now check `p.vitals`. Before, they showed for anyone who could open the tab.
- Adding allergies needs `vitals` or the doctor role, so admin can no longer add allergies

**Top row**
- Admin: Dashboard · Staff Schedule · Admin Panel · Inventory · Reports
- Admin "More": Appointments, Patients, Patient Flow, Refill Queue, Recalls, Tasks
- Other roles: unchanged

**Dashboard (admin)**
- Cards: Total Patients · Today's Volume · **Staff on Shift** (opens Staff Schedule) · **Low-Stock Items** (opens Inventory, shown in red when anything is low)
- Staff Activity: each row and a new "Schedule →" link open Staff Schedule
- **Open Tasks** card at the top of the right column: the top 5 open tasks for the whole clinic, highest priority first, then soonest due. Each row shows a priority dot, who it's assigned to, and the due date (red when overdue, amber when due today). Clicking a task or "All tasks →" opens Tasks. View-only.

**Still to test in the browser**
- [ ] Admin sidebar groups (Dashboard, Reports / Operations / Clinical) look right (the top row and "More" menu were replaced by the sidebar in step 6)
- [ ] Admin patient chart: can see prescriptions, notes and vitals, but has no write, sign, record, order, approve or add-allergy buttons
- [ ] Admin Refill Queue: can view but has no approve button
- [ ] Dashboard counts and links work
- [ ] Doctor, nurse and receptionist are unchanged

---

## ✅ Done: Messages popup (built 2026-11-14, not committed yet)

- A "💬 Messages" bar is docked at the bottom-right of every page, with an unread count. Clicking it, or the ✉ button in the top bar, opens a 310×420 chat window.
- The window shows the contact list first. Picking someone opens the conversation, and "‹" goes back to the list.
- The window header has **⤢** to open the full Messages page and **▾** to shrink it back to the bar.
- The full Messages page has a **↙ Popup** button that goes back to the page you were on and reopens the popup.
- The open conversation stays the same when switching between the popup and the full page.
- Messages are only marked read once you open that conversation.
- Toast notifications now show above the chat bar or window instead of on top of it.

**Still to test in the browser**
- [ ] The bar shows on every page except the full Messages page
- [ ] Sending, the unread badge and the back button all work in the popup
- [ ] Maximize and ↙ Popup switch back and forth correctly
- [ ] Modals (new appointment, search, etc.) appear on top of the popup

---

## Next: UI cleanup ("unslop") + dark mode

**Status:** Steps 1–7 done. The direction changed in step 6 to ink as the only action colour (see step 6); the theme toggle stays in Settings and follows the device.

**Direction (proposed)**
- **Character:** steady, exact, quietly warm. The world is the exam room and the paper chart.
- **Colors:** neutral grey backgrounds. Ink `#121A26` is the only action colour (was Med+ blue until step 6), solid, no gradients. Status colors (teal, amber, green, red) are used only for statuses.
- **Moments:** the Patient Flow board and vitals in the patient chart. These are the only places with rich color.
- **Signature:** a status-colored tab on the left edge of patient rows and cards.
- **Type:** IBM Plex Sans with IBM Plex Mono for times, record numbers and vitals. Weights 400 and 500, and no all-caps labels.

### Work order

Each step builds on the one before it, so the order matters.

**1. Foundations** ✅ done 2026-11-14 (not committed yet)
- [x] New color variables in `app/globals.css`: neutral grey surfaces, 3 text colors (`--c-text`, `--c-text2`, `--c-muted`), Med+ blue as the accent, and toned-down status colors. The light and dark values are designed together. The old variable names are kept, so every `C.*` reference still works.
- [x] New variables `raised`, `text2`, `disabled`, `inactive`, `skeleton`, `overlay` and `mono` replace the hardcoded `#9BB5D9`, `#CBD5E1`, `#E8ECF0` and white backgrounds and borders. The only hardcoded color left is white text on blue.
- [x] Insurance badges are neutral (a grey code in mono) instead of 9 different carrier colors
- [x] IBM Plex Sans and Plex Mono load through `next/font` in `app/layout.js`
- [x] Type scale: 20 font sizes down to 9 (11, 12, 13, 14, 16, 20, 24, 28, 36). Weights 700, 800 and 900 are now 600. Removed the negative letter spacing on small text.
- [x] Spacing snapped to 4px steps (361 values). Corner radius snapped to 4, 6, 8, 12, 16 or pill (119 values).
- [x] Theme: **Settings → Appearance → Device / Light / Dark**, with Device as the default. It follows the computer and updates live when the computer switches. The choice is saved, and the old dark mode setting carries over.
- Note: the login page keeps a dark backdrop in both themes until its redesign in step 3

**2. Shared components** ✅ done 2026-11-14 (not committed yet)
- [x] Buttons (`PB`, `LoadingButton`, `XB`): solid blue (no gradient or glow), 8px corners instead of pills, 36px tall. Hover darkens, pressing scales down slightly. Uses the CSS classes `.btn`, `.btn-primary` and `.btn-secondary` in `globals.css`.
- [x] `Badge`, `SB` and `TB`: normal case ("Checked in", "Follow up"), weight 500, small 6px corners instead of pills
- [x] `Card`: 12px corners and a neutral shadow (no blue tint). **Bug fixed:** `Card` ignored `onClick`, so the clickable stat cards (admin's Staff on Shift and Low-Stock Items, the doctor's Pending Refills) never opened their pages. They do now, and they show a border on hover.
- [x] New `StatCard` component used on every dashboard: a label, a figure (weight 500, evenly spaced digits) and one context line. The colored top border is gone. The figure only turns red when a count that needs attention is above 0.
- [x] `Modal`: neutral overlay, a short rise-in animation, an accessible close button (×) and a dialog role
- [x] Form labels (`LS`): normal case, 13px, secondary text color. Inputs show a blue border on focus, and every control has a visible focus ring for keyboard users.
- [x] Toasts: weight 500, neutral shadow, rise-in. Removed the exclamation marks ("Prescription saved", "Vitals recorded", "Patient registered", …).
- [x] All 59 all-caps labels and table headers are normal case now
- [x] Removed the remaining blue glows and `transition: all`. Reduce motion is respected app-wide.

**3. App shell** ✅ done 2026-11-14 (not committed yet)
- [x] Added the **lucide-react** icon set (pinned to `1.61.0`). Icons are 16px with a 1.5 stroke and take the color of their text. Shared `Icon`, `NAV_ICON` and `ROLE_ICON` helpers.
- [x] **Logo:** a flat plus in a blue rounded square next to "Med+" (`Logo` component). No gradient or glow.
- [x] **Top bar:** plain surface (the blue gradient wash is gone). The active tab pill slides between tabs (blue, no glow). The search box just says "Search". Messages is a square icon button. Chevrons and the "More" dropdown use line icons.
- [x] **Profile menu:** a role icon in the role badge, plus Settings and Log out icons. "Log Out" is now "Log out".
- [x] **Login page:** follows light and dark mode (it was always dark before). Shows the logo, a "Sign in to run today's clinic" line, the demo account buttons with role icons and their credentials in mono, then the sign-in card with a solid blue button. No gradients or glows. The error now reads "Username or password is incorrect".
- [x] **Messages popup:** a quiet surface bar instead of a blue one, line icons (maximize, minimize, back, send), and an empty state with an icon instead of 💬
- Note: nurses and receptionists can't open Settings, so they always follow the device theme (as decided)

**4. Dashboards** ✅ done 2026-11-14 (not committed yet)
- [x] **Title is the day** ("Wednesday, February 25") instead of "Good morning, …" (`DashHeader`). The line under it says whose view it is plus the one fact that matters, for example "Nursing · 1 waiting for vitals" or "Clinic overview · 6 appointments, 5 staff on shift".
- [x] **Status tab signature:** patient rows get a 3px left edge in their visit status color (`STATUS_TONE` and `statusTab()`): blue scheduled, teal checked in, purple with nurse, amber with doctor, green done, red no-show. It's used in the admin's "All appointments today", the doctor's "My schedule" (replacing the old grey bar) and the nurse's "Ready for vitals".
- [x] Times in IBM Plex Mono with evenly spaced digits (`TimeCell`)
- [x] Headings and stat labels in normal case ("My schedule", "Low-stock items")
- [x] Admin "Total patients" counts real patient records ("6, 5 active") instead of a hardcoded "6"
- [x] Staff activity shows "Last sign-in 08:14", or a date for older sign-ins
- [x] Nurse alert: a line icon and an amber edge instead of the ⚠ emoji and a heavy border. Removed the "✓" after empty-state text.
- [x] **Bug fixed app-wide:** `fmt()` showed every plain date one day early in US time zones (dates were read as midnight UTC). Recall due dates, last visits and similar dates now show correctly.
- Still old: the "Patient flow today" mini board on the dashboards is redone in step 5 together with the full board

**5. The two moments** ✅ done 2026-11-14 (not committed yet)
- [x] **Patient Flow board:** neutral grey lanes with a status-colored top edge and a dot, and the count in mono. Cards have the status-colored left tab, the time in mono, the time-in-stage with a timer icon, a type badge and the doctor. Each card has one blue action ("Check in →", "Send to nurse →", "Start visit →", "Complete visit ✓") plus a quiet "No-show". Empty lanes show a line icon with plain text ("No one in the waiting room"). The doctor ready/busy indicators are quiet dots. The "Ready for the doctor" alert has a bell icon and an amber edge instead of 🔔 and a thick border.
- [x] **Dashboard mini board** ("Patient flow today"): one segmented bar showing today's patients by stage, with colored keys and counts, instead of four colored boxes. It uses the same `FLOW_STAGES` list as the full board.
- [x] **Vitals** (`VitalReadout`): each reading is a large mono number with its unit and a word ("In range", "Above range", "High", "Low"). On the Vitals tab there's also a range bar: the shaded band is the adult reference range and a dot marks the reading. The patient overview uses a compact version with a colored dot. Blood pressure uses both numbers. Under the readings: "Recorded Jan 15, 2026 by James Torres".
- [x] **Bug fixed:** 12 places built colors as `${color}30` or `color+"15"` (hex plus alpha). Since the colors became CSS variables, that produced invalid CSS, so borders and tints silently disappeared (flow board, appointment calendars, …). A new `tint(color, %)` helper uses `color-mix()` and works with variables.
- [x] Cleared the last heavy 700/800 font weights (in conditional styles)

**6. Remaining pages + reference redesign** ✅ done 2026-11-16 (not committed yet)
Direction changed after a reference dashboard: an operations console. Ink (`#121A26`) replaces Med+ blue as the only action colour; colour is for status only.
- [x] **Tokens:** cooler grey page (`#EFF0F2`), translucent hairline borders (`rgba(17,20,24,0.07)`, controls `0.13`) so outlines never read heavy, 8px card corners, 6px buttons. Dark mode flips ink to near-white with dark text.
- [x] **Shell:** left sidebar (232px) grouped by role. Admin: Dashboard, Reports / Operations / Clinical. Others: Today / Patients / Work. Badges are neutral except overdue recalls. Profile sits at the bottom of the sidebar. The thin header has the breadcrumb (clinic / page), the doctor's Ready/Busy toggle, recent patients, search and messages. The old top nav and "More" menu are gone.
- [x] **Shared parts:** `PageHeader` (title, status pill, meta line, actions), `CardHead`, `StatCard` tiles (icon, label, dot and value, context), `KVGrid` (label/value grid with hairline dividers), `Alert` (only for things that need someone now), `Timeline`, `Segmented` (one style for every view switch and filter), `ApptTable`. Badges are now dot + dark text on a faint tint; visit types and roles are neutral.
- [x] **Admin dashboard:** "Clinic overview" with a status pill, low-stock banner, "Today at a glance" grid, 5 status tiles, "Clinic day" timeline next to today's appointments, and a data-driven alert for visits booked after a doctor's shift ends (Yuki Tanaka 14:00 vs Dr. Williams until 13:00). Bottom row: open tasks, staff activity with shift times, supplies to watch.
- [x] Doctor, nurse and receptionist dashboards rebuilt on the same parts.
- [x] Every page uses `PageHeader`: Appointments, Patient flow, Patients, Patient chart, Refills, Recalls, Tasks, Inventory, Staff schedule, Reports, Admin, Settings.
- [x] Patient chart: name + risk/DNC pills, allergy banner, "Patient information" grid, cleaner tabs; the duplicate breadcrumb was removed.
- [x] All emoji replaced with lucide icons or plain text (0 left). Title Case labels, buttons and form labels are now sentence case.
- [x] **Bugs fixed:** calendar blocks used `${col}60` (invalid CSS on variables); white text on ink fills disappeared in dark mode (buttons, chat bubbles, calendar); coloured row tints and hard-coded hex colours removed.
- [x] **Customisable dashboard (admin):** "Customise" in the dashboard header turns on edit mode. Panels (Today at a glance, Clinic day, Open tasks, Appointments today, Staff activity, Supplies to watch) can be dragged between a full-width row, the narrow column and the wide column, or moved with toolbar buttons (up, down, other column, full width, hide). Hidden panels come back from the tray; "Reset to default" restores the layout. Saved per role in localStorage (`medplus.dashboard.<role>`). Built as a reusable `DashboardLayout`, so the other roles' dashboards can use it next.
- [ ] Check in the browser: nurse and receptionist views, modals (new patient scan, Rx, visit note), Messages page

**7. Final sweep** ✅ done 2026-11-18 (not committed yet)
- [x] Motion: every animation and transition uses `--ease` (page and patient fades, modals, toasts and alerts now use `rise 220ms var(--ease)`; Messages hovers, the scan progress bar, report bars and the end-of-day checklist got timings and the curve). The unused `fadeIn` and `slideIn` keyframes are removed. The only `cubic-bezier` left is the `--ease` definition. The skeleton pulse is softer (1.6s ease-in-out, down to 70% opacity).
- [x] Unslop checklist: 0 emoji, 0 uppercase labels, 0 weights above 600, 0 `transition: all`, no glows. What's left is on purpose: the conic gradient is the no-show donut, tight tracking only on big figures and H1, hex colours only in the print views.
- [x] Every page for all 4 roles screenshotted in light and dark (76 screens): consistent, no console errors.
- [x] Added `app/icon.svg` (ink plus mark) so the browser tab has an icon (`/favicon.ico` was a 404)

### Dark mode decisions
- The toggle stays in **Settings only** for now (Settings is limited to doctor and admin, so nurses and receptionists get the device setting)
- It **follows the device** by default and can be changed to Light or Dark ✅ built in step 1
- Dark mode uses the same new look as light mode

---

## Suggested next (from the 2026-11-16 sessions)

**Check in the browser** (couldn't be confirmed by screenshot)
- [ ] Nurse and receptionist dashboards
- [x] Modals checked in the browser (2026-11-18): new appointment, new patient (document scan), prescription (incl. allergy cross-reactivity warning), visit note, vitals, recall, follow-up, end-of-day checklist. All save, all close with Escape, light and dark.
- [x] Messages page and popup checked (2026-11-18): opening full page and sending a message work.
- [ ] Patient chart tab row lines up with the page title (same fix as the Admin panel tabs)
- [ ] Cards that lost the line under their title (Admin "Staff users" and similar) look right
- [ ] Dashboard customise mode: dragging panels with the mouse (the move buttons, hiding, reset and saving after a reload were tested; mouse dragging wasn't)
- [ ] Light and dark mode for every role (part of step 7)

**Features**
- [x] Customisable dashboards for every account (2026-11-18). Doctor, nurse and receptionist dashboards are now panels in `DashboardLayout` (stats row, patient flow, schedule/appointments, recalls, tomorrow, ready for vitals). Layouts are saved per account (`medplus.dashboard.user.<username>`); the old per-role layout is picked up once. The admin can switch Customise off per account.
- [x] **Accounts and permissions (2026-11-18).** Admin panel → Users: "Add user" and "Edit" open an account editor (name, job title, username, password, role, active/inactive) with a checklist of what the account can use: pages, clinical actions (see/record vitals, read/write notes, see prescriptions, prescribe, approve refills) and work (register patients, create tasks, customise dashboard). Each account starts from its role's defaults; changes show as "changed" and the list shows "N custom". "Reset to role defaults" clears them. Write permissions switch on their read permission. The admin can't remove their own admin access or deactivate themselves. Inactive accounts can't sign in. Permission changes apply straight away. New accounts appear in Messages, Staff schedule and the admin dashboard. Changes go to the audit log.
  - Permissions are resolved by `permsFor(user)` (role defaults in `PERMS` plus the account's `perms`). Accounts live in `INIT_ACCOUNTS` and are saved in localStorage (`medplus.accounts`); clear it to get the demo accounts back.
  - **Demo only:** passwords are plain text in the browser, and the checks run in the browser. See Security below before real use.
- [x] **Admin access is a switch on any account (2026-11-18).** Role stays the person's job; "Admin access" can be turned on for a doctor, nurse or receptionist (small offices without an office admin).
  - They get **Manage clinic** in the profile menu. It opens a separate area with its own sidebar: Overview (the admin dashboard, with its own saved layout), Staff and accounts (users + login history), Staff schedule, Reports, Inventory, Audit log, Backup. "Back to my work" returns to their normal sidebar, which never gets admin pages. The breadcrumb reads "Manage clinic / …".
  - The **Office admin** role keeps the admin pages in the sidebar, as before, and always has admin access.
  - **Pinned pages:** switching on a single page (e.g. Inventory for a nurse who orders supplies) puts it in that person's sidebar without admin access.
  - **Never zero admins:** the last active account with admin access can't lose it (switch locked with an explanation; save also refuses). Self-removal is allowed when another admin exists and drops them back to their own dashboard. Changing role keeps admin access.
  - **Visible:** an "Admin" marker in the profile menu and on the staff list; the list header counts "N with admin access". Clinic settings in Settings follow admin access too.
- [ ] Save dashboard layouts to the user's account instead of the browser, so they follow the user to other computers (needs a backend; today it's `localStorage`, key `medplus.dashboard.<role>`)

**Bugs fixed 2026-11-18**
- [x] `components/App.jsx` split into modules (`lib/`, `ui.jsx`, `shell.jsx`, `dashboard.jsx`, `modals.jsx`, `Messages.jsx`, `pages/`); App.jsx is now the app root only. All pages screenshot pixel-identical before and after.
- [x] Patient chart crashed the app when opening the **Notes, Problems or Labs** tab (React state created inside the tab) or the **Timeline** tab (read a removed data set). All 11 tabs open now.
- [x] End-of-day checklist could never appear (compared appointments with the real date) and only checked completed visits; now shows once the last visit of the day is completed or marked no-show. No-show recalls and follow-up dates count from the demo day.
- [x] Every dialog closes with Escape (top one only); follow-up and end-of-day are proper dialogs. Remaining Title Case dialog labels are sentence case.
- [x] The open patient chart was a stale copy: a new allergy (or other edit) didn't show on the chart or in printouts until it was closed and reopened. The chart now reads the live patient record.

**Housekeeping**
- [x] Committed steps 6–7, the dashboard customisation and the spacing fixes as `be259fb` (2026-11-18)
- [x] `step6-emoji-inventory.md` kept for reference and committed
- Note: don't run `next build` in the project folder while `npm run dev` is running. It overwrites `.next` and breaks the dev server (fix: stop it, `rm -rf .next`, `npm run dev`).

---

## Security (before any real patient data goes in)

Med+ is a front-end demo today: there's no server, and everything lives in memory in the browser. That's fine for a demo, but none of it is safe for real patients yet. Run **`/security-review`** before anything goes live (suggested 2026-11-14).

What's in the code now (checked 2026-11-16):
- [ ] **Logins are fake.** `DEMO_USERS` in `components/App.jsx` holds plain-text passwords, they're shown on the login page, and the check runs in the browser. Real use needs a server with hashed passwords (bcrypt/argon2), sessions or tokens, and password reset.
- [ ] **Permissions are only enforced in the UI.** `PERMS` hides buttons and pages, but anyone can change browser code. Every permission check has to be repeated on the server.
- [x] **Print views escape patient data** (fixed 2026-11-18). Daily schedule, prescription and patient summary are built with an `html` tagged template that escapes every value, so a name or allergy like `<img onerror=…>` prints as text. Tested in the browser with that string as an allergy: it printed as text and didn't run.
- [ ] **No data storage or encryption.** Patients, notes and prescriptions reset on refresh. A real backend needs an encrypted database, HTTPS, and backups (the Admin "Run backup" button doesn't do anything yet).
- [ ] **Audit log isn't trustworthy.** It's kept in browser memory and anyone could edit it. It needs to be written on the server and be append-only.
- [ ] **No automatic sign-out.** Add an idle timeout or lock screen for shared front-desk computers.
- [ ] **Privacy rules.** If it's used in the US, it needs HIPAA safeguards: access logs, minimum necessary access, a BAA with the hosting provider. Elsewhere, check local health-data law.
- [ ] Keep secrets out of git: `.env` files are already in `.gitignore`. Keep it that way once there are API keys.

---

## Tools to use while working on this (suggested 2026-11-14)
- [x] **`/init`**: `CLAUDE.md` written (2026-11-18): commands, architecture, and the rules that span files (demo date, permissions, printouts, hooks, theme).
- **`/run`**: starts the app and checks it works.
- **`/code-review`**: checks changes for bugs before committing or pushing (e.g. `/code-review medium`).
- **`/simplify`**: cleans up changed code. The code is split into files per page now (see CLAUDE.md).
- **`/security-review`**: see Security above.
- **`/fewer-permission-prompts`**: pre-allows the safe commands you keep approving.
- **`skill-creator`**: build your own skill, e.g. a `/ui-check` that starts the dev server and reviews UI changes in one step.

Suggested routine: `/init` once, `/run` while working, `/code-review` before each push.

---

## Git
- Work is on the local branch **`ui-redesign`** (all committed; not pushed yet, run `git push -u origin ui-redesign`). **Not pushed and not merged into `main`.**
- Back it up: `git push -u origin ui-redesign`
- Put it on main when you're happy: `git checkout main && git merge ui-redesign`

---

## Future ideas
- [ ] **Real backend** (database + API) so data survives a refresh and is shared between staff. Everything in the Security section depends on this.
- [x] **Split `components/App.jsx`** into files (done 2026-11-18, see "Bugs fixed 2026-11-18").
- [ ] **Make the dashboard's "Reassign visit" and "Extend shift" do the job directly.** Right now they just open Appointments or Staff schedule.
- [ ] **Real "today"**: the app is pinned to Feb 25, 2026 at 10:10 (`DEMO_TODAY`, `DEMO_NOW`). Switch to the real date and time when it's used for real.
- [ ] **Notifications** for urgent things (a patient waiting too long, critical vitals, low stock), which the Settings toggles already hint at.
- [ ] **Mobile and tablet layout**: the sidebar and wide tables assume a desktop screen.
- [ ] **Tests** for the important logic: permissions, shift conflicts, vitals ranges, refill approvals.

---

## Saved for later

- **Review the sidebar groups for nurse and receptionist** (currently Today / Patients / Work) so each fits the role, like the admin grouping.
