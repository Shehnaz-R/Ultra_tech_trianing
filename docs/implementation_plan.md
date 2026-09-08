# Implementation Plan: UltraTech Training Portal (Internal Ops Board)

Build an interactive, aesthetically designed, role-based Training Management & Operations Portal for **UltraTech Environmental Consultancy & Laboratory** (`ultratech.in`). The UI adheres to an "ink & paper" ops/status board design language: bordered tabular layouts, signal blue primary actions, semantic status tags, live deadline countdowns, inline edit/save feedback, and seamless role switching.

## User Review Required

> [!IMPORTANT]
> **Key Architecture & Design Decisions:**
> 1. **Zero Setup Standalone + Local Server**: The application is built as a self-contained Single Page Application (`index.html`, `app.css`, `data.js`, `store.js`, `app.js`, `server.js`) that runs seamlessly both directly in any web browser and via `agy-node server.js` on `http://localhost:3000`.
> 2. **Roles & Persona Switcher**: Top-bar role switcher enables 1-click toggling between:
>    - **Employee**: Rahul Sharma (Senior Environmental Analyst, Dept: Environmental Monitoring & Lab)
>    - **Department Head**: Priya Nair (Head of Environmental Monitoring & Laboratory)
>    - **HR / Admin**: Vikram Seth (Corporate HR & Capability Lead)
> 3. **Branding Alignment**: High-contrast, clean industrial aesthetic reflecting UltraTech Environmental Consultancy & Laboratory with ink & paper palette: `#14181F` (ink), `#F7F6F3` (paper), `#FFFFFF` (surface), `#3B5BDB` (signal blue), `#B8860B` (amber), `#2F7D5A` (moss green), `#B3261E` (crimson), and `#E4E1DA` (crisp borders).
> 4. **Compensation Privacy Guard**: Structurally enforced in code and export generators—no compensation or salary fields exist in the data model or exports.

## Proposed Components & Structure

```
c:\Users\PRAJECT1\Downloads\Project_training\
├── index.html         # Main application shell with top bar, role switcher, left sidebar, and viewports
├── css/
│   └── app.css        # Ops-board design tokens, tabular figure styles, pill tags, countdown badge animations
├── js/
│   ├── data.js        # Seed data for all 12 UltraTech departments, employees, training catalogue, cycles, requests, escalations
│   ├── store.js       # Central reactive state manager with localStorage persistence, countdown timers & role dispatch
│   └── app.js         # Core view controllers, renderers, event handlers, inline editing, file upload previews, export engine
├── server.js          # Lightweight HTTP server using built-in Node modules (executable via agy-node.cmd)
└── test.js            # Automated verification tests for business logic, 7-day escalations, role access, and export security
```

---

### 1. Data Model & Seed Dataset (`js/data.js`)
- **12 UltraTech Departments**:
  1. Environmental Clearance & EIA
  2. Turnkey Engineering & Project Consultancy
  3. Environmental Media Monitoring & Lab Analysis
  4. STP / ETP Operation & Maintenance
  5. Environmental & Social Due Diligence (ESDD)
  6. Environmental Regulatory Compliance
  7. Air Quality Monitoring & Stack Testing
  8. Chemical & Microbiological Lab Services
  9. Occupational Health, Safety & Environment (HSE)
  10. Solid & Hazardous Waste Management
  11. Sustainability, Carbon & ESG Advisory
  12. GIS, Remote Sensing & Hydrogeological Modeling
- **Personas**:
  - `emp-01` Rahul Sharma (Senior Environmental Analyst)
  - `head-01` Priya Nair (HOD, Environmental Media Monitoring & Lab Analysis)
  - `hr-01` Vikram Seth (HR Lead & Administrator)
  - Additional realistic staff across departments for multi-select, team views, and cross-department requests.
- **Initial States**:
  - Monthly Cycle: Active cycle (`CYC-2026-09`, September 2026 Training Cycle) with deadline and per-department status.
  - Pre-seeded trainings: Assigned, In Progress, Pending Sign-off (with remaining days), Completed, Resubmit Requested, Escalated (both auto-escalated after 7 days and appealed rejections).
  - Training Events calendar: Upcoming workshops (e.g. ISO 17025 Laboratory Quality Management, CPCB Stack Emission Sampling Protocols, Industrial ETP Biological Process Control).

---

### 2. State & Storage Engine (`js/store.js`)
- **Reactive State**: Role, active view, training cycle status, requests, sign-offs, escalations, notifications, directory, promotion shortlist.
- **7-Day Auto-Escalation Logic**: Calculates remaining days `(7 - elapsedDays)`; visual countdown shifts from neutral (>3 days) to warning (<=3 days) to overdue/escalated (<=0 days). When elapsed > 7 days, state locks as `Escalated to HR` and is read-only for Head.
- **Inline Editing & Persistence**: Update employee profile (skills, projects handled) with instant visual "Saved" state indicator.
- **Simulated File Upload**: Attendance sheet and Certificate uploads generate live document cards with file icon, simulated byte size, timestamp, and visual preview.

---

### 3. Screen Implementations (`index.html`, `js/app.js`)

#### Top Bar & Navigation
- **Persistent Scope Indicator**: `All departments` (HR) / `Environmental Media Monitoring & Lab` (Head) / `You (Rahul Sharma)` (Employee).
- **One-Click Role Switcher**: Quick toggle between Rahul Sharma (Employee), Priya Nair (Head), and Vikram Seth (HR).
- **Notification Bell**: Badge counter, sliding drawer with chronological feed, unread/read state, and category filtering.
- **Left Sidebar**: Responsive, role-aware navigation items (dynamic per role) with badge counters for Sign-off Queue and Escalations.

#### 5.1 Employee Views
- **Home**: Welcome hero with UltraTech branding, active cycle announcement banner ("Monthly training cycle is open"), upcoming training summary cards (next 2-3 with date and status pill), primary action button "Request Training".
- **My Profile**: Name, department, designation, experience, editable skills tag list (add new tag, remove tag), editable projects list (add project, remove), inline edit with auto-save feedback pill ("✓ Changes saved").
- **My Trainings**: Dense tabular view of assigned trainings with status tags (`Upcoming`, `In Progress`, `Pending Sign-off`, `Completed`, `Resubmit Requested`, `Escalated`). Row expansion reveals training details and "Upload completion proof" action.
- **Completion Upload Form**: Key learnings textarea, attendance sheet file input, certificate file input, simulated document preview; submitting locks edits and transitions status to "Pending Sign-off" with 7-day countdown badge.
- **Request Training & Status**: Prefilled employee/dept/head form, wanted training selection, submit confirmation. Includes "My Requests & Escalations" table. If status is `Rejected` or `Resubmit Requested`, displays "Escalate to HR" button with required note modal/drawer; updates tag to `Awaiting HR review`.
- **Notifications**: Feed of cycle announcements, approvals, resubmissions, and escalation updates.

#### 5.2 Department Head Views
- **Head Home**: Employee Home features + Department Snapshot KPI cards (Team size: 18, Open requests: 5, Pending sign-offs: 3, Overdue/Escalated: 1). Actionable card: "Submit your team's training request" with cycle countdown.
- **My Profile & My Trainings**: Reused employee modules for the head's own profile and personal trainings.
- **Request Training**:
  - *Tab A (Self)*: Standard employee request form.
  - *Tab B (Team)*: Searchable multi-select employee list (scoped to own department), training topic, mode (In-house/External), batch or individual submit.
- **Team**: Directory of direct reports, click into read-only profile + training history view.
- **Sign-Off Queue**: Pending submissions table with employee, course, submitted date, and dynamic countdown badge. Detail drawer to inspect learnings and attachment previews, with "Approve" and "Send back for resubmission" (requires reason). Items past 7 days are marked "Escalated to HR" (read-only for head).
- **Training Requested Status**: Table of submitted team and self requests, clearly flagging any requests that an employee appealed over head rejection.
- **Team Reports / Promotion Filter**: Filters (tenure, completed trainings, category). Structured columns first; notes column collapsed/expandable. "Flag for promotion/award" modal with department-scoped notes.

#### 5.3 HR / Admin Views
- **HR Home Dashboard**: Company-wide KPI tiles (Departments reporting, Active cycle, Pending approvals, 84.6% Completion rate, Open escalations). Department filter affecting all metrics and tables.
- **Monthly Cycle Control**: Open/Close cycle switch with confirmation modal, per-department submission status table (12 departments, Pending/Submitted), "Send reminder" action with instant notification trigger, background job caption.
- **Requests Consolidation**: All submitted requests across 12 departments with `Common` vs `Unique` tags, highlighted employee appeals. Row actions: Approve, Reject (with reason), Send back. Bulk-select checkboxes to approve batches of common requests.
- **Calendar & Allocation**: Training events list/calendar view, "Create Event" form (title, mode: in-house/external, date, capacity, external-only HOD approval checkbox + reimbursement percentage). Multi-select to assign approved employees.
- **Directory & HR Employee Profile**: Searchable table across all 12 departments. Full profile view with training history and completion proofs. **Strictly zero compensation fields.**
- **Escalations Hub**: Dual tabs:
  - *(a) Overdue Sign-offs*: Passed 7-day head deadline.
  - *(b) Employee Appeals*: Rejection appeals with employee notes and head's original remarks.
  - Actions: Approve, Reject, Resolve.
- **Promotions & Awards Shortlist**: Structured-data-first company-wide table with department filter and notes flagging.
- **Reports & Export**: Filter panel + CSV/Excel and formatted printable PDF export with strict structural exclusion of compensation data.

---

## Verification Plan

### Automated Verification
Run Node test suite (`test.js`) using `agy-node.cmd test.js`:
- Check 12 UltraTech departments exist in data definitions.
- Verify 7-day auto-escalation calculation and state transition.
- Verify role switcher permissions and view filtering.
- Verify data isolation: ensure no `salary`, `compensation`, or `pay` keys exist in profile or export structures.
- Verify simulated upload handles file metadata and previews.

### Manual / Browser Verification
1. Launch local server `agy-node.cmd server.js` and verify HTTP response at `http://localhost:3000`.
2. Verify role switching between Rahul (Employee), Priya (Head), and Vikram (HR).
3. Test Employee flow:
   - Inline edit profile skills and verify non-blocking "Saved" feedback.
   - Upload completion proof with attendance and certificate, verify status flips to "Pending Sign-off" with 7-day deadline.
   - Submit training request, verify escalation appeal button on rejected request.
4. Test Head flow:
   - Verify Department snapshot KPIs on Head Home.
   - Open Sign-Off Queue: review proof, test "Approve", test "Send back" with reason.
   - Test Team Training tab with multi-select employee picker.
   - Test Team Reports promotion flagging.
5. Test HR flow:
   - Toggle Monthly Training Cycle open/close and send department reminders.
   - Bulk-approve common requests in Requests table.
   - Create calendar event with external reimbursement % and assign approved candidates.
   - Resolve escalations from both overdue deadlines and employee appeals.
   - Trigger CSV/PDF exports and inspect exported columns to guarantee zero compensation fields.
