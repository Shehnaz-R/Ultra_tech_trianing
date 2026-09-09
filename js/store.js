/**
 * UltraTech Training Portal - Reactive State Management Store
 * Handles role dispatch, 7-day auto-escalation calculation, LocalStorage sync,
 * proof validation, and structurally enforces zero compensation fields.
 */

import { ULTRATECH_DATA } from './data.js';

const STORAGE_KEY = 'ultratech_training_ops_v1';

class Store {
  constructor() {
    this.subscribers = [];
    this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.state = JSON.parse(saved);
        // Guarantee no compensation fields exist even in stored state
        this.sanitizeState();
      } else {
        this.resetState();
      }
    } catch (e) {
      console.warn("Could not load from localStorage, initializing default state.", e);
      this.resetState();
    }
  }

  resetState() {
    this.state = {
      currentRole: 'employee', // 'employee' | 'head' | 'hr'
      currentView: 'employee-home',
      activeDepartmentFilter: 'all',
      organization: JSON.parse(JSON.stringify(ULTRATECH_DATA.organization)),
      departments: JSON.parse(JSON.stringify(ULTRATECH_DATA.departments)),
      users: JSON.parse(JSON.stringify(ULTRATECH_DATA.users)),
      cycle: JSON.parse(JSON.stringify(ULTRATECH_DATA.cycle)),
      trainings: JSON.parse(JSON.stringify(ULTRATECH_DATA.trainings)),
      requests: JSON.parse(JSON.stringify(ULTRATECH_DATA.requests)),
      events: JSON.parse(JSON.stringify(ULTRATECH_DATA.events)),
      notifications: JSON.parse(JSON.stringify(ULTRATECH_DATA.notifications)),
      promotionFlags: JSON.parse(JSON.stringify(ULTRATECH_DATA.promotionFlags))
    };
    this.sanitizeState();
    this.persistState();
  }

  sanitizeState() {
    // Structural guard: purge any salary or compensation keys from all entities
    const purgeKeys = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      ['salary', 'compensation', 'ctc', 'pay', 'wage', 'bonus'].forEach(k => delete obj[k]);
      Object.values(obj).forEach(val => {
        if (typeof val === 'object') purgeKeys(val);
      });
    };
    purgeKeys(this.state);
  }

  persistState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Storage error:", e);
    }
    this.notify();
  }

  subscribe(fn) {
    this.subscribers.push(fn);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== fn);
    };
  }

  notify() {
    this.subscribers.forEach(fn => {
      try {
        fn(this.state);
      } catch (err) {
        console.error("Subscriber notification error:", err);
      }
    });
  }

  // Current user helper based on active role
  getCurrentUser() {
    switch (this.state.currentRole) {
      case 'head':
        return this.state.users.find(u => u.id === 'user-head-01') || this.state.users[1];
      case 'hr':
        return this.state.users.find(u => u.id === 'user-hr-01') || this.state.users[2];
      case 'employee':
      default:
        return this.state.users.find(u => u.id === 'user-emp-01') || this.state.users[0];
    }
  }

  // Get active scope label for top bar
  getScopeInfo() {
    const user = this.getCurrentUser();
    if (this.state.currentRole === 'hr') {
      const deptName = this.state.activeDepartmentFilter === 'all' 
        ? 'All 12 UltraTech Departments' 
        : (this.state.departments.find(d => d.id === this.state.activeDepartmentFilter)?.name || 'Filtered Department');
      return {
        badge: 'Organization-wide',
        scope: deptName,
        roleTitle: 'Corporate HR / Administrator'
      };
    } else if (this.state.currentRole === 'head') {
      return {
        badge: 'Department Scope',
        scope: user.department,
        roleTitle: 'Head of Department'
      };
    } else {
      return {
        badge: 'Individual Scope',
        scope: `${user.name} (${user.department})`,
        roleTitle: 'Employee'
      };
    }
  }

  // Role switching
  setRole(role) {
    if (!['employee', 'head', 'hr'].includes(role)) return;
    this.state.currentRole = role;
    if (role === 'employee') {
      this.state.currentView = 'employee-home';
    } else if (role === 'head') {
      this.state.currentView = 'head-home';
    } else if (role === 'hr') {
      this.state.currentView = 'hr-home';
    }
    this.persistState();
  }

  setView(viewId) {
    this.state.currentView = viewId;
    this.persistState();
  }

  setDepartmentFilter(deptId) {
    this.state.activeDepartmentFilter = deptId;
    this.persistState();
  }

  // Profile inline editing
  updateProfile(userId, { skills, projects, name, position, tenureYears, email, department, departmentId }) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return false;

    if (Array.isArray(skills)) user.skills = skills;
    if (Array.isArray(projects)) user.projects = projects;

    // Basic employment field edits
    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
      // Auto-update avatar initials from new name
      const parts = name.trim().split(/\s+/);
      user.avatarInitials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    if (typeof position === 'string' && position.trim()) user.position = position.trim();
    if (typeof email === 'string' && email.trim()) user.email = email.trim();
    if (typeof department === 'string' && department.trim()) user.department = department.trim();
    if (typeof departmentId === 'string' && departmentId.trim()) user.departmentId = departmentId.trim();
    if (tenureYears !== undefined && !isNaN(parseFloat(tenureYears))) {
      user.tenureYears = parseFloat(tenureYears);
    }

    this.persistState();
    return true;
  }

  // Completion proof submission
  submitTrainingProof(trainingId, { learnings, attendanceFile, attendanceSize, certificateFile, certificateSize }) {
    const trn = this.state.trainings.find(t => t.id === trainingId);
    if (!trn) return false;

    trn.status = 'Pending Sign-off';
    trn.submissionDate = new Date().toISOString().split('T')[0];
    trn.daysElapsed = 0; // Starts countdown from 7 days remaining
    trn.proof = {
      learnings: learnings || 'Completion learnings logged by employee.',
      attendanceFile: attendanceFile || 'Attendance_Verified.pdf',
      attendanceSize: attendanceSize || '1.1 MB',
      certificateFile: certificateFile || 'Certificate_Of_Completion.pdf',
      certificateSize: certificateSize || '2.4 MB',
      submittedAt: new Date().toISOString().split('T')[0]
    };

    // Add head notification
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'signoff_submitted',
      title: 'New Completion Proof Submitted',
      message: `${trn.userName} submitted completion proof for "${trn.title}". 7-day sign-off review window active.`,
      unread: true,
      targetRoles: ['head']
    });

    this.persistState();
    return true;
  }

  // Sign-off actions by Department Head
  approveSignoff(trainingId, notes = '') {
    const trn = this.state.trainings.find(t => t.id === trainingId);
    if (!trn) return false;

    trn.status = 'Completed';
    trn.completedDate = new Date().toISOString().split('T')[0];
    trn.signoffDate = new Date().toISOString().split('T')[0];
    trn.signedOffBy = this.getCurrentUser().name;
    trn.headNotes = notes;

    // Increment user completedCount
    const user = this.state.users.find(u => u.id === trn.userId);
    if (user) user.completedCount = (user.completedCount || 0) + 1;

    // Notify employee
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'approval',
      title: 'Training Sign-Off Approved',
      message: `HOD ${trn.signedOffBy} approved your completion proof for "${trn.title}". Certificate has been archived to your profile.`,
      unread: true,
      targetRoles: ['employee']
    });

    this.persistState();
    return true;
  }

  resubmitSignoff(trainingId, reason) {
    const trn = this.state.trainings.find(t => t.id === trainingId);
    if (!trn) return false;

    trn.status = 'Resubmit Requested';
    trn.resubmitReason = reason;

    // Notify employee
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'resubmit',
      title: 'Proof Resubmission Requested',
      message: `Your completion proof for "${trn.title}" requires revisions: "${reason}".`,
      unread: true,
      targetRoles: ['employee']
    });

    this.persistState();
    return true;
  }

  // Employee training request submission
  submitRequest({ applicantId, applicantName, departmentId, department, designation, headId, headName, trainingTitle, category, mode, justification, targetEmployees, type = 'Self' }) {
    const newReq = {
      id: `REQ-${new Date().getFullYear()}-${String(this.state.requests.length + 1).padStart(3, '0')}`,
      type,
      applicantId,
      applicantName,
      departmentId,
      department,
      designation,
      headId,
      headName,
      trainingTitle,
      category: category || 'Environmental Technologies',
      mode: mode || 'In-House Workshop',
      submittedDate: new Date().toISOString().split('T')[0],
      status: type === 'Team' ? 'Pending HR Approval' : 'Pending Head Review',
      isCommon: false,
      departmentOverlapCount: 1,
      targetEmployees: targetEmployees || null,
      justification: justification || 'Requested for capability enhancement.',
      rejectionReason: null,
      appealNote: null
    };

    // Calculate commonality tag
    const titleLower = trainingTitle.toLowerCase();
    const matches = this.state.requests.filter(r => r.trainingTitle.toLowerCase().includes(titleLower.substring(0, 8)));
    if (matches.length > 0) {
      newReq.isCommon = true;
      newReq.departmentOverlapCount = matches.length + 1;
      matches.forEach(m => { m.isCommon = true; m.departmentOverlapCount = matches.length + 1; });
    }

    this.state.requests.unshift(newReq);

    // Notify Head or HR
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'request_created',
      title: `New Training Request: ${type}`,
      message: `${applicantName} submitted request for "${trainingTitle}".`,
      unread: true,
      targetRoles: type === 'Team' ? ['hr'] : ['head']
    });

    this.persistState();
    return newReq;
  }

  // Escalate rejected or resubmit requested item to HR
  escalateRequest(requestId, appealNote) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return false;

    req.status = 'Escalated';
    req.appealNote = appealNote;
    req.escalatedAt = new Date().toISOString().split('T')[0];

    // Notify HR
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'appeal',
      title: 'Training Request Appeal Escalated to HR',
      message: `${req.applicantName} appealed rejection for "${req.trainingTitle}": "${appealNote.substring(0, 80)}..."`,
      unread: true,
      targetRoles: ['hr']
    });

    this.persistState();
    return true;
  }

  // Head or HR review on training requests
  approveRequest(requestId) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return false;

    req.status = 'Approved';
    req.approvedAt = new Date().toISOString().split('T')[0];
    req.approvedBy = this.getCurrentUser().name;

    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'approval',
      title: 'Training Request Approved',
      message: `Your training request for "${req.trainingTitle}" was approved by ${req.approvedBy}. Training will be scheduled in the allocation calendar.`,
      unread: true,
      targetRoles: ['employee', 'head']
    });

    this.persistState();
    return true;
  }

  rejectRequest(requestId, reason) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return false;

    req.status = 'Rejected';
    req.rejectionReason = reason;

    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'rejection',
      title: 'Training Request Rejected',
      message: `Training request "${req.trainingTitle}" was not approved. Reason: ${reason}`,
      unread: true,
      targetRoles: ['employee']
    });

    this.persistState();
    return true;
  }

  sendBackRequestForRevision(requestId, revisionNote) {
    const req = this.state.requests.find(r => r.id === requestId);
    if (!req) return false;

    req.status = 'Resubmit Requested';
    req.rejectionReason = revisionNote;

    this.persistState();
    return true;
  }

  bulkApproveCommonRequests(requestIds) {
    if (!Array.isArray(requestIds)) return 0;
    let count = 0;
    requestIds.forEach(id => {
      const req = this.state.requests.find(r => r.id === id);
      if (req && req.status !== 'Approved') {
        req.status = 'Approved';
        req.approvedAt = new Date().toISOString().split('T')[0];
        req.approvedBy = this.getCurrentUser().name;
        count++;
      }
    });

    if (count > 0) {
      this.state.notifications.unshift({
        id: `NOTIF-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'bulk_approved',
        title: `Batch Approval of ${count} Common Training Requests`,
        message: `Corporate HR completed batch approval for ${count} common training nominations across departments.`,
        unread: true,
        targetRoles: ['employee', 'head']
      });
      this.persistState();
    }
    return count;
  }

  // Monthly Training Cycle Controls
  toggleCycle() {
    this.state.cycle.isOpen = !this.state.cycle.isOpen;
    const action = this.state.cycle.isOpen ? 'opened' : 'closed';
    
    // Caption note: background notification job triggered
    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'cycle',
      title: `Training Cycle ${action.toUpperCase()}`,
      message: `The ${this.state.cycle.name} has been ${action} by Corporate HR. All Department Heads received notification to coordinate nominations.`,
      unread: true,
      targetRoles: ['employee', 'head', 'hr']
    });

    this.persistState();
    return this.state.cycle.isOpen;
  }

  sendDepartmentReminder(deptId) {
    const sub = this.state.cycle.departmentSubmissions.find(s => s.deptId === deptId);
    if (!sub) return false;

    const dept = this.state.departments.find(d => d.id === deptId);
    const headName = dept ? dept.headName : 'Department Head';

    this.state.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'reminder',
      title: `Reminder: Training Cycle Submission Deadline Approaching`,
      message: `Attention ${headName} (${sub.deptName}): Please submit your department's training request batch before the September 18 deadline.`,
      unread: true,
      targetRoles: ['head', 'hr']
    });

    this.persistState();
    return true;
  }

  // Calendar Event Creation & Employee Allocation (Task: event/workshops - Normalized assignedUserIds)
  createEvent({ title, category, mode, date, endDate, capacity, venue, instructor, hodApprovalRequired = false, reimbursementPercent = 100, assignedUserIds = [] }) {
    const newEvt = {
      id: `EVT-2026-${String(this.state.events.length + 1).padStart(2, '0')}`,
      title,
      category: category || 'Environmental Operations',
      mode: mode || 'In-House',
      date,
      endDate: endDate || date,
      capacity: parseInt(capacity, 10) || 20,
      venue: venue || 'UltraTech Training Center',
      instructor: instructor || 'Lead Specialist',
      hodApprovalRequired: mode === 'External' ? Boolean(hodApprovalRequired) : false,
      reimbursementPercent: mode === 'External' ? parseInt(reimbursementPercent, 10) : 100,
      assignedUserIds
    };

    this.state.events.unshift(newEvt);

    // If users assigned, create their upcoming training records
    const assignedUsers = this.state.users.filter(u => assignedUserIds.includes(u.id));
    assignedUsers.forEach(emp => {
      const exists = this.state.trainings.find(t => t.userId === emp.id && t.title === title);
      if (!exists) {
        this.state.trainings.unshift({
          id: `TRN-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          userId: emp.id,
          userName: emp.name,
          department: emp.department,
          title,
          category: newEvt.category,
          mode: `${newEvt.mode} Training`,
          scheduledDate: newEvt.date,
          endDate: newEvt.endDate,
          status: 'Upcoming',
          mandatory: true,
          provider: newEvt.instructor,
          venue: newEvt.venue,
          proof: null
        });
      }
    });

    this.persistState();
    return newEvt;
  }

  assignEmployeesToEvent(eventId, userIds) {
    const evt = this.state.events.find(e => e.id === eventId);
    if (!evt) return false;

    const newIds = Array.from(new Set([...evt.assignedUserIds, ...userIds]));
    evt.assignedUserIds = newIds;
    delete evt.assignedEmployees; // Remove legacy duplicate property if present

    // Update their trainings
    const assignedUsers = this.state.users.filter(u => newIds.includes(u.id));
    assignedUsers.forEach(emp => {
      const exists = this.state.trainings.find(t => t.userId === emp.id && t.title === evt.title);
      if (!exists) {
        this.state.trainings.unshift({
          id: `TRN-${Date.now()}-${Math.floor(Math.random()*1000)}`,
          userId: emp.id,
          userName: emp.name,
          department: emp.dept,
          title: evt.title,
          category: evt.category,
          mode: `${evt.mode} Training`,
          scheduledDate: evt.date,
          endDate: evt.endDate,
          status: 'Upcoming',
          mandatory: true,
          provider: evt.instructor,
          venue: evt.venue,
          proof: null
        });
      }
    });

    this.persistState();
    return true;
  }

  // Escalation Resolution by HR
  resolveEscalation(itemId, type, resolution, notes) {
    if (type === 'signoff') {
      const trn = this.state.trainings.find(t => t.id === itemId);
      if (!trn) return false;
      if (resolution === 'Approve') {
        trn.status = 'Completed';
        trn.completedDate = new Date().toISOString().split('T')[0];
        trn.signoffDate = new Date().toISOString().split('T')[0];
        trn.signedOffBy = `HR Overdue Sign-off (${this.getCurrentUser().name})`;
        trn.hrResolutionNotes = notes;
      } else {
        trn.status = 'Resubmit Requested';
        trn.resubmitReason = `HR Escalation Review: ${notes}`;
      }
    } else if (type === 'appeal') {
      const req = this.state.requests.find(r => r.id === itemId);
      if (!req) return false;
      if (resolution === 'Approve') {
        req.status = 'Approved';
        req.approvedAt = new Date().toISOString().split('T')[0];
        req.approvedBy = `HR Appeal Board (${this.getCurrentUser().name})`;
        req.hrResolutionNotes = notes;
      } else {
        req.status = 'Rejected';
        req.rejectionReason = `HR Appeal Rejected: ${notes}`;
      }
    }

    this.persistState();
    return true;
  }

  // Promotion & Award Shortlist
  flagForPromotion(userId, { category, notes }) {
    const user = this.state.users.find(u => u.id === userId);
    if (!user) return false;

    const newFlag = {
      id: `PRM-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      department: user.department,
      tenureYears: user.tenureYears,
      completedTrainings: user.completedCount || 0,
      flaggedBy: this.getCurrentUser().name,
      flaggedDate: new Date().toISOString().split('T')[0],
      category: category || 'Technical Specialist Track',
      notes: notes || 'Flagged based on consistent performance and training completion velocity.',
      status: 'Shortlisted'
    };

    this.state.promotionFlags.unshift(newFlag);
    this.persistState();
    return newFlag;
  }

  // Notifications
  markAllNotificationsRead() {
    this.state.notifications.forEach(n => n.unread = false);
    this.persistState();
  }

  markNotificationRead(id) {
    const n = this.state.notifications.find(item => item.id === id);
    if (n) {
      n.unread = false;
      this.persistState();
    }
  }

  getUnreadCount() {
    const user = this.getCurrentUser();
    return this.state.notifications.filter(n => n.unread && (n.targetRoles.includes(user.role) || n.targetRoles.includes('all'))).length;
  }
}

export const store = new Store();
