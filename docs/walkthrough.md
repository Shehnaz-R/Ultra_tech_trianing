# UltraTech Training Operations Portal — Walkthrough & Verification

The **UltraTech Training Portal** (`ultratech.in`) is an internal operations board built for managing training nominations, SLA deadlines, proof verification, and executive escalations across all 12 UltraTech departments.

---

## 🌟 Accessing the Portal

- **Live Local URL**: [http://localhost:3000](http://localhost:3000)
- **Direct File Access**: [index.html](file:///c:/Users/PRAJECT1/Downloads/Project_training/index.html) (functions standalone without server dependencies)
- **Server Process**: Managed background daemon via [server.js](file:///c:/Users/PRAJECT1/Downloads/Project_training/server.js)

---

## 🎨 Visual & Aesthetic Design System

Adheres strictly to the requested "ink & paper" ops/status board design system:
- **Ink & Paper Palette**: `#14181F` (primary text & headers), `#F7F6F3` (page background), `#FFFFFF` (surface panels), `#3B5BDB` (signal blue primary actions), `#B8860B` (amber deadline warning), `#2F7D5A` (moss green verified/approved), `#B3261E` (crimson rejection & escalation), and `#E4E1DA` (crisp borders).
- **Tabular Figures**: Numeric alignment with `font-feature-settings: 'tnum'` across IDs, tenures, counts, and dates.
- **Consistent Pill Statuses**: Every training, request, and cycle state displays a standardized pill badge.
- **Dynamic SLA Countdown Shift**:
  - Safe (>3 days remaining): Neutral slate badge
  - Warning (≤3 days remaining): Amber badge with subtle pulsing animation
  - Urgent (≤1 day remaining): Crimson alert badge
  - Overdue (≥7 days elapsed): Dark crimson badge locked as *Overdue · Escalated to HR*

---

## 👥 Personas, Profile Icon & Role Switcher (Images 1, 2 & 3)

1. **Notification Bell with Prominent Badge (Image 1 & 3)**:
   - Always-visible crisp bell icon in the top navigation bar.
   - Distinct red circular badge with white text displaying the unread count (e.g., `5` or `2`), styled with white border and drop shadow matching **Image 1** and **Image 3**.
   - Clicking toggles the slide-over operations notification drawer.

2. **Top Bar Profile Menu & Dropdown (Image 3)**:
   - Displays avatar initials/photo, user's full name (**Rahul Sharma**), role label (**Employee**), and chevron dropdown arrow.
   - Clicking opens the dropdown menu matching **Image 3**:
     - User full name and official email (`rahul.sharma@ultratech.com`)
     - `UNAUTH_PROBE` / active session status indicator
     - Quick 1-click persona switch buttons (Employee, Head, HR)
     - **Manual Login / Key Auth** button with user icon

3. **UltraTech Portal Login Modal (Image 2)**:
   - Clicking **Manual Login / Key Auth** opens the exact modal depicted in **Image 2**:
     - Blue square "UT" brand header: *UltraTech Portal Login — JWT Authenticated Access & Role Switcher*
     - **QUICK ONE-CLICK DEMO ACCESS**:
       - **Rahul Sharma** · Senior Process Engineer · `EMPLOYEE` badge
       - **Priya Nair** · Head of Manufacturing · `HEAD` badge
       - **Vikram Seth** · GM - Corporate L&D & Talent · `HR` badge
       *(Clicking any persona card instantly switches the application to that role)*
     - **OR SIGN IN WITH PASSWORD** divider
     - UltraTech Email input (with mail envelope icon, prefilled with `vikram.seth@ultratech.com`)
     - Password input (with lock icon, prefilled with masked characters)
     - **Sign In to Portal** dark button with blue shield icon

| Persona | Name | Role | Department | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Employee** | **Rahul Sharma** | Senior Process Engineer / Analyst | Environmental Media Monitoring & Lab | Inline profile editing, proof upload (attendance & certificate), request training, appeal rejections to HR |
| **Department Head** | **Priya Nair** | Head of Department / Manufacturing | Environmental Media Monitoring & Lab | Team snapshot KPIs, 7-day sign-off queue, team batch nominations, direct report profiles, promotion shortlist |
| **Corporate HR** | **Vikram Seth** | GM - Corporate L&D / HR Lead | Corporate HR & Talent Operations | Company-wide KPIs, cycle control & broadcast reminders, bulk request approval, workshop scheduling, escalations resolution |

---

## 📋 Comprehensive Screen Breakdown

### 1. Employee Screen Suite (§5.1)
- **Home**:
  - Passive banner alerting that the monthly training cycle is open (`September 2026 Monthly Training Cycle`).
  - Summary cards for upcoming and in-progress trainings with direct "Upload Completion Proof" action.
  - Primary button: "Request Training".
- **My Profile**:
  - Static employment details (department, position, experience, reporting head).
  - **Inline Editable Skills Tag List**: Add and delete tags dynamically.
  - **Inline Editable Handled Projects**: Add and delete project credentials.
  - Non-blocking green save state indicator (`✓ Saved automatically`) that confirms edits without page reload or intrusive modals.
- **My Trainings**:
  - Tabular list of assigned trainings with statuses (`Upcoming`, `In Progress`, `Pending Sign-off`, `Completed`, `Resubmit Requested`, `Escalated`).
  - Row action to upload completion proof (key learnings textarea, attendance sheet, certificate). Submitting flips status to `Pending Sign-off` with 7-day countdown badge.
- **Request Training**:
  - Prefilled employee form (name, dept, designation, head).
  - Status feed displaying submitted requests.
  - If a request is rejected or resubmission is requested, an **"Escalate to HR"** button appears, requiring a justification note and updating the status to `Awaiting HR review`.
- **Notifications**:
  - Chronological feed of cycle announcements, training assignments, and approval updates with unread/read distinction.

---

### 2. Department Head Screen Suite (§5.2)
- **Head Home**:
  - All employee features plus a **Department Snapshot** (Team size: 18 staff, Open nominations: 5, Pending sign-offs: 3, Overdue: 1 past deadline).
  - Actionable card: *"Submit your team's training request"* with cycle deadline countdown.
- **My Profile & My Trainings**:
  - Reused identical components from the employee view.
- **Request Training**:
  - **Tab A (Self)**: Standard individual request form.
  - **Tab B (Team)**: Department batch nomination with searchable multi-select of direct reports in Priya's department.
- **Team Directory**:
  - Directory of direct reports with tenure, active courses, and key competency tags.
  - Click into read-only employee training profile.
- **Sign-Off Queue**:
  - Interactive table with countdown timer until auto-escalation.
  - Review drawer to inspect employee's key learnings and attachment cards (attendance sheet & certificate).
  - Actions: **Approve Sign-Off** or **Send Back for Resubmission** (requires reason).
  - Items older than 7 days lock into read-only mode labeled *Overdue · Escalated to HR*.
- **Training Requested Status**:
  - Consolidated status of self and team requests, clearly flagging any employee appeals filed over head rejections.
- **Team Reports & Promotion Filter**:
  - Filters for tenure and completion velocity.
  - Structured columns lead (tenure, completions, categories); notes field is secondary and collapsed.
  - "Flag for Award" action modal scoped to department.

---

### 3. Corporate HR / Admin Screen Suite (§5.3)
- **HR Home Dashboard**:
  - Pan-India KPI tiles (Departments reporting, cycle active status, pending approvals, 84.6% completion rate, open escalations).
  - Department filter dropdown affecting metric scopes.
- **Monthly Cycle Control**:
  - Open/Close cycle toggle with confirmation and background notification broadcast job.
  - 12-department submission tracker table with direct "Send Reminder" button.
- **Requests Consolidation**:
  - Master requests table across all 12 departments with `Common` vs `Unique` tags.
  - Bulk-select checkboxes with **"Bulk Approve Selected Common Requests"** button.
- **Calendar & Allocation**:
  - Workshop events list with capacity tracking and venue details.
  - "Schedule Training Event" modal with support for external training governance (HOD pre-approval checkbox + reimbursement percentage field).
  - Candidate allocation picker to assign approved employees.
- **Employee Directory**:
  - Searchable roster across all 12 UltraTech departments.
  - Full profile view with training history and completion proofs.
  - **Strictly Zero Compensation Fields**: Structurally barred from data models and exports.
- **Escalations Hub**:
  - **Sub-List A**: Sign-offs exceeding the 7-day head deadline (auto-escalated for executive HR sign-off).
  - **Sub-List B**: Formal employee appeals against head rejections.
  - Full context review with Approve / Reject resolution actions.
- **Promotions & Awards Shortlist**:
  - Organization-wide candidate evaluations with track category and justification notes.
- **Reports & Export**:
  - One-click CSV and printable PDF quality audit sheet with structural privacy guarantees.

---

## 🧪 Verification Results

Automated test suite (`agy-node.cmd test.js`) completed with 100% success:
```
🧪 Running UltraTech Training Portal Verification Tests...

✓ File verified: index.html
✓ File verified: css/app.css
✓ File verified: js/data.js
✓ File verified: js/store.js
✓ File verified: js/app.js
✓ File verified: server.js
✓ All 12 UltraTech Departments verified in dataset.
✓ 3 Core Personas verified (Rahul Sharma, Priya Nair, Vikram Seth).
✓ 7-Day Auto-Escalation SLA countdown calculation verified across all thresholds.
✓ Structural Privacy Verified: Zero compensation/salary/pay fields in data structures.
✓ All structural HTML modals, drawers, and persistent top bar components verified.

🎉 ALL TESTS PASSED SUCCESSFULLY! The portal is ready for launch.
```
