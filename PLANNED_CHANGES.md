# Planned Changes

Last updated: 2026-11-14

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
- [ ] Admin top row and "More" dropdown look right
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

**Status:** In progress. The direction is confirmed (blue accent; the theme toggle stays in Settings and follows the device).

**Direction (proposed)**
- **Character:** steady, exact, quietly warm. The world is the exam room and the paper chart.
- **Colors:** neutral grey backgrounds. Med+ blue `#2563EB` is the only accent, as a solid color with no gradients. Status colors (teal, amber, green, red) are used only for statuses.
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

**6. Remaining pages**, one at a time: Appointments, Patients list, Refills, Recalls, Tasks, Inventory, Staff Schedule, Reports, Admin, Settings
- [ ] Replace the rest of the emoji (✓ ⚠ 📅 🔒 📋 …) with icons or plain text
- [ ] All-caps table headers → normal case

**7. Final sweep**
- [ ] Motion: one easing curve. Remove the looping pulse on the scanning emoji and keep the loading skeleton subtle.
- [ ] Run the unslop checklist and check every role in light and dark mode

### Dark mode decisions
- The toggle stays in **Settings only** for now (Settings is limited to doctor and admin, so nurses and receptionists get the device setting)
- It **follows the device** by default and can be changed to Light or Dark ✅ built in step 1
- Dark mode uses the same new look as light mode

---

## Saved for later

- **Reorder the top row for nurse and receptionist** so it fits each role, like the admin change.
