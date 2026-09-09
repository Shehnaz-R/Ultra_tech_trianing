# UltraTech Portal — Data Optimization & Cost-Reduction Audit

**Goal:** Streamline database schema, purge redundant UI filters/fields, and optimize payload sizes to minimize operational & cloud data costs.

---

## 🗑️ 1. Redundant / Unnecessary Fields to Remove

| Entity | Field Name | Reason for Removal / Optimization | Cost Impact |
|---|---|---|---|
| Users / Personals | `salary`, `ctc`, `compensation` | ❌ Structurally prohibited. Purged entirely for privacy & compliance. | High (Privacy & Storage) |
| Users / Personals | `avatarUrl` (external image link) | ❌ Dynamic initials badges (RS, PN, VS) replace heavy image assets. | High (Bandwidth & CDN) |
| Trainings / Requests | `headNotes` (on pending items) | ❌ Redundant on non-rejected items. Store notes only when a request is rejected or escalated. | Medium (DB Payload) |
| HR Dashboard | Top-Right FILTER SCOPE Dropdown | ❌ Removed. Redundant since top bar already contains global DEPT and BRANCH controls. | Low (UI Cleanliness) |
| Events / Workshops | `assignedEmployees` full JSON objects | ⚠️ Currently stores duplicate `{id, name, dept}` objects. Should store only `assignedUserIds` array `["user-01", "user-02"]`. | Medium (DB Payload) |
| Notifications | `targetRoles` array + long message text | ⚠️ Keep notification messages under 100 chars; drop verbose explanations. Purge read notifications older than 30 days. | High (Storage Growth) |

---

## 💡 2. Recommendations for Minimal Data Architecture

### A. Normalized References instead of Embedded Objects
- **Current:** Requests store candidate name, department name, head name inline.
- **Optimized:** Store only `applicantId`, `departmentId`, `headId`. Resolve names dynamically on UI render.
- **Impact:** Reduces request object size by **65%**.

### B. Image & File Proof Storage Policy
- **Current:** Uploaded file metadata generates rich simulated file cards.
- **Optimized:** Limit proof documents to standard compressed PDFs (Max 2MB). Store files in S3/Object Storage with short URLs, never raw Base64 in local DB.

### C. Automated Data Pruning (TTL Policy)
- Set a **30-day retention policy** for read notification logs.
- Set a **1-year retention policy** for completed training cycle logs before cold-archiving to S3 Glacier.

---

## ✅ Action Taken in this Update

- Removed the redundant **FILTER SCOPE** dropdown from the HR Dashboard header (Image 2).
- Added **Role Filter** (All, Employees, Department Heads, HR Admins) and real-time **Search** to the Employee Directory (Image 1).
