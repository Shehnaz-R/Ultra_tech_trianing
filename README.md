# UltraTech Training Portal
**Internal Operations & Training Management System**
> UltraTech Environmental Consultancy & Laboratory — 37+ Years of Excellence

---

## Quick Start

## to run the project directly 
```
agy-node.cmd server.js
```

### Run the Server
```
node server.js
```
Then open: **http://localhost:3000**

### Run Tests
```
node test.js
```

---

## File Structure

```
Project_training/
|
+-- index.html              # Main shell — top bar, sidebar, modals, mobile nav
+-- server.js               # Zero-dependency Node.js static file server
+-- test.js                 # Automated test suite (11 checks)
+-- README.md               # This file
|
+-- css/
|   +-- app.css             # Ink & Paper ops-board design system
|
+-- js/
|   +-- data.js             # Seed data — 12 depts, 3 personas, trainings, requests
|   +-- store.js            # Reactive state store with LocalStorage persistence
|   +-- app.js              # View router, all 23 screen renderers, event handlers
|
+-- docs/
    +-- implementation_plan.md   # Technical design & architecture decisions
    +-- walkthrough.md           # Feature walkthrough & change log
    +-- screen_audit.md          # Full screen checklist (23 screens, all done)
```

---

## Demo Personas — Login via Profile -> Manual Login

| Name | Role | Initials |
|------|------|---------|
| Rahul Sharma | Employee — Senior Environmental Analyst | RS |
| Priya Nair | Dept Head — Environmental Media Monitoring | PN |
| Vikram Seth | HR Admin — People, Culture & Capability | VS |

---

## Screens (23 Total — All Done)

### Employee (5): Home, My Profile, My Trainings, Request Training, Notifications
### Head (9): Home, My Profile, My Trainings, Request Training, Team, Sign-Off Queue, Request Status, Team Reports, Notifications
### HR Admin (9): Home, My Profile, Cycle Control, Requests, Calendar, Directory, Escalations, Promotions, Reports

---

## Design System — Ink & Paper Ops Board

- Ink:          #14181F  (primary text)
- Paper:        #F7F6F3  (background)
- Signal Blue:  #3B5BDB  (actions)
- Amber:        #B8860B  (warnings)
- Moss Green:   #2F7D5A  (success)
- Crimson:      #B3261E  (errors/escalations)
- Border:       #E4E1DA

---

## Key Features

- Role-based sidebar navigation (Employee / Head / HR)
- Inline profile editing (name, designation, experience, email, dept)
- 7-day SLA escalation auto-countdown
- Proof upload drawer (attendance + certificate)
- Notification bell with live unread badge
- One-click role switcher (demo login modal)
- CSV export (team + HR reports)
- LocalStorage persistence across page refreshes
- Mobile-responsive bottom navigation
- Zero salary/compensation fields (privacy enforced)

---

UltraTech Internal Ops Board v2.4
-- by Shehnaz Rangrez 
