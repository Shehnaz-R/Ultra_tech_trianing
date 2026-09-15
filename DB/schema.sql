-- ============================================================================
-- UltraTech Training Operations Portal — Phase 1: Database Schema
-- Engine: MySQL 8.x (InnoDB, utf8mb4)
-- Scope: 4 branches, 12 departments, 3 roles, monthly training cycle,
--        workshops/events, sign-off + escalation, document library, badges
-- ============================================================================

CREATE DATABASE IF NOT EXISTS ultratech_training
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ultratech_training;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. ORGANIZATION STRUCTURE
-- ----------------------------------------------------------------------------

CREATE TABLE branches (
  branch_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,          -- Thane, Pune, Kochi, Kolkata
  code          VARCHAR(10)  NOT NULL UNIQUE,    -- e.g. THN, PUN, KOC, KOL                  -- (removed )
  address       VARCHAR(255) NULL,                                                           -- (removed )
  is_hq         TINYINT(1)   NOT NULL DEFAULT 0,                                             -- (removed )
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP                              -- (removed )
) ENGINE=InnoDB;

CREATE TABLE departments (
  department_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(10)  NOT NULL UNIQUE,    -- EIA, EMTL, WWE, APCSM, ...
  name          VARCHAR(150) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP                                -- (removed )
) ENGINE=InnoDB;


-- ----------------------------------------------------------------------------
-- 2. USERS (Employees, Department Heads, HR — one table, role-differentiated)
--    NOTE: no salary/wage/CTC/bonus column exists anywhere in this schema
--    by design — compensation data is out of scope for this system.
-- ----------------------------------------------------------------------------

CREATE TABLE users (
  user_id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_code   VARCHAR(20)  NOT NULL UNIQUE,                                                -- (removed )
  name            VARCHAR(120) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            ENUM('employee','head','hr') NOT NULL,
  department_id   INT UNSIGNED NULL,             -- NULL only for corporate HR
  branch_id       INT UNSIGNED NOT NULL,
  designation     VARCHAR(120) NULL,
  experience_years DECIMAL(4,1) NULL,
  phone           VARCHAR(20)  NULL,                                                                                              -- (removed )
  bio             TEXT NULL,                                                                                                      -- (removed )                
  status          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,                                                                   -- (removed )
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,                                       -- (removed )
  CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
  CONSTRAINT fk_users_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id) ON DELETE RESTRICT,
  INDEX idx_users_role (role),
  INDEX idx_users_dept_role (department_id, role),
  INDEX idx_users_branch (branch_id)
) ENGINE=InnoDB;

-- Skills matrix (EMP-02 / HEAD-05)
CREATE TABLE skills (
  skill_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE user_skills (
  user_id      INT UNSIGNED NOT NULL,
  skill_id     INT UNSIGNED NOT NULL,
  verified     TINYINT(1) NOT NULL DEFAULT 0,
  verified_by  INT UNSIGNED NULL,
  verified_at  DATETIME NULL,
  PRIMARY KEY (user_id, skill_id),
  CONSTRAINT fk_uskills_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_uskills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
  CONSTRAINT fk_uskills_verifier FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. MONTHLY TRAINING CYCLE
-- ----------------------------------------------------------------------------

CREATE TABLE training_cycles (
  cycle_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  label       VARCHAR(50) NOT NULL,              -- e.g. "October 2026"
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      ENUM('open','in_review','finalized','archived') NOT NULL DEFAULT 'open',
  created_by  INT UNSIGNED NOT NULL,              -- HR user who triggered it
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cycle_creator FOREIGN KEY (created_by) REFERENCES users(user_id),
  INDEX idx_cycle_status (status)
) ENGINE=InnoDB;

-- 12-row department submission matrix per cycle (HR-03)
CREATE TABLE department_cycle_submissions (
  cycle_id      INT UNSIGNED NOT NULL,
  department_id INT UNSIGNED NOT NULL,
  status        ENUM('draft','submitted','under_review','approved') NOT NULL DEFAULT 'draft',
  submitted_by  INT UNSIGNED NULL,
  submitted_at  DATETIME NULL,
  approved_by   INT UNSIGNED NULL,
  approved_at   DATETIME NULL,
  PRIMARY KEY (cycle_id, department_id),
  CONSTRAINT fk_dcs_cycle FOREIGN KEY (cycle_id) REFERENCES training_cycles(cycle_id) ON DELETE CASCADE,
  CONSTRAINT fk_dcs_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
  CONSTRAINT fk_dcs_submitter FOREIGN KEY (submitted_by) REFERENCES users(user_id),
  CONSTRAINT fk_dcs_approver FOREIGN KEY (approved_by) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. TRAINING REQUESTS (self-requests, team requests, ad-hoc employee requests)
--    Single table for all three per plan doc — differentiated by requested_by
--    vs employee_id, and by a two-stage approval workflow.
-- ----------------------------------------------------------------------------

CREATE TABLE training_requests (
  request_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cycle_id        INT UNSIGNED NOT NULL,
  department_id   INT UNSIGNED NOT NULL,
  employee_id     INT UNSIGNED NOT NULL,          -- who the training is FOR
  requested_by    INT UNSIGNED NOT NULL,          -- who submitted it (self, or their head)
  title           VARCHAR(200) NOT NULL,
  justification   TEXT NOT NULL,
  suggested_vendor VARCHAR(150) NULL,                                                              -- (removed )
  preferred_mode  ENUM('classroom','virtual','field') NOT NULL DEFAULT 'classroom',
  estimated_hours DECIMAL(5,1) NULL,                                                               -- (removed )
  status          ENUM('pending_head','pending_hr','approved','rejected','merged','scheduled')
                  NOT NULL DEFAULT 'pending_head',
  reviewed_by     INT UNSIGNED NULL,               -- head or HR, whoever last acted
  reviewed_at     DATETIME NULL,
  rejection_note  TEXT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,        -- (removed )
  CONSTRAINT fk_req_cycle FOREIGN KEY (cycle_id) REFERENCES training_cycles(cycle_id),
  CONSTRAINT fk_req_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
  CONSTRAINT fk_req_employee FOREIGN KEY (employee_id) REFERENCES users(user_id),
  CONSTRAINT fk_req_requester FOREIGN KEY (requested_by) REFERENCES users(user_id),
  CONSTRAINT fk_req_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(user_id),
  INDEX idx_req_status (status),
  INDEX idx_req_cycle_dept (cycle_id, department_id),
  INDEX idx_req_employee (employee_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. WORKSHOPS / EVENTS (HR-05 Calendar) — normalized candidate allocation
-- ----------------------------------------------------------------------------

CREATE TABLE training_events (
  event_id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(200) NOT NULL,
  department_id INT UNSIGNED NULL,                -- NULL = cross-department
  branch_id     INT UNSIGNED NOT NULL,             -- venue
  trainer_vendor VARCHAR(150) NULL,
  mode          ENUM('classroom','virtual','field') NOT NULL DEFAULT 'classroom',           -- (removed )
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  capacity      SMALLINT UNSIGNED NULL,
  status        ENUM('scheduled','cancelled','completed') NOT NULL DEFAULT 'scheduled',
  source_request_id INT UNSIGNED NULL,                                -- (removed )
  created_by    INT UNSIGNED NOT NULL,             -- HR
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,                              -- (removed )
  CONSTRAINT fk_event_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
  CONSTRAINT fk_event_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
  CONSTRAINT fk_event_request FOREIGN KEY (source_request_id) REFERENCES training_requests(request_id) ON DELETE SET NULL,
  CONSTRAINT fk_event_creator FOREIGN KEY (created_by) REFERENCES users(user_id),
  INDEX idx_event_dates (start_date, end_date),
  INDEX idx_event_status (status)
) ENGINE=InnoDB;

-- Lean normalized allocation — assignedUserIds as a join table, not nested JSON
CREATE TABLE event_assignments (
  event_id   INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,                                -- (removed )
  PRIMARY KEY (event_id, user_id),
  CONSTRAINT fk_ea_event FOREIGN KEY (event_id) REFERENCES training_events(event_id) ON DELETE CASCADE,
  CONSTRAINT fk_ea_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 6. COMPLETIONS, PROOFS & SIGN-OFF (with manual/query-based SLA — no cron)
-- ----------------------------------------------------------------------------

CREATE TABLE documents (
  document_id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uploaded_by   INT UNSIGNED NOT NULL,
  department_id INT UNSIGNED NULL,
  branch_id     INT UNSIGNED NULL,                         -- (removed )
  category      ENUM('attendance_proof','certificate','training_material','other') NOT NULL,
  title         VARCHAR(200) NOT NULL,
  file_path     VARCHAR(500) NOT NULL,            -- path on VPS disk, not the file itself
  file_size_kb  INT UNSIGNED NULL,                                -- (removed )
  mime_type     VARCHAR(100) NULL,                                -- (removed )
  access_level  ENUM('company','department','private') NOT NULL DEFAULT 'department',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_doc_uploader FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
  CONSTRAINT fk_doc_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
  CONSTRAINT fk_doc_branch FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
  INDEX idx_doc_category_dept (category, department_id)
) ENGINE=InnoDB;

CREATE TABLE training_completions (
  completion_id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED NOT NULL,         -- employee who completed it
  event_id          INT UNSIGNED NULL,             -- if from a scheduled workshop
  request_id        INT UNSIGNED NULL,             -- if from an ad-hoc/self request
  title             VARCHAR(200) NOT NULL,         -- snapshot, survives event/request edits        -- (removed )
  department_id     INT UNSIGNED NOT NULL,
  duration_hours    DECIMAL(5,1) NOT NULL,
  proof_document_id INT UNSIGNED NULL,
  status            ENUM('pending_signoff','approved','rejected') NOT NULL DEFAULT 'pending_signoff',
  submitted_at      DATETIME NOT NULL,
  signoff_deadline  DATETIME NOT NULL,             -- submitted_at + 7 days, set at insert time
  signed_off_by     INT UNSIGNED NULL,             -- department head
  signed_off_at     DATETIME NULL,
  rejection_note    TEXT NULL,
  escalated_to_hr   TINYINT(1) NOT NULL DEFAULT 0, -- flips true once HR opens/actions it
  hr_override_by    INT UNSIGNED NULL,
  hr_override_at    DATETIME NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,                                   -- (removed )
  CONSTRAINT fk_comp_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_comp_event FOREIGN KEY (event_id) REFERENCES training_events(event_id) ON DELETE SET NULL,
  CONSTRAINT fk_comp_request FOREIGN KEY (request_id) REFERENCES training_requests(request_id) ON DELETE SET NULL,
  CONSTRAINT fk_comp_dept FOREIGN KEY (department_id) REFERENCES departments(department_id),
  CONSTRAINT fk_comp_proof FOREIGN KEY (proof_document_id) REFERENCES documents(document_id) ON DELETE SET NULL,
  CONSTRAINT fk_comp_signer FOREIGN KEY (signed_off_by) REFERENCES users(user_id),
  CONSTRAINT fk_comp_hr FOREIGN KEY (hr_override_by) REFERENCES users(user_id),
  -- This index is what makes the Sign-off Queue / Escalations Hub cheap to query
  -- without a cron job: WHERE status='pending_signoff' AND signoff_deadline < NOW()
  INDEX idx_comp_status_deadline (status, signoff_deadline),
  INDEX idx_comp_user (user_id),
  INDEX idx_comp_dept (department_id)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 7. RECOGNITION: PROMOTIONS / AWARDS / BADGES
-- ----------------------------------------------------------------------------

CREATE TABLE badges (
  badge_id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,        -- "Lab Safety Champion", etc.
  description VARCHAR(255) NULL,
  icon        VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE user_badges (
  user_id     INT UNSIGNED NOT NULL,
  badge_id    INT UNSIGNED NOT NULL,
  awarded_by  INT UNSIGNED NOT NULL,               -- HR
  awarded_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note        VARCHAR(255) NULL,                           -- (removed )
  PRIMARY KEY (user_id, badge_id),
  CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
  CONSTRAINT fk_ub_awarder FOREIGN KEY (awarded_by) REFERENCES users(user_id)
) ENGINE=InnoDB;



-- ----------------------------------------------------------------------------
-- 8. NOTIFICATIONS
-- ----------------------------------------------------------------------------

CREATE TABLE notifications (
  notification_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NULL,              -- NULL = company-wide broadcast
  type             VARCHAR(50) NOT NULL,            -- e.g. 'cycle_open','signoff_approved','request_rejected'
  message          VARCHAR(255) NOT NULL,
  related_entity_type VARCHAR(50) NULL,             -- 'training_request','training_completion', etc. -- (removed )
  related_entity_id   INT UNSIGNED NULL,            -- (removed)             
  is_read          TINYINT(1) NOT NULL DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;