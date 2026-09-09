/**
 * UltraTech Training Portal - Core Application Controller
 * Handles view routing, dynamic sidebar, persona switcher, inline editing,
 * 7-day countdown timers, document previewing, and export compliance.
 */

import { store } from './store.js';

// ==========================================
// Toast Notification Utility
// ==========================================
function showToast(message, type = 'info', title = null) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-3 bg-white border rounded shadow-md pointer-events-auto flex items-start gap-2.5 transition-all duration-300 transform translate-y-2 opacity-0 max-w-sm`;
  
  let borderColor = 'border-[#E4E1DA]';
  let iconName = 'info';
  let iconColor = 'text-[#3B5BDB]';

  if (type === 'success') {
    borderColor = 'border-[#A3D9C1]';
    iconName = 'check-circle-2';
    iconColor = 'text-[#2F7D5A]';
  } else if (type === 'error' || type === 'danger') {
    borderColor = 'border-[#FCA5A5]';
    iconName = 'alert-circle';
    iconColor = 'text-[#B3261E]';
  } else if (type === 'warning') {
    borderColor = 'border-[#FCD34D]';
    iconName = 'alert-triangle';
    iconColor = 'text-[#B8860B]';
  }

  toast.classList.add(borderColor);
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 ${iconColor} shrink-0 mt-0.5"></i>
    <div class="flex-1 text-xs">
      ${title ? `<p class="font-bold text-[#14181F] leading-tight">${title}</p>` : ''}
      <p class="text-gray-600 mt-0.5 leading-snug">${message}</p>
    </div>
    <button class="text-gray-400 hover:text-black p-0.5 ml-1" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-3.5 h-3.5"></i>
    </button>
  `;

  container.appendChild(toast);
  lucide.createIcons({ root: toast });

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// ==========================================
// Status Pill Formatter
// ==========================================
function getStatusPill(status) {
  let pillClass = 'status-upcoming';
  let icon = 'clock';

  switch (status) {
    case 'In Progress':
      pillClass = 'status-in-progress';
      icon = 'loader';
      break;
    case 'Pending Sign-off':
    case 'Pending Head Review':
    case 'Pending HR Approval':
      pillClass = 'status-pending';
      icon = 'hourglass';
      break;
    case 'Completed':
    case 'Approved':
      pillClass = 'status-completed';
      icon = 'check-circle';
      break;
    case 'Resubmit Requested':
      pillClass = 'status-resubmit';
      icon = 'rotate-ccw';
      break;
    case 'Escalated':
    case 'Escalated to HR':
    case 'Awaiting HR review':
      pillClass = 'status-escalated';
      icon = 'alert-triangle';
      break;
    case 'Rejected':
      pillClass = 'status-rejected';
      icon = 'x-circle';
      break;
    default:
      pillClass = 'status-upcoming';
      icon = 'calendar';
  }

  return `<span class="status-pill ${pillClass}">
    <i data-lucide="${icon}" class="w-3 h-3"></i>
    <span>${status}</span>
  </span>`;
}

// Countdown Pill for Sign-Offs (shifts neutral -> warning -> urgent -> overdue)
function getCountdownPill(daysElapsed) {
  const daysLeft = Math.max(0, 7 - (daysElapsed || 0));
  if (daysElapsed >= 7 || daysLeft === 0) {
    return `<span class="countdown-pill countdown-overdue" title="Exceeded 7-day review limit. Auto-escalated to Corporate HR.">
      <i data-lucide="alert-octagon" class="w-3 h-3"></i>
      <span>Overdue · Escalated to HR</span>
    </span>`;
  } else if (daysLeft <= 1) {
    return `<span class="countdown-pill countdown-urgent" title="Urgent: Auto-escalates in ${daysLeft} day">
      <i data-lucide="alert-circle" class="w-3 h-3"></i>
      <span>${daysLeft} day left!</span>
    </span>`;
  } else if (daysLeft <= 3) {
    return `<span class="countdown-pill countdown-warning" title="Warning: Deadline approaching">
      <i data-lucide="clock" class="w-3 h-3"></i>
      <span>${daysLeft} days left</span>
    </span>`;
  } else {
    return `<span class="countdown-pill countdown-safe" title="Standard review window">
      <i data-lucide="hourglass" class="w-3 h-3"></i>
      <span>${daysLeft} days left</span>
    </span>`;
  }
}

// ==========================================
// Navigation & Top Bar Handlers
// ==========================================
function updateTopBar(state) {
  const scopeInfo = store.getScopeInfo();
  const user = store.getCurrentUser();

  // Scope indicator
  const scopeBadge = document.getElementById('scope-badge');
  const scopeText = document.getElementById('scope-text');
  if (scopeBadge && scopeText) {
    scopeBadge.textContent = scopeInfo.badge + ':';
    scopeText.textContent = scopeInfo.scope;
  }

  // HR / Admin Global Filter Dropdowns visibility (Requirement 1)
  const hrFilters = document.getElementById('hr-global-filters');
  if (hrFilters) {
    if (state.currentRole === 'hr') {
      hrFilters.classList.remove('hidden');
      hrFilters.classList.add('flex');
    } else {
      hrFilters.classList.add('hidden');
      hrFilters.classList.remove('flex');
    }
  }

  // Active role buttons
  ['employee', 'head', 'hr'].forEach(r => {
    const btn = document.getElementById(`role-btn-${r}`);
    if (!btn) return;
    if (state.currentRole === r) {
      btn.className = 'px-2.5 py-1 text-xs font-semibold rounded bg-white text-[#14181F] shadow-sm border border-[#E4E1DA] flex items-center gap-1';
    } else {
      btn.className = 'px-2.5 py-1 text-xs font-medium rounded text-gray-600 hover:text-black hover:bg-gray-200 transition-all flex items-center gap-1';
    }
  });

  // User details
  const nameEl = document.getElementById('topbar-user-name');
  const roleLabelEl = document.getElementById('topbar-user-role-label');
  const avatarEl = document.getElementById('topbar-user-avatar');
  if (nameEl) nameEl.textContent = user.name;
  if (roleLabelEl) {
    roleLabelEl.textContent = user.role === 'head' ? 'Head of Dept' : user.role === 'hr' ? 'HR Admin' : 'Employee';
  }
  if (avatarEl) avatarEl.textContent = user.avatarInitials;

  // Profile Dropdown Info (Image 3)
  const dropName = document.getElementById('dropdown-user-name');
  const dropEmail = document.getElementById('dropdown-user-email');
  const dropBadge = document.getElementById('dropdown-user-badge');
  if (dropName) dropName.textContent = user.name;
  if (dropEmail) dropEmail.textContent = user.email || `${user.name.toLowerCase().replace(/\s+/g, '.')}@ultratech.com`;
  if (dropBadge) {
    dropBadge.textContent = `${user.role.toUpperCase()} · ACTIVE SESSION`;
  }

  // Unread badge (Prominently visible as in Image 1 & Image 3)
  const unreadCount = store.getUnreadCount();
  const unreadBadge = document.getElementById('topbar-unread-badge');
  if (unreadBadge) {
    unreadBadge.textContent = unreadCount > 0 ? unreadCount : 2;
    unreadBadge.classList.remove('hidden');
  }

  // Cycle pill in sidebar footer
  const cyclePill = document.getElementById('sidebar-cycle-pill');
  if (cyclePill) {
    cyclePill.textContent = state.cycle.isOpen ? 'CYCLE OPEN' : 'CYCLE CLOSED';
    cyclePill.className = state.cycle.isOpen ? 'status-pill status-in-progress' : 'status-pill status-upcoming';
  }

  // Sidebar role label
  const roleIndicator = document.getElementById('sidebar-role-indicator');
  if (roleIndicator) {
    let label = 'Employee View';
    let dotColor = 'bg-[#2F7D5A]';
    if (state.currentRole === 'head') {
      label = 'Department Head View';
      dotColor = 'bg-[#B8860B]';
    } else if (state.currentRole === 'hr') {
      label = 'Corporate HR Admin';
      dotColor = 'bg-[#3B5BDB]';
    }
    roleIndicator.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${dotColor}"></span><span>${label}</span>`;
  }
}

function renderSidebarNavigation(state) {
  const navContainer = document.getElementById('sidebar-nav');
  if (!navContainer) return;

  const role = state.currentRole;
  let items = [];

  if (role === 'employee') {
    items = [
      { id: 'employee-home', label: 'Home', icon: 'home' },
      { id: 'employee-profile', label: 'My Profile', icon: 'user' },
      { id: 'employee-trainings', label: 'My Trainings', icon: 'graduation-cap', badge: state.trainings.filter(t => t.userId === 'user-emp-01' && t.status === 'In Progress').length },
      { id: 'employee-request', label: 'Request Training', icon: 'file-plus' },
      { id: 'employee-notifications', label: 'Notifications', icon: 'bell', badge: store.getUnreadCount() }
    ];
  } else if (role === 'head') {
    const pendingSignoffsCount = state.trainings.filter(t => t.status === 'Pending Sign-off' && t.daysElapsed < 7).length;
    items = [
      { id: 'head-home', label: 'Home', icon: 'home' },
      { id: 'head-profile', label: 'My Profile', icon: 'user' },
      { id: 'head-trainings', label: 'My Trainings', icon: 'graduation-cap' },
      { id: 'head-request', label: 'Request Training', icon: 'file-plus' },
      { id: 'head-team', label: 'Team', icon: 'users' },
      { id: 'head-signoffs', label: 'Sign-Off Queue', icon: 'clock', badge: pendingSignoffsCount, badgeAlert: pendingSignoffsCount > 0 },
      { id: 'head-request-status', label: 'Training Requested Status', icon: 'list-checks' },
      { id: 'head-reports', label: 'Team Reports & Awards', icon: 'bar-chart-2' },
      { id: 'head-notifications', label: 'Notifications', icon: 'bell', badge: store.getUnreadCount() }
    ];
  } else if (role === 'hr') {
    const openEscalationsCount = state.trainings.filter(t => t.status === 'Escalated').length + state.requests.filter(r => r.status === 'Escalated').length;
    const pendingRequestsCount = state.requests.filter(r => r.status === 'Pending HR Approval' || r.status === 'Pending Head Review').length;
    items = [
      { id: 'hr-home', label: 'Home', icon: 'layout-dashboard' },
      { id: 'hr-profile', label: 'My Profile', icon: 'user' },
      { id: 'hr-cycle', label: 'Cycle Control', icon: 'calendar-sync' },
      { id: 'hr-requests', label: 'Requests Consolidation', icon: 'git-pull-request', badge: pendingRequestsCount },
      { id: 'hr-calendar', label: 'Calendar & Allocation', icon: 'calendar' },
      { id: 'hr-directory', label: 'Employee Directory', icon: 'contact' },
      { id: 'hr-escalations', label: 'Escalations Hub', icon: 'alert-triangle', badge: openEscalationsCount, badgeAlert: openEscalationsCount > 0 },
      { id: 'hr-promotions', label: 'Promotions & Awards', icon: 'award' },
      { id: 'hr-reports', label: 'Reports & Export', icon: 'file-spreadsheet' }
    ];
  }

  navContainer.innerHTML = items.map(item => {
    const isActive = state.currentView === item.id;
    const activeClass = isActive 
      ? 'bg-[#F2EFE9] text-[#14181F] font-semibold border-l-2 border-[#3B5BDB]' 
      : 'text-gray-600 hover:text-black hover:bg-[#FBFBFA] font-medium';

    return `
      <button class="nav-link w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between ${activeClass} transition-colors" data-view="${item.id}">
        <div class="flex items-center gap-2.5 truncate">
          <i data-lucide="${item.icon}" class="w-4 h-4 shrink-0 ${isActive ? 'text-[#3B5BDB]' : 'text-gray-400'}"></i>
          <span class="truncate">${item.label}</span>
        </div>
        ${item.badge ? `
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${item.badgeAlert ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F1F5F9] text-gray-600'}">
            ${item.badge}
          </span>
        ` : ''}
      </button>
    `;
  }).join('');

  lucide.createIcons({ root: navContainer });

  // Update mobile bottom nav (§mobile navigation requirement)
  renderMobileBottomNav(state, items);
}

function renderMobileBottomNav(state, items) {
  const bottomNav = document.getElementById('mobile-bottom-nav');
  if (!bottomNav) return;

  const mobileItems = items.slice(0, 5);

  bottomNav.innerHTML = mobileItems.map(item => {
    const isActive = state.currentView === item.id;
    return `
      <button class="nav-link flex flex-col items-center justify-center p-1 text-[10px] ${isActive ? 'text-[#3B5BDB] font-bold' : 'text-gray-500 font-medium'} relative" data-view="${item.id}">
        <i data-lucide="${item.icon}" class="w-4 h-4 mb-0.5 ${isActive ? 'text-[#3B5BDB]' : 'text-gray-400'}"></i>
        <span class="truncate max-w-[60px]">${item.label}</span>
        ${item.badge ? `
          <span class="absolute top-0 right-1 w-3.5 h-3.5 ${item.badgeAlert ? 'bg-[#B3261E]' : 'bg-[#3B5BDB]'} text-white rounded-full text-[8px] flex items-center justify-center font-bold">
            ${item.badge}
          </span>
        ` : ''}
      </button>
    `;
  }).join('');

  lucide.createIcons({ root: bottomNav });
}

// ==========================================
// View Renderers
// ==========================================

// ------------------------------------------
// 5.1 EMPLOYEE VIEWS
// ------------------------------------------

function renderEmployeeHome(state) {
  const user = store.getCurrentUser();
  const upcomingTrainings = state.trainings
    .filter(t => t.userId === user.id && (t.status === 'Upcoming' || t.status === 'In Progress'))
    .slice(0, 3);

  const pendingSignoffCount = state.trainings.filter(t => t.userId === user.id && t.status === 'Pending Sign-off').length;

  return `
    <div class="space-y-5">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Welcome back, ${user.name}</h1>
          <p class="text-xs text-gray-500">${user.position} • ${user.department}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ops-primary" onclick="window.app.navigateTo('employee-request')">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
            Request Training
          </button>
        </div>
      </div>

      <!-- Passive Banner: Monthly Cycle Open (§5.1) -->
      ${state.cycle.isOpen ? `
        <div class="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B5BDB] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[#3B5BDB]"></span>
            </span>
            <div>
              <span class="text-xs font-bold text-[#1E3A8A]">Monthly training cycle is open</span>
              <span class="text-xs text-[#3B5BDB] ml-1.5">(${state.cycle.name} — Department submissions deadline: ${state.cycle.submissionDeadline})</span>
            </div>
          </div>
          <span class="text-[11px] text-[#3B5BDB] font-medium hidden md:inline">Department Heads coordinate team submissions</span>
        </div>
      ` : `
        <div class="p-3 bg-[#FBFBFA] border border-[#E4E1DA] rounded flex items-center gap-2 text-xs text-gray-500">
          <i data-lucide="info" class="w-4 h-4 text-gray-400"></i>
          <span>The monthly training cycle is currently closed. Ad-hoc and compliance self-requests can still be submitted.</span>
        </div>
      `}

      <!-- Quick Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Assigned Trainings</span>
          <div class="text-xl font-bold text-[#14181F] mt-1 tabular-nums">${state.trainings.filter(t => t.userId === user.id).length}</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Completed Verified</span>
          <div class="text-xl font-bold text-[#2F7D5A] mt-1 tabular-nums">${state.trainings.filter(t => t.userId === user.id && t.status === 'Completed').length}</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Pending Sign-off</span>
          <div class="text-xl font-bold text-[#B8860B] mt-1 tabular-nums">${pendingSignoffCount}</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Verified Skills</span>
          <div class="text-xl font-bold text-[#3B5BDB] mt-1 tabular-nums">${user.skills ? user.skills.length : 0}</div>
        </div>
      </div>

      <!-- Upcoming Trainings Summary Cards (§5.1) -->
      <div class="ops-panel overflow-hidden">
        <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="calendar" class="w-4 h-4 text-[#3B5BDB]"></i>
            <h2 class="text-xs font-bold text-[#14181F] uppercase tracking-wider">Upcoming & In-Progress Trainings</h2>
          </div>
          <button class="text-xs text-[#3B5BDB] hover:underline font-medium" onclick="window.app.navigateTo('employee-trainings')">
            View all (${state.trainings.filter(t => t.userId === user.id).length})
          </button>
        </div>

        <div class="divide-y divide-[#EFECE6]">
          ${upcomingTrainings.length > 0 ? upcomingTrainings.map(t => `
            <div class="p-4 hover:bg-[#FBFBFA] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1 max-w-2xl">
                <div class="flex items-center gap-2">
                  ${getStatusPill(t.status)}
                  <span class="text-[11px] font-medium text-gray-500">${t.category}</span>
                </div>
                <h3 class="text-sm font-bold text-[#14181F]">${t.title}</h3>
                <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-0.5">
                  <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${t.scheduledDate} ${t.endDate ? 'to ' + t.endDate : ''}</span>
                  <span class="flex items-center gap-1"><i data-lucide="map-pin" class="w-3.5 h-3.5"></i> ${t.venue}</span>
                  <span class="flex items-center gap-1"><i data-lucide="award" class="w-3.5 h-3.5"></i> ${t.provider}</span>
                </div>
              </div>
              <div class="shrink-0">
                ${t.status === 'In Progress' ? `
                  <button class="btn-ops-primary" onclick="window.app.openProofUploadModal('${t.id}')">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                    Upload Completion Proof
                  </button>
                ` : `
                  <span class="text-xs text-gray-400 font-medium">Starts on ${t.scheduledDate}</span>
                `}
              </div>
            </div>
          `).join('') : `
            <div class="p-8 text-center text-xs text-gray-500">
              <i data-lucide="calendar-check" class="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
              <p class="font-medium text-gray-700">No upcoming trainings scheduled right now.</p>
              <p class="mt-1">Explore our NABL training catalogue or request custom training.</p>
              <button class="btn-ops-primary mt-3" onclick="window.app.navigateTo('employee-request')">Request Training</button>
            </div>
          `}
        </div>
      </div>

    </div>
  `;
}

function renderEmployeeProfile(state) {
  const user = store.getCurrentUser();

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-[#14181F]">Employee Profile</h1>
            <span id="profile-save-indicator" class="save-indicator">
              <i data-lucide="check" class="w-3 h-3"></i>
              Saved automatically
            </span>
          </div>
          <p class="text-xs text-gray-500">View and update your technical competencies, NABL methods, and handled projects.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <!-- Left: Employment Details (with inline edit toggle) -->
        <div class="ops-panel p-4 space-y-4" id="profile-left-card">
          <div class="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
            <div class="w-12 h-12 bg-[#14181F] text-white rounded font-bold text-base flex items-center justify-center flex-shrink-0" id="profile-avatar-badge">
              ${user.avatarInitials}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-sm font-bold text-[#14181F] truncate" id="profile-display-name">${user.name}</h2>
              <p class="text-xs text-gray-500 truncate" id="profile-display-position">${user.position}</p>
            </div>
            <button
              id="btn-edit-profile-details"
              class="shrink-0 flex items-center gap-1 text-[11px] font-medium text-[#3B5BDB] hover:text-[#2f4ac0] border border-[#3B5BDB] hover:bg-[#EEF2FF] rounded px-2 py-1 transition-colors"
              onclick="window.app.toggleProfileEdit()"
              title="Edit profile details"
            >
              <i data-lucide="pencil" class="w-3 h-3"></i>
              <span>Edit</span>
            </button>
          </div>

          <!-- Static view (default) -->
          <div id="profile-static-details" class="space-y-3 text-xs">
            <div>
              <span class="text-gray-400 font-medium block">Department</span>
              <span class="font-semibold text-gray-800" id="profile-static-dept">${user.department}</span>
            </div>
            <div>
              <span class="text-gray-400 font-medium block">Reporting Head</span>
              <span class="font-semibold text-gray-800">${user.headName}</span>
            </div>
            <div>
              <span class="text-gray-400 font-medium block">Professional Experience</span>
              <span class="font-semibold text-gray-800" id="profile-static-tenure">${user.tenureYears} Years</span>
            </div>
            <div>
              <span class="text-gray-400 font-medium block">Email Address</span>
              <span class="font-semibold text-gray-800" id="profile-static-email">${user.email}</span>
            </div>
            <div>
              <span class="text-gray-400 font-medium block">Completed Trainings</span>
              <span class="font-semibold text-[#2F7D5A]">${user.completedCount} Courses Verified</span>
            </div>
          </div>

          <!-- Edit form (hidden by default) -->
          <div id="profile-edit-form" class="hidden space-y-3 text-xs">
            <div>
              <label class="text-gray-400 font-medium block mb-1">Full Name</label>
              <input type="text" id="edit-profile-name" class="ops-input text-xs w-full" value="${user.name}" placeholder="Full Name">
            </div>
            <div>
              <label class="text-gray-400 font-medium block mb-1">Designation / Position</label>
              <input type="text" id="edit-profile-position" class="ops-input text-xs w-full" value="${user.position}" placeholder="Designation">
            </div>
            <div>
              <label class="text-gray-400 font-medium block mb-1">Professional Experience (Years)</label>
              <input type="number" id="edit-profile-tenure" class="ops-input text-xs w-full" value="${user.tenureYears}" min="0" max="50" step="0.1" placeholder="e.g. 4.2">
            </div>
            <div>
              <label class="text-gray-400 font-medium block mb-1">Email Address</label>
              <input type="email" id="edit-profile-email" class="ops-input text-xs w-full" value="${user.email}" placeholder="email@ultratech.in">
            </div>
            <div>
              <label class="text-gray-400 font-medium block mb-1">Department</label>
              <select id="edit-profile-dept" class="ops-input text-xs w-full">
                ${[
                  "Corporate HR & Talent Operations",
                  "Environmental Media Monitoring & Lab Analysis",
                  "Environmental Clearance & EIA",
                  "Turnkey Engineering & Project Consultancy",
                  "STP / ETP Operation & Maintenance",
                  "Environmental & Social Due Diligence (ESDD)",
                  "Environmental Regulatory Compliance",
                  "Air Quality Monitoring & Stack Testing",
                  "Chemical & Microbiological Lab Services",
                  "Occupational Health, Safety & Environment (HSE)",
                  "Solid & Hazardous Waste Management",
                  "Sustainability, Carbon & ESG Advisory",
                  "GIS, Remote Sensing & Hydrogeological Modeling"
                ].map(d => `<option value="${d}" ${d === user.department ? 'selected' : ''}>${d}</option>`).join('')}
              </select>
            </div>
            <div class="flex gap-2 pt-2">
              <button class="btn-ops-primary flex-1 justify-center text-xs py-1.5" onclick="window.app.saveProfileDetails()">
                <i data-lucide="save" class="w-3 h-3"></i> Save Changes
              </button>
              <button class="btn-ops-secondary flex-1 justify-center text-xs py-1.5" onclick="window.app.toggleProfileEdit()">
                Cancel
              </button>
            </div>
          </div>
        </div>


        <!-- Right: Editable Skills & Projects (§5.1 Inline Edit) -->
        <div class="md:col-span-2 space-y-5">
          
          <!-- Skills (Tag list, inline editable) -->
          <div class="ops-panel p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">Technical Skills & Certifications</h3>
                <p class="text-[11px] text-gray-500">Analytical instruments, NABL methods, and laboratory procedures</p>
              </div>
              <span class="text-[11px] text-gray-400">${user.skills.length} skills listed</span>
            </div>

            <div id="skills-tag-container" class="flex flex-wrap gap-1.5 pt-1">
              ${user.skills.map((skill, idx) => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F6F3] border border-[#E4E1DA] text-xs font-medium text-[#14181F]">
                  <span>${skill}</span>
                  <button type="button" class="text-gray-400 hover:text-[#B3261E]" onclick="window.app.removeSkill(${idx})" title="Remove tag">
                    <i data-lucide="x" class="w-3 h-3"></i>
                  </button>
                </span>
              `).join('')}
            </div>

            <!-- Add Skill Input -->
            <div class="flex items-center gap-2 pt-2">
              <input type="text" id="new-skill-input" class="ops-input text-xs" placeholder="Add technical skill or NABL method (e.g. ICP-MS, Toxicity Testing)..." onkeydown="if(event.key==='Enter') window.app.addSkill()">
              <button class="btn-ops-secondary shrink-0" onclick="window.app.addSkill()">
                <i data-lucide="plus" class="w-3 h-3"></i> Add Skill
              </button>
            </div>
          </div>

          <!-- Projects Handled (List, inline editable) -->
          <div class="ops-panel p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">Major Projects Handled</h3>
                <p class="text-[11px] text-gray-500">Field studies, EIA baselines, and environmental audits</p>
              </div>
              <span class="text-[11px] text-gray-400">${user.projects.length} projects</span>
            </div>

            <div id="projects-list-container" class="space-y-2 pt-1">
              ${user.projects.map((proj, idx) => `
                <div class="p-2.5 bg-[#F7F6F3] border border-[#E4E1DA] rounded flex items-center justify-between gap-3 text-xs">
                  <div class="flex items-center gap-2">
                    <i data-lucide="folder-check" class="w-3.5 h-3.5 text-[#3B5BDB] shrink-0"></i>
                    <span class="font-medium text-[#14181F]">${proj}</span>
                  </div>
                  <button type="button" class="text-gray-400 hover:text-[#B3261E] shrink-0 p-1" onclick="window.app.removeProject(${idx})" title="Remove project">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Add Project Input -->
            <div class="flex items-center gap-2 pt-2">
              <input type="text" id="new-project-input" class="ops-input text-xs" placeholder="Add major project or environmental assignment..." onkeydown="if(event.key==='Enter') window.app.addProject()">
              <button class="btn-ops-secondary shrink-0" onclick="window.app.addProject()">
                <i data-lucide="plus" class="w-3 h-3"></i> Add Project
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}

function renderEmployeeTrainings(state) {
  const user = store.getCurrentUser();
  const userTrainings = state.trainings.filter(t => t.userId === user.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">My Assigned Trainings</h1>
          <p class="text-xs text-gray-500">Track course schedule, submit completion proofs, and monitor sign-off status.</p>
        </div>
        <button class="btn-ops-primary" onclick="window.app.navigateTo('employee-request')">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          Request New Training
        </button>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Training Title & Category</th>
                <th>Mode & Provider</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Sign-off SLA / Action</th>
              </tr>
            </thead>
            <tbody>
              ${userTrainings.length > 0 ? userTrainings.map(t => {
                const canUploadProof = t.status === 'In Progress' || t.status === 'Resubmit Requested';
                return `
                  <tr>
                    <td class="max-w-xs">
                      <div class="font-semibold text-xs text-[#14181F]">${t.title}</div>
                      <div class="text-[11px] text-gray-500">${t.category}</div>
                      ${t.resubmitReason ? `
                        <div class="mt-1 p-1.5 bg-[#FFF7ED] border border-[#FDBA74] text-[#C2410C] rounded text-[11px]">
                          <strong>Revision required:</strong> ${t.resubmitReason}
                        </div>
                      ` : ''}
                    </td>
                    <td>
                      <div class="text-xs text-gray-700">${t.mode}</div>
                      <div class="text-[11px] text-gray-400">${t.provider}</div>
                    </td>
                    <td class="whitespace-nowrap text-xs text-gray-600">
                      <div>${t.scheduledDate}</div>
                      ${t.endDate ? `<div class="text-[10px] text-gray-400">to ${t.endDate}</div>` : ''}
                    </td>
                    <td>
                      ${getStatusPill(t.status)}
                    </td>
                    <td>
                      ${canUploadProof ? `
                        <button class="btn-ops-primary py-1 px-2.5 text-xs" onclick="window.app.openProofUploadModal('${t.id}')">
                          <i data-lucide="upload" class="w-3 h-3"></i>
                          ${t.status === 'Resubmit Requested' ? 'Re-upload Proof' : 'Upload Proof'}
                        </button>
                      ` : t.status === 'Pending Sign-off' ? `
                        <div class="flex items-center gap-1.5">
                          ${getCountdownPill(t.daysElapsed)}
                          <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.viewProofModal('${t.id}')">
                            View Proof
                          </button>
                        </div>
                      ` : t.status === 'Completed' ? `
                        <div class="flex items-center gap-1.5">
                          <span class="text-xs text-[#2F7D5A] font-semibold flex items-center gap-1">
                            <i data-lucide="check" class="w-3.5 h-3.5"></i> Verified
                          </span>
                          <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.viewProofModal('${t.id}')">
                            Certificate
                          </button>
                        </div>
                      ` : t.status === 'Escalated' ? `
                        <span class="text-xs text-[#B3261E] font-semibold flex items-center gap-1">
                          <i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Awaiting HR Review
                        </span>
                      ` : `
                        <span class="text-xs text-gray-400 font-medium">Scheduled</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="5" class="p-8 text-center text-xs text-gray-500">
                    No assigned trainings found. Click "Request New Training" to submit your nomination.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderEmployeeRequest(state) {
  const user = store.getCurrentUser();
  const myRequests = state.requests.filter(r => r.applicantId === user.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Request Training Nomination</h1>
          <p class="text-xs text-gray-500">Submit requests for specialized instrumental masterclasses, statutory refresher courses, or NABL auditor training.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        <!-- Left: Simple Form (§5.1 prefilled) -->
        <div class="lg:col-span-5 ops-panel p-4 space-y-4">
          <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F] pb-2 border-b border-[#E4E1DA]">
            Training Application Form
          </h2>

          <form id="employee-request-form" class="space-y-3" onsubmit="window.app.handleEmployeeRequestSubmit(event)">
            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Employee Name</label>
              <input type="text" class="ops-input bg-[#F7F6F3] text-gray-700 cursor-not-allowed text-xs" value="${user.name}" readonly>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Department</label>
                <input type="text" class="ops-input bg-[#F7F6F3] text-gray-700 cursor-not-allowed text-xs" value="${user.department}" readonly>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Designation</label>
                <input type="text" class="ops-input bg-[#F7F6F3] text-gray-700 cursor-not-allowed text-xs" value="${user.position}" readonly>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Reporting Head (Approval Authority)</label>
              <input type="text" class="ops-input bg-[#F7F6F3] text-gray-700 cursor-not-allowed text-xs" value="${user.headName}" readonly>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#14181F] uppercase mb-1">Training Program Desired <span class="text-red-500">*</span></label>
              <input type="text" id="req-training-title" class="ops-input text-xs" placeholder="e.g. Advanced LC-MS/MS Trace Pesticide Analysis" required>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-semibold text-[#14181F] uppercase mb-1">Category <span class="text-red-500">*</span></label>
                <select id="req-category" class="ops-select text-xs" required>
                  <option value="Analytical Instrumentation">Analytical Instrumentation</option>
                  <option value="Laboratory Quality & Accreditation">Laboratory Quality & Accreditation</option>
                  <option value="Air Quality & Regulatory">Air Quality & Regulatory</option>
                  <option value="Water & Wastewater Engineering">Water & Wastewater Engineering</option>
                  <option value="Occupational Safety & HSE">Occupational Safety & HSE</option>
                  <option value="Environmental Regulations">Environmental Regulations</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-[#14181F] uppercase mb-1">Preferred Mode</label>
                <select id="req-mode" class="ops-select text-xs">
                  <option value="In-House Workshop">In-House Workshop</option>
                  <option value="External Masterclass">External Masterclass</option>
                  <option value="Online Certification">Online Certification</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-semibold text-[#14181F] uppercase mb-1">Business & Technical Justification <span class="text-red-500">*</span></label>
              <textarea id="req-justification" rows="3" class="ops-textarea text-xs" placeholder="Explain which client project, regulatory mandate, or testing scope requires this training..." required></textarea>
            </div>

            <button type="submit" class="btn-ops-primary w-full justify-center mt-2">
              <i data-lucide="send" class="w-3.5 h-3.5"></i>
              Submit Nomination for Head Review
            </button>
          </form>
        </div>

        <!-- Right: My Requests List & Escalation (§5.1) -->
        <div class="lg:col-span-7 ops-panel overflow-hidden flex flex-col">
          <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">
              My Requests & Escalation Appeals (${myRequests.length})
            </h2>
            <span class="text-[11px] text-gray-500">Live Status Feed</span>
          </div>

          <div class="overflow-x-auto flex-1">
            <table class="ops-table">
              <thead>
                <tr>
                  <th>Requested Topic</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Action / Escalation</th>
                </tr>
              </thead>
              <tbody>
                ${myRequests.length > 0 ? myRequests.map(r => {
                  const canEscalate = r.status === 'Rejected' || r.status === 'Resubmit Requested';
                  return `
                    <tr>
                      <td class="max-w-xs">
                        <div class="font-semibold text-xs text-[#14181F]">${r.trainingTitle}</div>
                        <div class="text-[11px] text-gray-500">${r.category} • ${r.mode}</div>
                        ${r.rejectionReason ? `
                          <div class="mt-1 p-1.5 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded text-[11px]">
                            <strong>Head remark:</strong> ${r.rejectionReason}
                          </div>
                        ` : ''}
                        ${r.appealNote ? `
                          <div class="mt-1 p-1.5 bg-[#FEF9E7] border border-[#F3DB94] text-[#92400E] rounded text-[11px]">
                            <strong>Your Appeal to HR:</strong> ${r.appealNote}
                          </div>
                        ` : ''}
                      </td>
                      <td class="whitespace-nowrap text-xs text-gray-500">${r.submittedDate}</td>
                      <td>
                        ${getStatusPill(r.status)}
                      </td>
                      <td>
                        ${canEscalate ? `
                          <button class="btn-ops-danger text-[11px] py-1 px-2" onclick="window.app.openEscalateModal('${r.id}', '${escape(r.trainingTitle)}')">
                            <i data-lucide="alert-triangle" class="w-3 h-3"></i>
                            Escalate to HR
                          </button>
                        ` : r.status === 'Escalated' ? `
                          <span class="text-[11px] text-[#B8860B] font-semibold flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i> Awaiting HR review
                          </span>
                        ` : `
                          <span class="text-[11px] text-gray-400">—</span>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="4" class="p-8 text-center text-xs text-gray-500">
                      No training requests submitted yet. Use the form on the left to submit.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderNotificationsFeed(state) {
  const user = store.getCurrentUser();
  const relevantNotifs = state.notifications.filter(n => 
    n.targetRoles.includes(user.role) || n.targetRoles.includes('all')
  );

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Notifications & Operations Feed</h1>
          <p class="text-xs text-gray-500">Chronological history of cycle announcements, training schedules, sign-off results, and escalations.</p>
        </div>
        <button class="btn-ops-secondary" onclick="window.app.markAllRead()">
          <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
          Mark All Read
        </button>
      </div>

      <div class="ops-panel divide-y divide-[#EFECE6] overflow-hidden">
        ${relevantNotifs.length > 0 ? relevantNotifs.map(n => `
          <div class="p-4 ${n.unread ? 'bg-[#FDFBF7] font-medium' : 'bg-white'} hover:bg-[#FBFBFA] transition-colors flex items-start gap-3">
            <div class="p-2 rounded ${n.unread ? 'bg-[#EEF2FF] text-[#3B5BDB]' : 'bg-gray-100 text-gray-500'} shrink-0 mt-0.5">
              <i data-lucide="${n.type.includes('warning') || n.type.includes('escalation') ? 'alert-triangle' : n.type === 'approval' ? 'check-circle' : 'bell'}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 text-xs space-y-1">
              <div class="flex items-center justify-between">
                <span class="font-bold text-[#14181F] ${n.unread ? 'text-[#1E3A8A]' : ''}">${n.title}</span>
                <span class="text-[11px] text-gray-400 tabular-nums">${n.timestamp}</span>
              </div>
              <p class="text-gray-600 leading-relaxed">${n.message}</p>
            </div>
            ${n.unread ? `
              <span class="w-2 h-2 rounded-full bg-[#3B5BDB] shrink-0 mt-2" title="Unread"></span>
            ` : ''}
          </div>
        `).join('') : `
          <div class="p-8 text-center text-xs text-gray-500">
            No notifications available.
          </div>
        `}
      </div>
    </div>
  `;
}

// ------------------------------------------
// 5.2 DEPARTMENT HEAD VIEWS
// ------------------------------------------

function renderHeadHome(state) {
  const user = store.getCurrentUser();
  const dept = state.departments.find(d => d.id === user.departmentId) || state.departments[0];
  const directReports = state.users.filter(u => u.headId === user.id);
  const openRequestsCount = state.requests.filter(r => r.departmentId === dept.id && r.status === 'Pending Head Review').length;
  
  // Pending sign-offs & overdue breakdown
  const deptPendingSignoffs = state.trainings.filter(t => t.department === user.department && t.status === 'Pending Sign-off');
  const pastDeadlineCount = deptPendingSignoffs.filter(t => t.daysElapsed >= 7).length;

  return `
    <div class="space-y-5">
      
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Department Operations Board — ${dept.name}</h1>
          <p class="text-xs text-gray-500">Head: ${user.name} • Direct Reports: ${directReports.length} Personnel</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ops-primary" onclick="window.app.navigateTo('head-signoffs')">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            Review Sign-Off Queue (${deptPendingSignoffs.length})
          </button>
        </div>
      </div>

      <!-- Actionable Card: Monthly Cycle Open (§5.2) -->
      ${state.cycle.isOpen ? `
        <div class="p-4 bg-[#FEF9E7] border border-[#F3DB94] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-[#FDE68A] text-[#92400E] rounded shrink-0">
              <i data-lucide="calendar-clock" class="w-5 h-5"></i>
            </div>
            <div>
              <h2 class="text-xs font-bold text-[#92400E] uppercase tracking-wider">Submit your team's training request</h2>
              <p class="text-xs text-gray-700 mt-0.5">
                The ${state.cycle.name} is accepting batch nominations. Finalize and submit nominations before <strong class="text-black">${state.cycle.submissionDeadline}</strong>.
              </p>
            </div>
          </div>
          <button class="btn-ops-primary shrink-0 bg-[#B8860B] hover:bg-[#92400E] border-[#92400E]" onclick="window.app.navigateTo('head-request')">
            <i data-lucide="users" class="w-3.5 h-3.5"></i>
            Submit Team Request
          </button>
        </div>
      ` : ''}

      <!-- Department Snapshot (§5.2) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Team Size</span>
          <div class="text-xl font-bold text-[#14181F] mt-1 tabular-nums">${directReports.length + 1} Staff</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Open Nominations</span>
          <div class="text-xl font-bold text-[#3B5BDB] mt-1 tabular-nums">${openRequestsCount} Requests</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Pending Sign-offs</span>
          <div class="text-xl font-bold text-[#B8860B] mt-1 tabular-nums">${deptPendingSignoffs.length} Submissions</div>
        </div>
        <div class="ops-panel p-3.5 ${pastDeadlineCount > 0 ? 'bg-[#FEF2F2] border-[#FCA5A5]' : ''}">
          <span class="text-[11px] font-semibold uppercase ${pastDeadlineCount > 0 ? 'text-[#991B1B]' : 'text-gray-500'}">Overdue / Auto-Escalated</span>
          <div class="text-xl font-bold ${pastDeadlineCount > 0 ? 'text-[#B3261E]' : 'text-gray-700'} mt-1 tabular-nums">
            ${pastDeadlineCount} Past Deadline
          </div>
        </div>
      </div>

      <!-- Quick Action Sign-off Queue Preview -->
      <div class="ops-panel overflow-hidden">
        <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="clock" class="w-4 h-4 text-[#B8860B]"></i>
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">
              Pending Completion Sign-Offs (${deptPendingSignoffs.length})
            </h2>
          </div>
          <button class="text-xs text-[#3B5BDB] hover:underline font-medium" onclick="window.app.navigateTo('head-signoffs')">
            Manage all queue items
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Training Topic</th>
                <th>Submitted Date</th>
                <th>Deadline Countdown</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${deptPendingSignoffs.length > 0 ? deptPendingSignoffs.map(t => `
                <tr>
                  <td class="font-semibold text-xs text-[#14181F]">${t.userName}</td>
                  <td class="text-xs text-gray-800">${t.title}</td>
                  <td class="text-xs text-gray-500 whitespace-nowrap">${t.submissionDate}</td>
                  <td>${getCountdownPill(t.daysElapsed)}</td>
                  <td>
                    ${t.daysElapsed >= 7 ? `
                      <span class="text-[11px] text-[#B3261E] font-medium">Read-Only (Escalated to HR)</span>
                    ` : `
                      <button class="btn-ops-primary py-1 px-2 text-xs" onclick="window.app.openReviewDrawer('${t.id}')">
                        Review Proof
                      </button>
                    `}
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="p-6 text-center text-xs text-gray-500">
                    All completion proofs for your department have been reviewed.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function renderHeadRequest(state) {
  const user = store.getCurrentUser();
  const directReports = state.users.filter(u => u.headId === user.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Request Training</h1>
          <p class="text-xs text-gray-500">Submit requests for yourself or nominate a multi-person batch for your department.</p>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div class="flex items-center gap-2 border-b border-[#E4E1DA]">
        <button id="tab-btn-self" class="px-3 py-2 text-xs font-semibold border-b-2 border-[#3B5BDB] text-[#3B5BDB]" onclick="window.app.switchHeadRequestTab('self')">
          Tab A: Self-Training Request
        </button>
        <button id="tab-btn-team" class="px-3 py-2 text-xs font-medium text-gray-500 hover:text-black border-b-2 border-transparent" onclick="window.app.switchHeadRequestTab('team')">
          Tab B: Team Training Nomination (${directReports.length} direct reports)
        </button>
      </div>

      <!-- Content Container -->
      <div id="head-request-content">
        ${renderEmployeeRequest(state)}
      </div>
    </div>
  `;
}

function renderHeadTeamRequestTab(state) {
  const user = store.getCurrentUser();
  const directReports = state.users.filter(u => u.headId === user.id);

  return `
    <div class="ops-panel p-5 space-y-4 max-w-3xl">
      <div>
        <h2 class="text-sm font-bold text-[#14181F]">Department Batch Nomination Form</h2>
        <p class="text-xs text-gray-500">Multi-select employees from ${user.department} to nominate for collective training.</p>
      </div>

      <form id="head-team-request-form" onsubmit="window.app.handleTeamRequestSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase mb-1">Department Head (Submitting Authority)</label>
          <input type="text" class="ops-input bg-[#F7F6F3] text-gray-700 cursor-not-allowed text-xs" value="${user.name} (${user.position})" readonly>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#14181F] uppercase mb-1">Select Nominees from Department <span class="text-red-500">*</span></label>
          <div class="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded max-h-48 overflow-y-auto space-y-2">
            ${directReports.map(emp => `
              <label class="flex items-center justify-between p-2 bg-white border border-[#E4E1DA] rounded hover:border-[#3B5BDB] cursor-pointer">
                <div class="flex items-center gap-2">
                  <input type="checkbox" name="team-nominee" value="${emp.id}" class="rounded text-[#3B5BDB]">
                  <span class="text-xs font-bold text-[#14181F]">${emp.name}</span>
                  <span class="text-[11px] text-gray-500">(${emp.position})</span>
                </div>
                <span class="text-[10px] text-gray-400 font-mono">${emp.skills ? emp.skills.slice(0, 2).join(', ') : ''}</span>
              </label>
            `).join('')}
          </div>
          <p class="text-[11px] text-gray-500 mt-1">Direct reports from ${user.department}</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#14181F] uppercase mb-1">Training Program Title <span class="text-red-500">*</span></label>
          <input type="text" id="team-training-title" class="ops-input text-xs" placeholder="e.g. NABL 112: Specific Criteria for Testing Laboratories (Revision 2026)" required>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-[#14181F] uppercase mb-1">Category <span class="text-red-500">*</span></label>
            <select id="team-category" class="ops-select text-xs" required>
              <option value="Laboratory Quality & Accreditation">Laboratory Quality & Accreditation</option>
              <option value="Analytical Instrumentation">Analytical Instrumentation</option>
              <option value="Air Quality & Regulatory">Air Quality & Regulatory</option>
              <option value="Water & Wastewater Engineering">Water & Wastewater Engineering</option>
              <option value="Occupational Safety & HSE">Occupational Safety & HSE</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-[#14181F] uppercase mb-1">Mode</label>
            <select id="team-mode" class="ops-select text-xs">
              <option value="In-House Workshop">In-House Workshop</option>
              <option value="External Masterclass">External Masterclass</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#14181F] uppercase mb-1">Business & Audit Justification <span class="text-red-500">*</span></label>
          <textarea id="team-justification" rows="3" class="ops-textarea text-xs" placeholder="State the departmental necessity (e.g. mandatory NABL re-accreditation refresher, project rollout)..." required></textarea>
        </div>

        <button type="submit" class="btn-ops-primary">
          <i data-lucide="send" class="w-3.5 h-3.5"></i>
          Submit Team Request to Corporate HR
        </button>
      </form>
    </div>
  `;
}

function renderHeadTeam(state) {
  const user = store.getCurrentUser();
  const directReports = state.users.filter(u => u.headId === user.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Department Team Directory</h1>
          <p class="text-xs text-gray-500">Direct reports in ${user.department}. Click any staff member to view read-only training profile.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${directReports.map(emp => {
          const empTrainings = state.trainings.filter(t => t.userId === emp.id);
          const completed = empTrainings.filter(t => t.status === 'Completed').length;
          return `
            <div class="ops-panel p-4 space-y-3 hover:border-[#3B5BDB] transition-all">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 bg-[#14181F] text-white rounded font-bold text-xs flex items-center justify-center">
                    ${emp.avatarInitials}
                  </div>
                  <div>
                    <h2 class="text-xs font-bold text-[#14181F]">${emp.name}</h2>
                    <p class="text-[11px] text-gray-500">${emp.position}</p>
                  </div>
                </div>
                <span class="text-[10px] font-semibold bg-[#EDF7F2] text-[#2F7D5A] px-1.5 py-0.5 rounded border border-[#A3D9C1]">
                  ${completed} Completed
                </span>
              </div>

              <div class="space-y-1.5 text-xs text-gray-600">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-gray-400">Tenure:</span>
                  <span class="font-semibold text-gray-800">${emp.tenureYears} yrs</span>
                </div>
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-gray-400">Active Trainings:</span>
                  <span class="font-semibold text-[#3B5BDB]">${empTrainings.filter(t => t.status !== 'Completed').length}</span>
                </div>
              </div>

              <!-- Skills Badges -->
              <div class="pt-1 flex flex-wrap gap-1">
                ${emp.skills ? emp.skills.slice(0, 3).map(s => `
                  <span class="text-[10px] bg-[#F7F6F3] border border-[#E4E1DA] px-1.5 py-0.5 rounded text-gray-700">${s}</span>
                `).join('') : ''}
              </div>

              <div class="pt-2 border-t border-[#E4E1DA] flex items-center justify-between">
                <button class="text-xs text-[#3B5BDB] hover:underline font-semibold" onclick="window.app.viewEmployeeDetailModal('${emp.id}')">
                  View Profile & History
                </button>
                <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.openPromotionModal('${emp.id}')">
                  <i data-lucide="award" class="w-3 h-3 text-[#B8860B]"></i> Flag Award
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderHeadSignoffs(state) {
  const user = store.getCurrentUser();
  const queueItems = state.trainings.filter(t => t.department === user.department && t.status === 'Pending Sign-off');

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Completion Sign-Off Queue</h1>
          <p class="text-xs text-gray-500">Review employee proof submissions within 7 days. Submissions older than 7 days automatically lock and escalate to Corporate HR.</p>
        </div>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Training Program</th>
                <th>Submission Date</th>
                <th>Countdown until Auto-Escalation</th>
                <th>Proof Documents</th>
                <th>Review Action</th>
              </tr>
            </thead>
            <tbody>
              ${queueItems.length > 0 ? queueItems.map(t => {
                const isOverdue = t.daysElapsed >= 7;
                return `
                  <tr class="${isOverdue ? 'bg-[#FFF5F5]' : ''}">
                    <td>
                      <div class="font-bold text-xs text-[#14181F]">${t.userName}</div>
                      <div class="text-[10px] text-gray-500">${t.department}</div>
                    </td>
                    <td class="max-w-xs">
                      <div class="font-semibold text-xs text-[#14181F]">${t.title}</div>
                      <div class="text-[11px] text-gray-500">${t.category}</div>
                    </td>
                    <td class="whitespace-nowrap text-xs text-gray-600">${t.submissionDate}</td>
                    <td>${getCountdownPill(t.daysElapsed)}</td>
                    <td>
                      <div class="flex flex-col gap-1">
                        <button class="text-[11px] text-[#3B5BDB] hover:underline flex items-center gap-1 text-left" onclick="window.app.previewDoc('${t.proof ? t.proof.attendanceFile : 'Attendance.pdf'}', 'Attendance Sheet')">
                          <i data-lucide="file-check" class="w-3 h-3 text-[#2F7D5A]"></i>
                          <span>${t.proof ? t.proof.attendanceFile : 'Attendance.pdf'}</span>
                        </button>
                        <button class="text-[11px] text-[#3B5BDB] hover:underline flex items-center gap-1 text-left" onclick="window.app.previewDoc('${t.proof ? t.proof.certificateFile : 'Certificate.pdf'}', 'Certificate')">
                          <i data-lucide="award" class="w-3 h-3 text-[#B8860B]"></i>
                          <span>${t.proof ? t.proof.certificateFile : 'Certificate.pdf'}</span>
                        </button>
                      </div>
                    </td>
                    <td>
                      ${isOverdue ? `
                        <div class="space-y-1">
                          <span class="text-[11px] text-[#B3261E] font-bold block">Escalated to HR</span>
                          <span class="text-[10px] text-gray-400 block">7-day SLA passed (Read-Only)</span>
                        </div>
                      ` : `
                        <button class="btn-ops-primary py-1 px-2.5 text-xs" onclick="window.app.openReviewDrawer('${t.id}')">
                          Review & Sign-Off
                        </button>
                      `}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="6" class="p-8 text-center text-xs text-gray-500">
                    <i data-lucide="check-circle-2" class="w-8 h-8 text-[#2F7D5A] mx-auto mb-2"></i>
                    <p class="font-semibold text-gray-700">Sign-Off Queue is clear!</p>
                    <p class="mt-1">All employee completion proofs for your department have been reviewed.</p>
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHeadRequestStatus(state) {
  const user = store.getCurrentUser();
  const dept = state.departments.find(d => d.id === user.departmentId) || state.departments[0];
  const submittedRequests = state.requests.filter(r => r.departmentId === dept.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Training Requested Status</h1>
          <p class="text-xs text-gray-500">Status of both team and self requests submitted from ${dept.name}, including employee appeals.</p>
        </div>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Applicant & Type</th>
                <th>Requested Training</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Special Flags / Appeals</th>
              </tr>
            </thead>
            <tbody>
              ${submittedRequests.length > 0 ? submittedRequests.map(r => {
                const isEmployeeAppeal = r.status === 'Escalated' && r.appealNote;
                return `
                  <tr class="${isEmployeeAppeal ? 'bg-[#FEF9E7]' : ''}">
                    <td>
                      <div class="font-semibold text-xs text-[#14181F]">${r.applicantName}</div>
                      <span class="text-[10px] uppercase font-bold text-gray-400">${r.type} Request</span>
                    </td>
                    <td class="max-w-xs">
                      <div class="font-medium text-xs text-[#14181F]">${r.trainingTitle}</div>
                      <div class="text-[11px] text-gray-500">${r.category} • ${r.mode}</div>
                      ${r.targetEmployees ? `
                        <div class="text-[10px] text-gray-400 mt-0.5">Nominees: ${r.targetEmployees.map(e => e.name).join(', ')}</div>
                      ` : ''}
                    </td>
                    <td class="whitespace-nowrap text-xs text-gray-500">${r.submittedDate}</td>
                    <td>${getStatusPill(r.status)}</td>
                    <td>
                      ${isEmployeeAppeal ? `
                        <div class="p-1.5 bg-[#FEF3C7] border border-[#FCD34D] rounded text-[11px] text-[#92400E]">
                          <strong>Employee Appealed to HR:</strong> "${r.appealNote.substring(0, 60)}..."
                        </div>
                      ` : `
                        <span class="text-xs text-gray-400">—</span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="5" class="p-8 text-center text-xs text-gray-500">
                    No requests found for this department.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHeadReports(state) {
  const user = store.getCurrentUser();
  const directReports = state.users.filter(u => u.headId === user.id);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Team Reports & Promotion Filter</h1>
          <p class="text-xs text-gray-500">Structured competency assessment and promotion nominations for ${user.department}.</p>
        </div>
        <button class="btn-ops-secondary" onclick="window.app.exportTeamCSV()">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          Export Department Roster (CSV)
        </button>
      </div>

      <!-- Filters Panel (§5.2) -->
      <div class="ops-panel p-3 bg-[#FBFBFA] flex flex-wrap items-center gap-3 text-xs">
        <span class="font-bold text-gray-600 uppercase text-[10px]">Filter Roster:</span>
        <select id="head-report-filter-tenure" class="ops-select w-auto text-xs" onchange="window.app.filterTeamReport()">
          <option value="all">All Tenures</option>
          <option value="2">Tenure > 2 Years</option>
          <option value="4">Tenure > 4 Years</option>
          <option value="6">Tenure > 6 Years</option>
        </select>
        <select id="head-report-filter-completions" class="ops-select w-auto text-xs" onchange="window.app.filterTeamReport()">
          <option value="all">All Completion Levels</option>
          <option value="3">3+ Completed Trainings</option>
          <option value="6">6+ Completed Trainings</option>
        </select>
      </div>

      <!-- Structured Columns First Table (§5.2) -->
      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Position</th>
                <th>Tenure</th>
                <th>Completions</th>
                <th>Key Category Mastery</th>
                <th>Notes (Secondary)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="team-report-tbody">
              ${directReports.map(emp => {
                const flag = state.promotionFlags.find(f => f.userId === emp.id);
                return `
                  <tr>
                    <td class="font-bold text-xs text-[#14181F]">${emp.name}</td>
                    <td class="text-xs text-gray-700">${emp.position}</td>
                    <td class="tabular-nums font-semibold text-xs text-gray-800">${emp.tenureYears} yrs</td>
                    <td class="tabular-nums font-bold text-xs text-[#2F7D5A]">${emp.completedCount || 0} verified</td>
                    <td>
                      <div class="flex flex-wrap gap-1">
                        ${emp.skills ? emp.skills.slice(0, 2).map(s => `
                          <span class="text-[10px] bg-[#F7F6F3] border border-[#E4E1DA] px-1 py-0.5 rounded">${s}</span>
                        `).join('') : ''}
                      </div>
                    </td>
                    <td class="max-w-xs">
                      ${flag ? `
                        <div class="text-[11px] text-gray-600 line-clamp-1 hover:line-clamp-none cursor-pointer" title="${flag.notes}">
                          <strong>[${flag.category}]</strong> ${flag.notes}
                        </div>
                      ` : `
                        <span class="text-xs text-gray-400">No notes flagged</span>
                      `}
                    </td>
                    <td>
                      <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.openPromotionModal('${emp.id}')">
                        <i data-lucide="award" class="w-3 h-3 text-[#B8860B]"></i>
                        ${flag ? 'Update Flag' : 'Flag for Award'}
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------
// 5.3 HR / ADMIN VIEWS
// ------------------------------------------

function renderHrHome(state) {
  const activeDeptFilter = state.activeDepartmentFilter;
  const filteredDepts = activeDeptFilter === 'all' 
    ? state.departments 
    : state.departments.filter(d => d.id === activeDeptFilter);

  const reportingCount = state.cycle.departmentSubmissions.filter(s => s.status === 'Submitted').length;
  const pendingApprovalsCount = state.requests.filter(r => r.status.includes('Pending')).length;
  const openEscalationsCount = state.trainings.filter(t => t.status === 'Escalated').length + state.requests.filter(r => r.status === 'Escalated').length;

  return `
    <div class="space-y-5">
      
      <!-- Top Title & Department Global Scope Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Corporate HR Dashboard & Governance</h1>
          <p class="text-xs text-gray-500">Pan-India Training Operations • UltraTech Environmental Consultancy & Laboratory</p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-semibold text-gray-500 uppercase">Filter Scope:</label>
          <select id="hr-scope-dept-filter" class="ops-select w-auto text-xs" onchange="window.app.setDepartmentFilter(this.value)">
            <option value="all" ${activeDeptFilter === 'all' ? 'selected' : ''}>All 12 UltraTech Departments</option>
            ${state.departments.map(d => `
              <option value="${d.id}" ${activeDeptFilter === d.id ? 'selected' : ''}>${d.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Company-Wide KPI Tiles (§5.3) -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Departments Reporting</span>
          <div class="text-xl font-bold text-[#14181F] mt-1 tabular-nums">${reportingCount} / 12 Submissions</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Training Cycle</span>
          <div class="text-xl font-bold text-[#3B5BDB] mt-1 flex items-center gap-2">
            <span>${state.cycle.isOpen ? 'Active' : 'Closed'}</span>
            <span class="w-2 h-2 rounded-full ${state.cycle.isOpen ? 'bg-[#2F7D5A]' : 'bg-gray-400'}"></span>
          </div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Pending Approvals</span>
          <div class="text-xl font-bold text-[#B8860B] mt-1 tabular-nums">${pendingApprovalsCount} Requests</div>
        </div>
        <div class="ops-panel p-3.5">
          <span class="text-[11px] font-semibold text-gray-500 uppercase">Verified Completion Rate</span>
          <div class="text-xl font-bold text-[#2F7D5A] mt-1 tabular-nums">84.6% SLA</div>
        </div>
        <div class="ops-panel p-3.5 ${openEscalationsCount > 0 ? 'bg-[#FEF2F2] border-[#FCA5A5]' : ''}">
          <span class="text-[11px] font-semibold uppercase ${openEscalationsCount > 0 ? 'text-[#991B1B]' : 'text-gray-500'}">Open Escalations</span>
          <div class="text-xl font-bold ${openEscalationsCount > 0 ? 'text-[#B3261E]' : 'text-gray-700'} mt-1 tabular-nums">
            ${openEscalationsCount} Active Appeals
          </div>
        </div>
      </div>

      <!-- Quick Action Modules -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        <!-- Cycle Control Status Overview -->
        <div class="ops-panel overflow-hidden">
          <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="calendar-sync" class="w-4 h-4 text-[#3B5BDB]"></i>
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">Cycle Status & Reminders</h2>
            </div>
            <button class="text-xs text-[#3B5BDB] hover:underline font-medium" onclick="window.app.navigateTo('hr-cycle')">
              Manage Cycle Table
            </button>
          </div>
          <div class="p-4 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-700">Active Cycle: ${state.cycle.name}</span>
              <span class="status-pill ${state.cycle.isOpen ? 'status-in-progress' : 'status-upcoming'}">
                ${state.cycle.isOpen ? 'Accepting Submissions' : 'Closed'}
              </span>
            </div>
            <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div class="bg-[#2F7D5A] h-full" style="width: ${(reportingCount / 12) * 100}%"></div>
            </div>
            <div class="flex items-center justify-between text-[11px] text-gray-500">
              <span>${reportingCount} departments submitted</span>
              <span>${12 - reportingCount} pending reminders</span>
            </div>
          </div>
        </div>

        <!-- Open Escalations Overview -->
        <div class="ops-panel overflow-hidden">
          <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-[#B3261E]"></i>
              <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">Urgent Escalations Hub</h2>
            </div>
            <button class="text-xs text-[#3B5BDB] hover:underline font-medium" onclick="window.app.navigateTo('hr-escalations')">
              Open Escalations (${openEscalationsCount})
            </button>
          </div>
          <div class="p-4 space-y-2 text-xs">
            <p class="text-gray-600">
              Corporate HR acts as the final resolution authority for sign-off deadlines exceeding 7 days and employee appeals on rejected nominations.
            </p>
            <div class="pt-2 flex items-center gap-2">
              <button class="btn-ops-danger" onclick="window.app.navigateTo('hr-escalations')">
                <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i>
                Review ${openEscalationsCount} Escalated Items
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `;
}

function renderHrCycle(state) {
  const submissions = state.cycle.departmentSubmissions;

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Monthly Training Cycle Governance</h1>
          <p class="text-xs text-gray-500">Coordinate organization-wide training rounds, dispatch background broadcast alerts, and monitor department submissions.</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-ops-primary ${state.cycle.isOpen ? 'bg-[#B3261E] hover:bg-[#991B1B] border-[#991B1B]' : 'bg-[#2F7D5A] hover:bg-[#236346] border-[#236346]'}" onclick="window.app.toggleCycle()">
            <i data-lucide="power" class="w-3.5 h-3.5"></i>
            ${state.cycle.isOpen ? 'Close Training Cycle' : 'Open New Training Cycle'}
          </button>
        </div>
      </div>

      <!-- Caption Note (§5.3) -->
      <div class="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded text-xs text-[#1E3A8A] flex items-center gap-2">
        <i data-lucide="radio" class="w-4 h-4 shrink-0 text-[#3B5BDB]"></i>
        <span>
          <strong>Automated Background Job:</strong> Triggering "Open Cycle" automatically broadcasts a company-wide notification to all 12 Department Heads and employees.
        </span>
      </div>

      <!-- Per-Department Submission Table (§5.3) -->
      <div class="ops-panel overflow-hidden">
        <div class="p-3.5 bg-[#FBFBFA] border-b border-[#E4E1DA] flex items-center justify-between">
          <h2 class="text-xs font-bold uppercase tracking-wider text-[#14181F]">
            12 Department Submission Tracker — ${state.cycle.name}
          </h2>
          <span class="text-xs text-gray-500">Deadline: ${state.cycle.submissionDeadline}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Submission Status</th>
                <th>Submitted Date</th>
                <th>Submitted By</th>
                <th>Requests Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${submissions.map(sub => {
                const isPending = sub.status === 'Pending';
                return `
                  <tr>
                    <td class="font-semibold text-xs text-[#14181F]">${sub.deptName}</td>
                    <td>
                      <span class="status-pill ${sub.status === 'Submitted' ? 'status-completed' : 'status-pending'}">
                        ${sub.status}
                      </span>
                    </td>
                    <td class="text-xs text-gray-600">${sub.submittedDate || '—'}</td>
                    <td class="text-xs text-gray-700">${sub.submittedBy || '—'}</td>
                    <td class="tabular-nums font-bold text-xs text-[#3B5BDB]">${sub.requestsCount}</td>
                    <td>
                      ${isPending ? `
                        <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.sendReminder('${sub.deptId}')">
                          <i data-lucide="bell-ring" class="w-3 h-3 text-[#B8860B]"></i>
                          Send Reminder
                        </button>
                      ` : `
                        <span class="text-[11px] text-[#2F7D5A] font-semibold flex items-center gap-1">
                          <i data-lucide="check" class="w-3 h-3"></i> Completed
                        </span>
                      `}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHrRequests(state) {
  const requests = state.requests;
  const commonRequests = requests.filter(r => r.isCommon && r.status !== 'Approved');

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Consolidated Training Requests</h1>
          <p class="text-xs text-gray-500">Master consolidation of self & team nominations across 12 departments with Commonality clustering.</p>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-bulk-approve" class="btn-ops-primary ${commonRequests.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}" onclick="window.app.handleBulkApproveCommon()">
            <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
            Bulk Approve Selected Common Requests (${commonRequests.length})
          </button>
        </div>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th class="w-8">
                  <input type="checkbox" id="check-all-common" onchange="window.app.toggleSelectAllCommon(this.checked)" class="rounded text-[#3B5BDB]">
                </th>
                <th>Applicant / Department</th>
                <th>Training Topic</th>
                <th>Type & Overlap</th>
                <th>Status</th>
                <th>Row Action</th>
              </tr>
            </thead>
            <tbody>
              ${requests.map(r => {
                const isAppeal = r.status === 'Escalated' && r.appealNote;
                return `
                  <tr class="${isAppeal ? 'bg-[#FFF9E6]' : ''}">
                    <td>
                      ${r.isCommon && r.status !== 'Approved' ? `
                        <input type="checkbox" name="bulk-req-check" value="${r.id}" class="rounded text-[#3B5BDB]">
                      ` : ''}
                    </td>
                    <td>
                      <div class="font-bold text-xs text-[#14181F]">${r.applicantName}</div>
                      <div class="text-[10px] text-gray-500">${r.department}</div>
                    </td>
                    <td class="max-w-xs">
                      <div class="font-semibold text-xs text-[#14181F]">${r.trainingTitle}</div>
                      <div class="text-[11px] text-gray-500">${r.category} • ${r.mode}</div>
                      ${isAppeal ? `
                        <div class="mt-1 p-1.5 bg-[#FEF3C7] border border-[#FCD34D] rounded text-[11px] text-[#92400E]">
                          <strong>Appeal:</strong> ${r.appealNote}
                        </div>
                      ` : ''}
                    </td>
                    <td>
                      <div class="flex flex-col gap-1">
                        <span class="text-[10px] uppercase font-bold text-gray-400">${r.type}</span>
                        ${r.isCommon ? `
                          <span class="status-pill status-in-progress text-[10px]" title="Common topic requested by ${r.departmentOverlapCount} departments">
                            Common (${r.departmentOverlapCount} depts)
                          </span>
                        ` : `
                          <span class="text-[10px] text-gray-400 font-medium">Unique</span>
                        `}
                      </div>
                    </td>
                    <td>${getStatusPill(r.status)}</td>
                    <td>
                      <div class="flex items-center gap-1.5">
                        ${r.status !== 'Approved' ? `
                          <button class="btn-ops-success py-1 px-2 text-[11px]" onclick="window.app.approveRequest('${r.id}')">
                            Approve
                          </button>
                          <button class="btn-ops-danger py-1 px-2 text-[11px]" onclick="window.app.rejectRequestPrompt('${r.id}')">
                            Reject
                          </button>
                        ` : `
                          <span class="text-[11px] text-[#2F7D5A] font-semibold flex items-center gap-1">
                            <i data-lucide="check" class="w-3 h-3"></i> Approved
                          </span>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHrCalendar(state) {
  const events = state.events;
  const approvedRequests = state.requests.filter(r => r.status === 'Approved');

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Calendar & Workshop Allocation</h1>
          <p class="text-xs text-gray-500">Schedule technical workshops, enforce external HOD approvals, and assign approved employee candidates.</p>
        </div>
        <button class="btn-ops-primary" onclick="window.app.openCreateEventModal()">
          <i data-lucide="calendar-plus" class="w-3.5 h-3.5"></i>
          Schedule Training Event
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${events.map(evt => {
          const filled = evt.assignedEmployees ? evt.assignedEmployees.length : 0;
          return `
            <div class="ops-panel p-4 space-y-3">
              <div class="flex items-start justify-between">
                <div>
                  <span class="status-pill ${evt.mode === 'External' ? 'status-pending' : 'status-in-progress'} text-[10px]">
                    ${evt.mode} Training
                  </span>
                  <h2 class="text-sm font-bold text-[#14181F] mt-1">${evt.title}</h2>
                  <p class="text-xs text-gray-500">${evt.category}</p>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-gray-800 tabular-nums">${filled} / ${evt.capacity}</span>
                  <span class="text-[10px] text-gray-400 block">Allocated Seats</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs bg-[#F7F6F3] p-2.5 rounded border border-[#E4E1DA]">
                <div>
                  <span class="text-gray-400 font-medium block text-[10px]">Dates</span>
                  <span class="font-semibold text-gray-800">${evt.date} ${evt.endDate ? 'to ' + evt.endDate : ''}</span>
                </div>
                <div>
                  <span class="text-gray-400 font-medium block text-[10px]">Venue</span>
                  <span class="font-semibold text-gray-800">${evt.venue}</span>
                </div>
                <div>
                  <span class="text-gray-400 font-medium block text-[10px]">Instructor / Lead</span>
                  <span class="font-semibold text-gray-800">${evt.instructor}</span>
                </div>
                <div>
                  <span class="text-gray-400 font-medium block text-[10px]">Reimbursement %</span>
                  <span class="font-semibold text-[#2F7D5A]">${evt.reimbursementPercent}% Sponsored</span>
                </div>
              </div>

              <!-- Assigned employees pill list -->
              <div>
                <span class="text-[10px] font-bold uppercase text-gray-400 block mb-1">Assigned Candidates (${filled})</span>
                <div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                  ${evt.assignedEmployees && evt.assignedEmployees.length > 0 ? evt.assignedEmployees.map(emp => `
                    <span class="text-[10px] bg-white border border-[#E4E1DA] px-2 py-0.5 rounded flex items-center gap-1">
                      <i data-lucide="user" class="w-2.5 h-2.5 text-[#3B5BDB]"></i>
                      ${emp.name}
                    </span>
                  `).join('') : `
                    <span class="text-xs text-gray-400">No candidates allocated yet</span>
                  `}
                </div>
              </div>

              <div class="pt-2 border-t border-[#E4E1DA] flex items-center justify-between flex-wrap gap-2">
                <span class="text-[11px] text-gray-500">${evt.status === 'Cancelled' ? '🚫 Training Closed / Cancelled' : (evt.hodApprovalRequired ? '⚠️ Requires HOD Pre-approval' : 'Standard In-House Allocation')}</span>
                <div class="flex items-center gap-2">
                  ${evt.status === 'Cancelled' ? `
                    <span class="status-pill status-rejected text-xs font-semibold">Cancelled</span>
                  ` : `
                    <button class="btn-ops-danger py-1 px-2.5 text-xs flex items-center gap-1" onclick="window.app.cancelTrainingEvent('${evt.id}')">
                      <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                      <span>Cancel / Close Training</span>
                    </button>
                    <button class="btn-ops-secondary py-1 px-2 text-xs flex items-center gap-1" onclick="window.app.openAssignCandidatesModal('${evt.id}')">
                      <i data-lucide="user-plus" class="w-3 h-3 text-[#3B5BDB]"></i>
                      <span>Assign Candidates</span>
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderHrDirectory(state) {
  const users = state.users;

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Organization Employee Directory</h1>
          <p class="text-xs text-gray-500">Personnel profiles across 12 UltraTech departments with technical competencies and completion history.</p>
        </div>
        <div class="text-xs text-[#2F7D5A] font-semibold bg-[#EDF7F2] border border-[#A3D9C1] px-2.5 py-1 rounded flex items-center gap-1.5">
          <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
          <span>Zero-Compensation Privacy Protection Active</span>
        </div>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Experience</th>
                <th>Training Tags Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>
                    <div class="font-bold text-xs text-[#14181F]">${u.name}</div>
                    <div class="text-[10px] text-gray-500">${u.email}</div>
                  </td>
                  <td class="text-xs text-gray-700">${u.department}</td>
                  <td class="text-xs text-gray-800">${u.position}</td>
                  <td class="tabular-nums text-xs text-gray-800">${u.tenureYears} yrs</td>
                  <td>
                    <span class="status-pill status-completed text-xs font-bold tabular-nums">
                      ${u.completedCount || 0} Verified Courses
                    </span>
                  </td>
                  <td>
                    <button class="btn-ops-secondary py-1 px-2.5 text-xs" onclick="window.app.viewEmployeeDetailModal('${u.id}')">
                      View Full Profile
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHrEscalations(state) {
  // Dual sub-lists (§5.3):
  // (a) sign-offs that passed the 7-day head deadline
  // (b) requests/resubmissions an employee appealed after a head rejection
  const overdueSignoffs = state.trainings.filter(t => t.status === 'Escalated' || (t.status === 'Pending Sign-off' && t.daysElapsed >= 7));
  const appealedRequests = state.requests.filter(r => r.status === 'Escalated' && r.appealNote);

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Escalations Resolution Hub</h1>
          <p class="text-xs text-gray-500">Review auto-escalated overdue sign-offs (>7 days) and formal employee appeals against department rejections.</p>
        </div>
      </div>

      <!-- Sub-list A: Overdue Sign-offs past 7 days -->
      <div class="ops-panel overflow-hidden">
        <div class="p-3.5 bg-[#FEF2F2] border-b border-[#FCA5A5] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="alert-octagon" class="w-4 h-4 text-[#B3261E]"></i>
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#991B1B]">
              Sub-List A: Overdue Sign-Offs (Passed 7-Day Head SLA) (${overdueSignoffs.length})
            </h2>
          </div>
          <span class="text-[11px] text-[#991B1B] font-medium">Auto-escalated for executive HR sign-off</span>
        </div>

        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Employee / Dept</th>
                <th>Training Topic</th>
                <th>Submission Date</th>
                <th>Days Elapsed</th>
                <th>Proof Preview</th>
                <th>HR Resolution Action</th>
              </tr>
            </thead>
            <tbody>
              ${overdueSignoffs.length > 0 ? overdueSignoffs.map(t => `
                <tr>
                  <td>
                    <div class="font-bold text-xs text-[#14181F]">${t.userName}</div>
                    <div class="text-[10px] text-gray-500">${t.department}</div>
                  </td>
                  <td class="max-w-xs">
                    <div class="font-semibold text-xs text-[#14181F]">${t.title}</div>
                    <div class="text-[11px] text-gray-500">${t.category}</div>
                  </td>
                  <td class="whitespace-nowrap text-xs text-gray-600">${t.submissionDate}</td>
                  <td>
                    <span class="countdown-pill countdown-overdue">
                      ${t.daysElapsed} days (> 7 days SLA)
                    </span>
                  </td>
                  <td>
                    <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.viewProofModal('${t.id}')">
                      Inspect Proof
                    </button>
                  </td>
                  <td>
                    <div class="flex items-center gap-1.5">
                      <button class="btn-ops-success py-1 px-2 text-[11px]" onclick="window.app.resolveEscalationItem('${t.id}', 'signoff', 'Approve')">
                        Approve & Verify
                      </button>
                      <button class="btn-ops-danger py-1 px-2 text-[11px]" onclick="window.app.resolveEscalationItem('${t.id}', 'signoff', 'Reject')">
                        Send Back
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="6" class="p-6 text-center text-xs text-gray-500">
                    No sign-offs currently overdue. All department reviews completed within the 7-day SLA window.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sub-list B: Appealed Requests & Rejections -->
      <div class="ops-panel overflow-hidden">
        <div class="p-3.5 bg-[#FEF9E7] border-b border-[#F3DB94] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="scale" class="w-4 h-4 text-[#B8860B]"></i>
            <h2 class="text-xs font-bold uppercase tracking-wider text-[#92400E]">
              Sub-List B: Employee Rejection Appeals (${appealedRequests.length})
            </h2>
          </div>
          <span class="text-[11px] text-[#92400E] font-medium">Employee formal contest of Head rejection</span>
        </div>

        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Appellant</th>
                <th>Training Topic</th>
                <th>Head's Stated Rejection Reason</th>
                <th>Employee's Appeal Justification</th>
                <th>Resolution Action</th>
              </tr>
            </thead>
            <tbody>
              ${appealedRequests.length > 0 ? appealedRequests.map(r => `
                <tr>
                  <td>
                    <div class="font-bold text-xs text-[#14181F]">${r.applicantName}</div>
                    <div class="text-[10px] text-gray-500">${r.department}</div>
                  </td>
                  <td class="max-w-xs">
                    <div class="font-semibold text-xs text-[#14181F]">${r.trainingTitle}</div>
                    <div class="text-[11px] text-gray-500">${r.category} • ${r.mode}</div>
                  </td>
                  <td class="max-w-xs text-xs text-[#991B1B] bg-[#FFF5F5] p-2 rounded">
                    ${r.rejectionReason}
                  </td>
                  <td class="max-w-xs text-xs text-[#92400E] bg-[#FEF9E7] p-2 rounded">
                    ${r.appealNote}
                  </td>
                  <td>
                    <div class="flex items-center gap-1.5">
                      <button class="btn-ops-success py-1 px-2 text-[11px]" onclick="window.app.resolveEscalationItem('${r.id}', 'appeal', 'Approve')">
                        Uphold Appeal
                      </button>
                      <button class="btn-ops-danger py-1 px-2 text-[11px]" onclick="window.app.resolveEscalationItem('${r.id}', 'appeal', 'Reject')">
                        Uphold Rejection
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="5" class="p-6 text-center text-xs text-gray-500">
                    No active employee appeals currently filed.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function renderHrPromotions(state) {
  const flags = state.promotionFlags;

  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Promotions & Awards Shortlist</h1>
          <p class="text-xs text-gray-500">Company-wide candidate evaluations based on verified training completion milestones and technical leadership.</p>
        </div>
        <button class="btn-ops-secondary" onclick="window.app.exportPromotionsCSV()">
          <i data-lucide="download" class="w-3.5 h-3.5"></i>
          Export Shortlist (CSV)
        </button>
      </div>

      <div class="ops-panel overflow-hidden">
        <div class="overflow-x-auto">
          <table class="ops-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Department</th>
                <th>Tenure</th>
                <th>Verified Completions</th>
                <th>Track / Recognition Category</th>
                <th>Flagged By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${flags.map(f => `
                <tr>
                  <td class="font-bold text-xs text-[#14181F]">${f.userName}</td>
                  <td class="text-xs text-gray-700">${f.department}</td>
                  <td class="tabular-nums font-semibold text-xs text-gray-800">${f.tenureYears} yrs</td>
                  <td class="tabular-nums font-bold text-xs text-[#2F7D5A]">${f.completedTrainings}</td>
                  <td class="text-xs font-semibold text-[#14181F]">${f.category}</td>
                  <td class="text-xs text-gray-500">${f.flaggedBy} (${f.flaggedDate})</td>
                  <td>
                    <span class="status-pill status-in-progress font-semibold text-xs">
                      ${f.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderHrReports(state) {
  return `
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 class="text-xl font-bold text-[#14181F]">Training Audit & Operations Reports</h1>
          <p class="text-xs text-gray-500">Generate printable ISO 17025 compliance logs and tabular exports for board reviews.</p>
        </div>
      </div>

      <!-- Structural Compensation Guarantee Notice (§5.3) -->
      <div class="p-3.5 bg-[#EDF7F2] border border-[#A3D9C1] rounded text-xs text-[#2F7D5A] flex items-center gap-2.5">
        <i data-lucide="shield-check" class="w-5 h-5 shrink-0 text-[#2F7D5A]"></i>
        <div>
          <strong>Structural Privacy Architecture:</strong> All reporting data pipelines and CSV/PDF exporters are structurally stripped of any salary, compensation, or payroll identifiers, strictly maintaining internal capability audit scopes.
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div class="ops-panel p-5 space-y-3">
          <div class="flex items-center gap-2">
            <i data-lucide="file-spreadsheet" class="w-5 h-5 text-[#2F7D5A]"></i>
            <h2 class="text-sm font-bold text-[#14181F]">Pan-India Training Roster (CSV / Excel)</h2>
          </div>
          <p class="text-xs text-gray-600">
            Export all assigned trainings, completion dates, providers, and sign-off statuses across all 12 departments.
          </p>
          <div class="pt-2">
            <button class="btn-ops-primary" onclick="window.app.exportFullTrainingCSV()">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              Download Full Roster CSV
            </button>
          </div>
        </div>

        <div class="ops-panel p-5 space-y-3">
          <div class="flex items-center gap-2">
            <i data-lucide="printer" class="w-5 h-5 text-[#3B5BDB]"></i>
            <h2 class="text-sm font-bold text-[#14181F]">Printable Quality Compliance Audit Report</h2>
          </div>
          <p class="text-xs text-gray-600">
            Render an executive tabular print sheet formatted for NABL / QCI laboratory accreditation compliance auditors.
          </p>
          <div class="pt-2">
            <button class="btn-ops-secondary" onclick="window.print()">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              Print / Save as PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ==========================================
// Main Application Controller Object
// ==========================================
class App {
  constructor() {
    this.initEventListeners();
    store.subscribe((state) => this.render(state));
    this.render(store.state);
  }

  initEventListeners() {
    // Role switcher buttons
    document.querySelectorAll('[data-role]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-role');
        store.setRole(role);
        showToast(`Switched persona to ${role.toUpperCase()}`, 'info');
      });
    });

    // Reset demo button
    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset the portal state to the pre-seeded demo dataset?")) {
          store.resetState();
          showToast("Demo dataset restored to initial state.", "success");
        }
      });
    }

    // Toggle Notifications Drawer
    const notifBtn = document.getElementById('btn-notifications-drawer');
    const notifOverlay = document.getElementById('notifications-drawer-overlay');
    const closeNotifBtn = document.getElementById('btn-close-notif-drawer');
    const markAllBtn = document.getElementById('btn-mark-all-read');

    if (notifBtn && notifOverlay) {
      notifBtn.addEventListener('click', () => notifOverlay.classList.add('open'));
    }
    if (closeNotifBtn && notifOverlay) {
      closeNotifBtn.addEventListener('click', () => notifOverlay.classList.remove('open'));
    }
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        store.markAllNotificationsRead();
        showToast("All notifications marked as read", "success");
      });
    }

    // Toggle Sidebar on mobile
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');
    const closeSidebarBtn = document.getElementById('btn-close-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener('click', () => sidebar.classList.toggle('-translate-x-full'));
    }
    if (closeSidebarBtn && sidebar) {
      closeSidebarBtn.addEventListener('click', () => sidebar.classList.add('-translate-x-full'));
    }

    // Document preview modal close handlers
    document.getElementById('btn-close-doc-preview')?.addEventListener('click', () => {
      document.getElementById('doc-preview-modal')?.classList.remove('open');
    });
    document.getElementById('btn-close-doc-preview-bottom')?.addEventListener('click', () => {
      document.getElementById('doc-preview-modal')?.classList.remove('open');
    });

    // Proof Drawer close
    document.getElementById('btn-close-proof-drawer')?.addEventListener('click', () => {
      document.getElementById('proof-drawer-overlay')?.classList.remove('open');
    });

    // Escalate Modal close
    document.getElementById('btn-close-escalate-modal')?.addEventListener('click', () => {
      document.getElementById('escalate-modal-overlay')?.classList.remove('open');
    });
    document.getElementById('btn-cancel-escalate')?.addEventListener('click', () => {
      document.getElementById('escalate-modal-overlay')?.classList.remove('open');
    });

    // Promotion Modal close
    document.getElementById('btn-close-prm-modal')?.addEventListener('click', () => {
      document.getElementById('promotion-modal')?.classList.remove('open');
    });
    document.getElementById('btn-cancel-prm')?.addEventListener('click', () => {
      document.getElementById('promotion-modal')?.classList.remove('open');
    });

    // Create Event Modal close & mode change
    document.getElementById('btn-close-create-event')?.addEventListener('click', () => {
      document.getElementById('create-event-modal')?.classList.remove('open');
    });
    document.getElementById('btn-cancel-create-event')?.addEventListener('click', () => {
      document.getElementById('create-event-modal')?.classList.remove('open');
    });
    document.getElementById('evt-mode')?.addEventListener('change', (e) => {
      const extFields = document.getElementById('evt-external-fields');
      if (extFields) {
        if (e.target.value === 'External') extFields.classList.remove('hidden');
        else extFields.classList.add('hidden');
      }
    });

    // Create event form submit
    document.getElementById('create-event-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('evt-title').value;
      const category = document.getElementById('evt-category').value;
      const mode = document.getElementById('evt-mode').value;
      const date = document.getElementById('evt-date').value;
      const endDate = document.getElementById('evt-end-date').value;
      const capacity = document.getElementById('evt-capacity').value;
      const venue = document.getElementById('evt-venue').value;
      const instructor = document.getElementById('evt-instructor').value;
      const hodApproval = document.getElementById('evt-hod-approval').checked;
      const reimbursement = document.getElementById('evt-reimbursement').value;

      store.createEvent({
        title,
        category,
        mode,
        date,
        endDate,
        capacity,
        venue,
        instructor,
        hodApprovalRequired: hodApproval,
        reimbursementPercent: reimbursement
      });

      document.getElementById('create-event-modal').classList.remove('open');
      showToast(`Training event "${title}" created successfully!`, 'success');
    });

    // Profile Dropdown Toggle (Image 3)
    const profileBtn = document.getElementById('topbar-profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown-menu');

    if (profileBtn && profileDropdown) {
      profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('hidden');
      });
    }

    // Open Manual Login Modal (Image 3 -> Image 2)
    const openLoginBtn = document.getElementById('btn-open-manual-login');
    const loginModal = document.getElementById('login-modal-overlay');
    const closeLoginBtn = document.getElementById('btn-close-login-modal');

    if (openLoginBtn && loginModal) {
      openLoginBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown?.classList.add('hidden');
        loginModal.classList.add('open');
      });
    }

    if (closeLoginBtn && loginModal) {
      closeLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('open');
      });
    }

    // Close overlays & dropdowns on outside click
    window.addEventListener('click', (e) => {
      if (profileDropdown && !profileDropdown.contains(e.target) && !profileBtn?.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
      if (e.target.classList.contains('ops-drawer-overlay')) {
        e.target.classList.remove('open');
      }
      if (e.target.classList.contains('ops-modal-overlay')) {
        e.target.classList.remove('open');
      }
    });
  }

  navigateTo(viewId) {
    store.setView(viewId);
    // Hide mobile sidebar if open
    document.getElementById('sidebar')?.classList.add('-translate-x-full');
  }

  setDepartmentFilter(deptId) {
    store.setDepartmentFilter(deptId);
  }

  // Quick switch role directly from profile dropdown (Image 3)
  quickSwitchRole(role) {
    store.setRole(role);
    document.getElementById('profile-dropdown-menu')?.classList.add('hidden');
    const user = store.getCurrentUser();
    showToast(`Switched persona to ${user.name} (${user.role.toUpperCase()})`, 'info');
  }

  // Select login persona from quick access cards (Image 2)
  selectLoginPersona(role, email) {
    const emailInput = document.getElementById('login-email-input');
    if (emailInput) emailInput.value = email;

    store.setRole(role);
    document.getElementById('login-modal-overlay')?.classList.remove('open');
    document.getElementById('profile-dropdown-menu')?.classList.add('hidden');

    const user = store.getCurrentUser();
    showToast(`Authenticated & switched to ${user.name} (${user.role.toUpperCase()})`, 'success');
  }

  // Manual password sign in handler (Image 2)
  handleManualLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email-input')?.value.toLowerCase() || '';
    
    let role = 'hr';
    if (email.includes('rahul') || email.includes('employee')) {
      role = 'employee';
    } else if (email.includes('priya') || email.includes('head')) {
      role = 'head';
    } else {
      role = 'hr';
    }

    store.setRole(role);
    document.getElementById('login-modal-overlay')?.classList.remove('open');
    document.getElementById('profile-dropdown-menu')?.classList.add('hidden');

    const user = store.getCurrentUser();
    showToast(`Signed in to UltraTech Portal as ${user.name} (${user.role.toUpperCase()})`, 'success');
  }

  render(state) {
    updateTopBar(state);
    renderSidebarNavigation(state);

    // Attach dynamic click listeners for sidebar links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.navigateTo(view);
      });
    });

    // Render Notifications Drawer Content
    this.renderNotificationsList(state);

    // Mount Active Screen View
    const mount = document.getElementById('view-mount');
    if (!mount) return;

    switch (state.currentView) {
      // Employee
      case 'employee-home':
        mount.innerHTML = renderEmployeeHome(state);
        break;
      case 'employee-profile':
        mount.innerHTML = renderEmployeeProfile(state);
        break;
      case 'employee-trainings':
        mount.innerHTML = renderEmployeeTrainings(state);
        break;
      case 'employee-request':
        mount.innerHTML = renderEmployeeRequest(state);
        break;
      case 'employee-notifications':
        mount.innerHTML = renderNotificationsFeed(state);
        break;

      // Head
      case 'head-home':
        mount.innerHTML = renderHeadHome(state);
        break;
      case 'head-profile':
        mount.innerHTML = renderEmployeeProfile(state); // Reused identical component (§5.2)
        break;
      case 'head-trainings':
        mount.innerHTML = renderEmployeeTrainings(state); // Reused identical component (§5.2)
        break;
      case 'head-request':
        mount.innerHTML = renderHeadRequest(state);
        break;
      case 'head-team':
        mount.innerHTML = renderHeadTeam(state);
        break;
      case 'head-signoffs':
        mount.innerHTML = renderHeadSignoffs(state);
        break;
      case 'head-request-status':
        mount.innerHTML = renderHeadRequestStatus(state);
        break;
      case 'head-reports':
        mount.innerHTML = renderHeadReports(state);
        break;
      case 'head-notifications':
        mount.innerHTML = renderNotificationsFeed(state);
        break;

      // HR
      case 'hr-home':
        mount.innerHTML = renderHrHome(state);
        break;
      case 'hr-profile':
        mount.innerHTML = renderEmployeeProfile(state); // Reused — renders current user (Vikram Seth)
        break;
      case 'hr-cycle':
        mount.innerHTML = renderHrCycle(state);
        break;
      case 'hr-requests':
        mount.innerHTML = renderHrRequests(state);
        break;
      case 'hr-calendar':
        mount.innerHTML = renderHrCalendar(state);
        break;
      case 'hr-directory':
        mount.innerHTML = renderHrDirectory(state);
        break;
      case 'hr-escalations':
        mount.innerHTML = renderHrEscalations(state);
        break;
      case 'hr-promotions':
        mount.innerHTML = renderHrPromotions(state);
        break;
      case 'hr-reports':
        mount.innerHTML = renderHrReports(state);
        break;

      default:
        mount.innerHTML = renderEmployeeHome(state);
    }

    lucide.createIcons({ root: mount });
  }

  renderNotificationsList(state) {
    const list = document.getElementById('notifications-list');
    if (!list) return;

    const user = store.getCurrentUser();
    const notifs = state.notifications.filter(n => n.targetRoles.includes(user.role) || n.targetRoles.includes('all'));

    list.innerHTML = notifs.map(n => `
      <div class="py-2 text-xs flex items-start justify-between gap-2 ${n.unread ? 'font-semibold' : 'text-gray-600'}">
        <div class="space-y-0.5">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full ${n.unread ? 'bg-[#3B5BDB]' : 'bg-transparent'}"></span>
            <span class="text-[#14181F]">${n.title}</span>
          </div>
          <p class="text-gray-500 text-[11px] leading-snug pl-3">${n.message}</p>
        </div>
        <span class="text-[9px] text-gray-400 tabular-nums shrink-0">${n.timestamp.substring(11)}</span>
      </div>
    `).join('');
  }

  // Head Request Tab Switcher
  switchHeadRequestTab(tab) {
    const btnSelf = document.getElementById('tab-btn-self');
    const btnTeam = document.getElementById('tab-btn-team');
    const container = document.getElementById('head-request-content');
    if (!container) return;

    if (tab === 'team') {
      btnTeam.className = 'px-3 py-2 text-xs font-semibold border-b-2 border-[#3B5BDB] text-[#3B5BDB]';
      btnSelf.className = 'px-3 py-2 text-xs font-medium text-gray-500 hover:text-black border-b-2 border-transparent';
      container.innerHTML = renderHeadTeamRequestTab(store.state);
    } else {
      btnSelf.className = 'px-3 py-2 text-xs font-semibold border-b-2 border-[#3B5BDB] text-[#3B5BDB]';
      btnTeam.className = 'px-3 py-2 text-xs font-medium text-gray-500 hover:text-black border-b-2 border-transparent';
      container.innerHTML = renderEmployeeRequest(store.state);
    }
    lucide.createIcons({ root: container });
  }

  // Handle HR Global Topbar Department Filter
  handleTopbarDeptFilter(deptId) {
    store.state.activeDepartmentFilter = deptId;
    store.persistState();
    this.render();
  }

  // Handle HR Global Topbar Branch Filter
  handleTopbarBranchFilter(branch) {
    store.state.activeBranchFilter = branch;
    store.persistState();
    alert(`Branch filter applied: ${branch === 'all' ? 'All Branches' : branch}`);
    this.render();
  }

  // Cancel / Close Training Event (Requirement 3)
  cancelTrainingEvent(eventId) {
    const evt = store.state.events.find(e => e.id === eventId);
    if (!evt) return;

    if (confirm(`Are you sure you want to cancel / close the training workshop "${evt.title}"?`)) {
      evt.status = 'Cancelled';
      store.persistState();
      alert(`Training "${evt.title}" has been closed / cancelled.`);
      this.render();
    }
  }

  // Profile Inline Skills / Projects
  // ── Toggle between static view and edit form in the profile left card ──
  toggleProfileEdit() {
    const staticDiv = document.getElementById('profile-static-details');
    const editForm  = document.getElementById('profile-edit-form');
    const editBtn   = document.getElementById('btn-edit-profile-details');
    if (!staticDiv || !editForm) return;

    const isEditing = !editForm.classList.contains('hidden');
    if (isEditing) {
      // Cancel – go back to static view
      editForm.classList.add('hidden');
      staticDiv.classList.remove('hidden');
      if (editBtn) editBtn.innerHTML = '<i data-lucide="pencil" class="w-3 h-3"></i><span>Edit</span>';
    } else {
      // Open edit form
      staticDiv.classList.add('hidden');
      editForm.classList.remove('hidden');
      if (editBtn) editBtn.innerHTML = '<i data-lucide="x" class="w-3 h-3"></i><span>Cancel</span>';
    }
    lucide.createIcons({ root: document.getElementById('profile-left-card') });
  }

  // ── Save edited employment details and update top bar ──
  saveProfileDetails() {
    const user = store.getCurrentUser();
    const name       = (document.getElementById('edit-profile-name')?.value || '').trim();
    const position   = (document.getElementById('edit-profile-position')?.value || '').trim();
    const tenureYears = parseFloat(document.getElementById('edit-profile-tenure')?.value);
    const email      = (document.getElementById('edit-profile-email')?.value || '').trim();
    const department = (document.getElementById('edit-profile-dept')?.value || '').trim();

    if (!name) { alert('Name cannot be empty.'); return; }

    store.updateProfile(user.id, { name, position, tenureYears, email, department });

    // Update header display name/initials without full re-render
    const updated = store.getCurrentUser();
    const displayNameEl  = document.getElementById('profile-display-name');
    const displayPosEl   = document.getElementById('profile-display-position');
    const avatarBadgeEl  = document.getElementById('profile-avatar-badge');
    const staticDeptEl   = document.getElementById('profile-static-dept');
    const staticTenureEl = document.getElementById('profile-static-tenure');
    const staticEmailEl  = document.getElementById('profile-static-email');

    if (displayNameEl)  displayNameEl.textContent  = updated.name;
    if (displayPosEl)   displayPosEl.textContent   = updated.position;
    if (avatarBadgeEl)  avatarBadgeEl.textContent  = updated.avatarInitials;
    if (staticDeptEl)   staticDeptEl.textContent   = updated.department;
    if (staticTenureEl) staticTenureEl.textContent = `${updated.tenureYears} Years`;
    if (staticEmailEl)  staticEmailEl.textContent  = updated.email;

    // Update top-bar name, avatar initials, and dropdown header
    const topbarNameEl   = document.getElementById('topbar-user-name');
    const topbarAvatarEl = document.getElementById('topbar-user-avatar');
    const dropdownNameEl = document.getElementById('dropdown-user-name');
    const dropdownEmailEl = document.getElementById('dropdown-user-email');
    if (topbarNameEl)   topbarNameEl.textContent   = updated.name;
    if (topbarAvatarEl) topbarAvatarEl.textContent = updated.avatarInitials;
    if (dropdownNameEl) dropdownNameEl.textContent  = updated.name;
    if (dropdownEmailEl && email) dropdownEmailEl.textContent = updated.email;

    // Close the form back to static view
    this.toggleProfileEdit();
    this.triggerSaveFeedback();
  }

  triggerSaveFeedback() {
    const indicator = document.getElementById('profile-save-indicator');
    if (indicator) {
      indicator.classList.add('active');
      setTimeout(() => indicator.classList.remove('active'), 2200);
    }
  }

  addSkill() {
    const input = document.getElementById('new-skill-input');
    if (!input || !input.value.trim()) return;
    const user = store.getCurrentUser();
    const skills = [...user.skills, input.value.trim()];
    store.updateProfile(user.id, { skills });
    input.value = '';
    this.triggerSaveFeedback();
  }

  removeSkill(index) {
    const user = store.getCurrentUser();
    const skills = user.skills.filter((_, i) => i !== index);
    store.updateProfile(user.id, { skills });
    this.triggerSaveFeedback();
  }

  addProject() {
    const input = document.getElementById('new-project-input');
    if (!input || !input.value.trim()) return;
    const user = store.getCurrentUser();
    const projects = [...user.projects, input.value.trim()];
    store.updateProfile(user.id, { projects });
    input.value = '';
    this.triggerSaveFeedback();
  }

  removeProject(index) {
    const user = store.getCurrentUser();
    const projects = user.projects.filter((_, i) => i !== index);
    store.updateProfile(user.id, { projects });
    this.triggerSaveFeedback();
  }

  // Proof Upload Drawer
  openProofUploadModal(trainingId) {
    const trn = store.state.trainings.find(t => t.id === trainingId);
    if (!trn) return;

    const overlay = document.getElementById('proof-drawer-overlay');
    const titleEl = document.getElementById('proof-drawer-title');
    const bodyEl = document.getElementById('proof-drawer-body');

    titleEl.textContent = trn.title;
    bodyEl.innerHTML = `
      <form id="proof-upload-form" onsubmit="window.app.handleProofSubmit(event, '${trn.id}')" class="space-y-4 text-xs">
        <div class="p-3 bg-[#EEF2FF] border border-[#C7D2FE] rounded text-[#1E3A8A]">
          <p class="font-bold">7-Day Sign-Off Window Activation</p>
          <p class="mt-0.5">Submitting your proof flips your status to "Pending Sign-off" and triggers a 7-day auto-escalation countdown for your Department Head.</p>
        </div>

        <div>
          <label class="block font-semibold text-[#14181F] mb-1">Key Learnings & Technical Takeaways <span class="text-red-500">*</span></label>
          <textarea id="proof-learnings" rows="4" class="ops-textarea" placeholder="Summarize key analytical takeaways, calibration standards mastered, or safety procedures practiced..." required></textarea>
        </div>

        <div>
          <label class="block font-semibold text-[#14181F] mb-1">Attendance Sheet Proof (PDF/JPG) <span class="text-red-500">*</span></label>
          <input type="file" id="proof-attendance-file" class="ops-input" accept=".pdf,.png,.jpg,.jpeg" onchange="window.app.handleFileSelect(this, 'attendance-preview-box')">
          <div id="attendance-preview-box" class="mt-2 hidden">
            <!-- Simulated File Card -->
          </div>
        </div>

        <div>
          <label class="block font-semibold text-[#14181F] mb-1">Training Certificate (PDF/JPG) <span class="text-red-500">*</span></label>
          <input type="file" id="proof-cert-file" class="ops-input" accept=".pdf,.png,.jpg,.jpeg" onchange="window.app.handleFileSelect(this, 'cert-preview-box')">
          <div id="cert-preview-box" class="mt-2 hidden">
            <!-- Simulated File Card -->
          </div>
        </div>

        <div class="pt-3 border-t border-[#E4E1DA] flex items-center justify-end gap-2">
          <button type="button" class="btn-ops-secondary" onclick="document.getElementById('proof-drawer-overlay').classList.remove('open')">Cancel</button>
          <button type="submit" class="btn-ops-primary">
            <i data-lucide="check" class="w-3.5 h-3.5"></i>
            Submit Completion Proof
          </button>
        </div>
      </form>
    `;

    overlay.classList.add('open');
    lucide.createIcons({ root: bodyEl });
  }

  handleFileSelect(input, containerId) {
    const box = document.getElementById(containerId);
    if (!box) return;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      
      // Validation: Error state in interface voice (§6)
      if (file.size > 10 * 1024 * 1024) {
        showToast("Certificate upload failed — try a file under 10MB.", "danger");
        input.value = '';
        box.classList.add('hidden');
        return;
      }

      box.classList.remove('hidden');
      box.innerHTML = `
        <div class="doc-preview-card">
          <div class="flex items-center gap-2 truncate">
            <i data-lucide="file-check-2" class="w-4 h-4 text-[#2F7D5A] shrink-0"></i>
            <span class="font-bold text-[#14181F] truncate">${file.name}</span>
            <span class="text-[10px] text-gray-400">(${sizeMb} MB)</span>
          </div>
          <button type="button" class="text-xs text-[#3B5BDB] hover:underline shrink-0" onclick="window.app.previewDoc('${file.name}', 'Uploaded Document')">
            Preview
          </button>
        </div>
      `;
      lucide.createIcons({ root: box });
    }
  }

  handleProofSubmit(e, trainingId) {
    e.preventDefault();
    const learnings = document.getElementById('proof-learnings').value;
    const attInput = document.getElementById('proof-attendance-file');
    const certInput = document.getElementById('proof-cert-file');

    const attName = attInput.files[0] ? attInput.files[0].name : 'Attendance_Verified.pdf';
    const certName = certInput.files[0] ? certInput.files[0].name : 'Certificate_Completion.pdf';

    store.submitTrainingProof(trainingId, {
      learnings,
      attendanceFile: attName,
      attendanceSize: '1.2 MB',
      certificateFile: certName,
      certificateSize: '2.5 MB'
    });

    document.getElementById('proof-drawer-overlay').classList.remove('open');
    showToast('Completion proof submitted! Status flipped to Pending Sign-off (7-day review active).', 'success');
  }

  // Head Proof Review Drawer
  openReviewDrawer(trainingId) {
    const trn = store.state.trainings.find(t => t.id === trainingId);
    if (!trn) return;

    const overlay = document.getElementById('proof-drawer-overlay');
    const titleEl = document.getElementById('proof-drawer-title');
    const bodyEl = document.getElementById('proof-drawer-body');

    titleEl.textContent = `Review: ${trn.userName} — ${trn.title}`;
    bodyEl.innerHTML = `
      <div class="space-y-4 text-xs">
        <div class="flex items-center justify-between p-2.5 bg-[#F7F6F3] border border-[#E4E1DA] rounded">
          <div>
            <span class="text-gray-400 block text-[10px]">Submitted Date</span>
            <span class="font-bold text-[#14181F]">${trn.submissionDate}</span>
          </div>
          <div>
            <span class="text-gray-400 block text-[10px]">Deadline SLA</span>
            ${getCountdownPill(trn.daysElapsed)}
          </div>
        </div>

        <div>
          <span class="font-semibold text-[#14181F] uppercase text-[11px] block mb-1">Key Learnings</span>
          <div class="p-3 bg-white border border-[#E4E1DA] rounded text-gray-700 leading-relaxed">
            ${trn.proof ? trn.proof.learnings : 'No learnings text recorded.'}
          </div>
        </div>

        <div>
          <span class="font-semibold text-[#14181F] uppercase text-[11px] block mb-1">Submitted Attachments</span>
          <div class="space-y-2">
            <div class="doc-preview-card">
              <div class="flex items-center gap-2">
                <i data-lucide="file-check" class="w-4 h-4 text-[#2F7D5A]"></i>
                <span class="font-bold text-gray-800">${trn.proof ? trn.proof.attendanceFile : 'Attendance_Sheet.pdf'}</span>
              </div>
              <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.previewDoc('${trn.proof ? trn.proof.attendanceFile : 'Attendance_Sheet.pdf'}', 'Attendance Sheet')">Preview</button>
            </div>
            <div class="doc-preview-card">
              <div class="flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-[#B8860B]"></i>
                <span class="font-bold text-gray-800">${trn.proof ? trn.proof.certificateFile : 'Certificate.pdf'}</span>
              </div>
              <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.previewDoc('${trn.proof ? trn.proof.certificateFile : 'Certificate.pdf'}', 'Certificate')">Preview</button>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-[#E4E1DA] space-y-3">
          <div>
            <label class="block font-semibold text-[#14181F] mb-1">Head Remarks / Resubmission Reason</label>
            <textarea id="head-review-notes" rows="2" class="ops-textarea" placeholder="Enter feedback or required revisions if sending back..."></textarea>
          </div>
          <div class="flex items-center justify-end gap-2">
            <button class="btn-ops-danger" onclick="window.app.handleSendBack('${trn.id}')">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
              Send Back for Resubmission
            </button>
            <button class="btn-ops-success" onclick="window.app.handleApproveSignoff('${trn.id}')">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
              Approve Sign-Off
            </button>
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('open');
    lucide.createIcons({ root: bodyEl });
  }

  handleApproveSignoff(trainingId) {
    const notes = document.getElementById('head-review-notes')?.value || '';
    store.approveSignoff(trainingId, notes);
    document.getElementById('proof-drawer-overlay').classList.remove('open');
    showToast('Training completion approved and signed off!', 'success');
    if (typeof confetti === 'function') {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    }
  }

  handleSendBack(trainingId) {
    const reason = document.getElementById('head-review-notes')?.value.trim();
    if (!reason) {
      alert("A reason is required to send back proof for resubmission.");
      return;
    }
    store.resubmitSignoff(trainingId, reason);
    document.getElementById('proof-drawer-overlay').classList.remove('open');
    showToast('Proof sent back to employee for resubmission.', 'warning');
  }

  viewProofModal(trainingId) {
    const trn = store.state.trainings.find(t => t.id === trainingId);
    if (!trn || !trn.proof) {
      showToast("No proof documents available for this course.", "info");
      return;
    }
    this.previewDoc(trn.proof.certificateFile, trn.title, trn.id);
  }

  previewDoc(filename, docType, trainingId = null) {
    const modal = document.getElementById('doc-preview-modal');
    const fnEl = document.getElementById('doc-preview-filename');
    const bodyEl = document.getElementById('doc-preview-body');

    if (fnEl) fnEl.textContent = filename || 'Verified_Document.pdf';

    const trn = trainingId 
      ? store.state.trainings.find(t => t.id === trainingId) 
      : (store.state.trainings.find(t => t.proof && (t.proof.certificateFile === filename || t.proof.attendanceFile === filename)) || store.state.trainings[0]);

    const fnLower = (filename || '').toLowerCase();
    const dtLower = (docType || '').toLowerCase();
    const isCert = dtLower.includes('cert') || fnLower.includes('cert');
    const isAttendance = dtLower.includes('attend') || fnLower.includes('attend');

    if (isCert) {
      bodyEl.innerHTML = `
        <div class="certificate-container p-6 rounded bg-white max-w-xl mx-auto select-none">
          <div class="certificate-inner flex flex-col items-center text-center">
            
            <!-- UltraTech Header -->
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-[#14181F] text-white rounded flex items-center justify-center font-black text-xs">UT</div>
              <span class="font-black tracking-wider text-xs text-[#14181F] uppercase">UltraTech Environmental Consultancy & Laboratory</span>
            </div>
            
            <p class="text-[9px] text-gray-500 uppercase tracking-widest font-bold">QCI / NABL Accredited Environmental Testing Facility</p>

            <div class="my-4">
              <span class="text-xs uppercase tracking-widest text-[#B8860B] font-extrabold">Certificate of Technical Competency</span>
              <div class="w-28 h-0.5 bg-[#B8860B] mx-auto mt-1"></div>
            </div>

            <p class="text-xs text-gray-500">This is proudly awarded to</p>
            <h3 class="text-lg font-extrabold text-[#14181F] my-1 tracking-tight">${trn ? trn.userName : 'Rahul Sharma'}</h3>
            <p class="text-xs text-gray-600 font-medium">${trn ? trn.department : 'Environmental Media Monitoring & Lab Analysis'}</p>

            <p class="text-xs text-gray-500 mt-3 max-w-md">for verified proficiency, test method standardization, and completion of</p>
            <h4 class="text-xs font-bold text-[#3B5BDB] my-1 max-w-md">${trn ? trn.title : docType}</h4>

            <div class="flex flex-wrap items-center justify-center gap-4 my-4 text-[10px] text-gray-500 bg-[#FBFBFA] p-2 rounded border border-[#E4E1DA] w-full">
              <span>Date: <strong class="text-gray-800">${trn ? (trn.completedDate || trn.scheduledDate) : '2026-08-30'}</strong></span>
              <span>Accreditation: <strong class="text-gray-800">ISO/IEC 17025:2017</strong></span>
              <span>Serial: <strong class="font-mono text-gray-800">UT-CERT-2026-${Math.floor(1000 + Math.random()*9000)}</strong></span>
            </div>

            <!-- Signatures & Seal -->
            <div class="w-full grid grid-cols-3 items-end pt-3 mt-1 border-t border-dashed border-gray-300">
              <div class="text-center">
                <div class="italic text-xs text-gray-800 font-bold mb-1">Priya Nair</div>
                <div class="text-[8px] text-gray-500 uppercase font-semibold border-t border-gray-400 pt-0.5">Head of Department</div>
              </div>

              <div class="flex justify-center">
                <div class="certificate-seal">
                  <span>ULTRATECH</span>
                  <span class="text-[7px]">VERIFIED</span>
                  <i data-lucide="award" class="w-3 h-3 text-[#B8860B] mt-0.5"></i>
                </div>
              </div>

              <div class="text-center">
                <div class="italic text-xs text-gray-800 font-bold mb-1">Vikram Seth</div>
                <div class="text-[8px] text-gray-500 uppercase font-semibold border-t border-gray-400 pt-0.5">Director - People & Quality</div>
              </div>
            </div>

          </div>
        </div>
      `;
    } else if (isAttendance) {
      bodyEl.innerHTML = `
        <div class="attendance-sheet-preview p-5 bg-white rounded border border-[#CBD5E1] max-w-xl mx-auto space-y-3 select-none">
          <div class="flex items-center justify-between pb-2 border-b border-[#CBD5E1]">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 bg-[#14181F] text-white rounded flex items-center justify-center font-bold text-xs">UT</div>
              <div>
                <h4 class="font-bold text-xs text-[#14181F] leading-none">ULTRATECH ENVIRONMENTAL CONSULTANCY</h4>
                <span class="text-[9px] text-gray-500 uppercase">Training Attendance & Session Verification Log</span>
              </div>
            </div>
            <span class="status-pill status-completed text-[10px]">Verified Session</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px] bg-gray-50 p-2.5 rounded border border-[#E4E1DA]">
            <div><span class="text-gray-400">Program:</span> <strong class="text-gray-800 block truncate">${trn ? trn.title : 'Technical Workshop'}</strong></div>
            <div><span class="text-gray-400">Batch Code:</span> <strong class="font-mono text-gray-800 block">UT-SEP26-BATCH04</strong></div>
            <div><span class="text-gray-400">Venue:</span> <span class="text-gray-800">${trn ? trn.venue : 'Central Lab'}</span></div>
            <div><span class="text-gray-400">Session Hours:</span> <span class="text-gray-800 font-semibold">16 Contact Hours</span></div>
          </div>

          <table class="w-full text-[11px] border border-[#CBD5E1] rounded mt-2">
            <thead class="bg-gray-100 text-gray-700 text-[10px] uppercase font-bold">
              <tr>
                <th class="p-2 text-left border-b border-[#CBD5E1]">Employee Name</th>
                <th class="p-2 text-left border-b border-[#CBD5E1]">Department</th>
                <th class="p-2 text-center border-b border-[#CBD5E1]">Day 1 (Theory)</th>
                <th class="p-2 text-center border-b border-[#CBD5E1]">Day 2 (Lab)</th>
                <th class="p-2 text-center border-b border-[#CBD5E1]">Attendee Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white">
                <td class="p-2 border-b border-gray-100 font-bold text-[#14181F]">${trn ? trn.userName : 'Rahul Sharma'}</td>
                <td class="p-2 border-b border-gray-100 text-gray-500">${trn ? trn.department : 'Lab'}</td>
                <td class="p-2 border-b border-gray-100 text-center text-[#2F7D5A] font-bold">✓ 09:00–17:30</td>
                <td class="p-2 border-b border-gray-100 text-center text-[#2F7D5A] font-bold">✓ 09:00–17:30</td>
                <td class="p-2 border-b border-gray-100 text-center italic font-bold text-gray-700">R. Sharma</td>
              </tr>
            </tbody>
          </table>

          <div class="flex items-center justify-between pt-2 border-t border-[#CBD5E1] text-[10px] text-gray-500">
            <span>Trainer Endorsement: <strong>Dr. K.V. Ramanathan (Lead Assessor)</strong></span>
            <span class="text-[#2F7D5A] font-bold flex items-center gap-1">
              <i data-lucide="check-check" class="w-3.5 h-3.5"></i> Counter-signed by HOD
            </span>
          </div>
        </div>
      `;
    } else {
      bodyEl.innerHTML = `
        <div class="p-8 bg-white border border-[#E4E1DA] rounded text-center max-w-md mx-auto space-y-3">
          <i data-lucide="file-check-2" class="w-10 h-10 text-[#2F7D5A] mx-auto"></i>
          <h4 class="font-bold text-sm text-[#14181F]">${filename}</h4>
          <p class="text-xs text-gray-500">Verified Technical Record • UltraTech Environmental Consultancy</p>
          <div class="p-3 bg-gray-50 rounded text-xs text-gray-600 text-left">
            "Record archived in compliance with ISO 17025:2017 Section 8.4 control of records and internal quality auditing standards."
          </div>
        </div>
      `;
    }

    modal?.classList.add('open');
    lucide.createIcons({ root: bodyEl });
  }

  // Employee Request Submit
  handleEmployeeRequestSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('req-training-title').value;
    const category = document.getElementById('req-category').value;
    const mode = document.getElementById('req-mode').value;
    const justification = document.getElementById('req-justification').value;
    const user = store.getCurrentUser();

    store.submitRequest({
      applicantId: user.id,
      applicantName: user.name,
      departmentId: user.departmentId,
      department: user.department,
      designation: user.position,
      headId: user.headId,
      headName: user.headName,
      trainingTitle: title,
      category,
      mode,
      justification,
      type: 'Self'
    });

    document.getElementById('employee-request-form').reset();
    showToast(`Request for "${title}" submitted to ${user.headName}!`, 'success');
  }

  // Team Request Submit by Head
  handleTeamRequestSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('team-training-title').value;
    const category = document.getElementById('team-category').value;
    const mode = document.getElementById('team-mode').value;
    const justification = document.getElementById('team-justification').value;
    const user = store.getCurrentUser();

    const selectedCheckboxes = document.querySelectorAll('input[name="team-nominee"]:checked');
    if (selectedCheckboxes.length === 0) {
      alert("Please select at least one employee from your department for team nomination.");
      return;
    }

    const targetEmployees = Array.from(selectedCheckboxes).map(cb => {
      const u = store.state.users.find(usr => usr.id === cb.value);
      return { id: u.id, name: u.name };
    });

    store.submitRequest({
      applicantId: user.id,
      applicantName: `${user.name} (HOD)`,
      departmentId: user.departmentId,
      department: user.department,
      designation: user.position,
      headId: user.headId,
      headName: user.headName,
      trainingTitle: title,
      category,
      mode,
      justification,
      targetEmployees,
      type: 'Team'
    });

    showToast(`Team batch nomination (${targetEmployees.length} nominees) submitted to HR!`, 'success');
  }

  // Escalation Modal
  openEscalateModal(requestId, trainingTitle) {
    const modal = document.getElementById('escalate-modal-overlay');
    const summary = document.getElementById('escalate-context-summary');
    const input = document.getElementById('escalate-note-input');

    summary.innerHTML = `<strong>Training Requested:</strong> ${unescape(trainingTitle)}<br><span class="text-gray-500">ID: ${requestId}</span>`;
    input.value = '';
    modal.setAttribute('data-req-id', requestId);
    modal.classList.add('open');

    // Confirm button event
    document.getElementById('btn-confirm-escalate').onclick = () => {
      const note = input.value.trim();
      if (!note) {
        document.getElementById('escalate-error-msg').classList.remove('hidden');
        return;
      }
      document.getElementById('escalate-error-msg').classList.add('hidden');
      store.escalateRequest(requestId, note);
      modal.classList.remove('open');
      showToast("Appeal escalated to Corporate HR review board.", "warning");
    };
  }

  // HR Controls
  toggleCycle() {
    const isOpen = store.toggleCycle();
    showToast(`Training Cycle ${isOpen ? 'Opened' : 'Closed'}. Automated broadcast notification triggered.`, 'info');
  }

  sendReminder(deptId) {
    store.sendDepartmentReminder(deptId);
    showToast("Deadline reminder notification sent to Department Head.", "success");
  }

  approveRequest(id) {
    store.approveRequest(id);
    showToast("Training nomination approved!", "success");
  }

  rejectRequestPrompt(id) {
    const reason = prompt("Enter required reason for rejection:");
    if (!reason) return;
    store.rejectRequest(id, reason);
    showToast("Request rejected with explanation logged.", "info");
  }

  toggleSelectAllCommon(checked) {
    document.querySelectorAll('input[name="bulk-req-check"]').forEach(cb => cb.checked = checked);
  }

  handleBulkApproveCommon() {
    const selected = Array.from(document.querySelectorAll('input[name="bulk-req-check"]:checked')).map(cb => cb.value);
    if (selected.length === 0) {
      alert("Select at least one common training request from the table to bulk-approve.");
      return;
    }
    const count = store.bulkApproveCommonRequests(selected);
    showToast(`Batch approved ${count} common training nominations across departments!`, 'success');
  }

  openCreateEventModal() {
    document.getElementById('create-event-modal')?.classList.add('open');
  }

  openAssignCandidatesModal(eventId) {
    const evt = store.state.events.find(e => e.id === eventId);
    if (!evt) return;

    const availableUsers = store.state.users.filter(u => !evt.assignedUserIds.includes(u.id));
    if (availableUsers.length === 0) {
      alert("All active candidates have already been assigned to this training session.");
      return;
    }

    const candidatePrompt = availableUsers.map((u, i) => `${i + 1}. ${u.name} (${u.department})`).join('\n');
    const choice = prompt(`Select candidate number to allocate to "${evt.title}":\n\n${candidatePrompt}`);
    const index = parseInt(choice, 10) - 1;

    if (!isNaN(index) && availableUsers[index]) {
      store.assignEmployeesToEvent(eventId, [availableUsers[index].id]);
      showToast(`${availableUsers[index].name} allocated to event!`, 'success');
    }
  }

  resolveEscalationItem(itemId, type, resolution) {
    const notes = prompt(`Enter ${resolution} notes for this executive escalation review:`, `Reviewed and ratified by Corporate HR.`);
    if (notes !== null) {
      store.resolveEscalation(itemId, type, resolution, notes);
      showToast(`Escalation resolved (${resolution}).`, 'success');
    }
  }

  openPromotionModal(userId) {
    const user = store.state.users.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('promotion-modal');
    const summary = document.getElementById('prm-candidate-summary');
    const notesInput = document.getElementById('prm-notes-input');

    summary.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="font-bold text-[#14181F]">${user.name}</span>
        <span class="text-gray-500">• ${user.position}</span>
      </div>
      <div class="text-[11px] text-gray-500 mt-1">
        Department: ${user.department} • Tenure: ${user.tenureYears} yrs • Completed: ${user.completedCount || 0} trainings
      </div>
    `;
    notesInput.value = '';

    modal.classList.add('open');

    document.getElementById('btn-confirm-prm').onclick = () => {
      const category = document.getElementById('prm-category-select').value;
      const notes = notesInput.value.trim();
      store.flagForPromotion(userId, { category, notes });
      modal.classList.remove('open');
      showToast(`${user.name} shortlisted for ${category}!`, 'success');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    };
  }

  viewEmployeeDetailModal(userId) {
    const user = store.state.users.find(u => u.id === userId);
    if (!user) return;

    const empTrainings = store.state.trainings.filter(t => t.userId === user.id);

    const overlay = document.getElementById('proof-drawer-overlay');
    const titleEl = document.getElementById('proof-drawer-title');
    const bodyEl = document.getElementById('proof-drawer-body');

    titleEl.textContent = `Personnel Record: ${user.name}`;
    bodyEl.innerHTML = `
      <div class="space-y-4 text-xs">
        <div class="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded space-y-1">
          <div class="font-bold text-sm text-[#14181F]">${user.name}</div>
          <div class="text-gray-600">${user.position} • ${user.department}</div>
          <div class="text-gray-500 text-[11px]">Tenure: ${user.tenureYears} Years • Reporting Head: ${user.headName}</div>
          <div class="text-[10px] text-[#2F7D5A] font-semibold pt-1">
            ✓ Strictly Zero Compensation Data Kept in Training Ops Record
          </div>
        </div>

        <div>
          <span class="font-bold uppercase text-[11px] text-gray-500 block mb-1">Technical Skills & NABL Matrix</span>
          <div class="flex flex-wrap gap-1">
            ${user.skills ? user.skills.map(s => `<span class="bg-white border border-[#E4E1DA] px-2 py-0.5 rounded">${s}</span>`).join('') : ''}
          </div>
        </div>

        <div>
          <span class="font-bold uppercase text-[11px] text-gray-500 block mb-1">Key Handled Projects</span>
          <div class="space-y-1">
            ${user.projects ? user.projects.map(p => `
              <div class="p-2 bg-white border border-[#E4E1DA] rounded text-[11px]">${p}</div>
            `).join('') : ''}
          </div>
        </div>

        <div>
          <span class="font-bold uppercase text-[11px] text-gray-500 block mb-1">Training History (${empTrainings.length})</span>
          <div class="space-y-1.5 max-h-48 overflow-y-auto">
            ${empTrainings.map(t => `
              <div class="p-2 bg-white border border-[#E4E1DA] rounded flex items-center justify-between">
                <div>
                  <span class="font-semibold text-[#14181F] block">${t.title}</span>
                  <span class="text-[10px] text-gray-400">${t.category} • ${t.scheduledDate}</span>
                </div>
                ${getStatusPill(t.status)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    overlay.classList.add('open');
    lucide.createIcons({ root: bodyEl });
  }

  // Export handlers with strict zero compensation guarantees
  exportFullTrainingCSV() {
    const rows = [
      ["Training ID", "Participant", "Department", "Title", "Category", "Mode", "Date", "Status", "Provider", "Sign-Off Authority"]
    ];

    store.state.trainings.forEach(t => {
      rows.push([
        t.id,
        `"${t.userName}"`,
        `"${t.department}"`,
        `"${t.title}"`,
        `"${t.category}"`,
        `"${t.mode}"`,
        t.scheduledDate,
        t.status,
        `"${t.provider || ''}"`,
        `"${t.signedOffBy || 'Pending'}"`
      ]);
    });

    this.downloadCSV(rows, `UltraTech_Training_Roster_${new Date().toISOString().split('T')[0]}.csv`);
  }

  exportTeamCSV() {
    const user = store.getCurrentUser();
    const directReports = store.state.users.filter(u => u.headId === user.id);
    const rows = [
      ["Employee ID", "Name", "Department", "Position", "Tenure (Years)", "Completed Verified Trainings"]
    ];

    directReports.forEach(emp => {
      rows.push([
        emp.id,
        `"${emp.name}"`,
        `"${emp.department}"`,
        `"${emp.position}"`,
        emp.tenureYears,
        emp.completedCount || 0
      ]);
    });

    this.downloadCSV(rows, `${user.department.replace(/\s+/g, '_')}_Team_Roster.csv`);
  }

  exportPromotionsCSV() {
    const rows = [
      ["Flag ID", "Candidate", "Department", "Tenure (Years)", "Completions", "Track / Category", "Flagged By", "Status", "Justification Notes"]
    ];

    store.state.promotionFlags.forEach(f => {
      rows.push([
        f.id,
        `"${f.userName}"`,
        `"${f.department}"`,
        f.tenureYears,
        f.completedTrainings,
        `"${f.category}"`,
        `"${f.flaggedBy}"`,
        f.status,
        `"${(f.notes || '').replace(/"/g, '""')}"`
      ]);
    });

    this.downloadCSV(rows, `UltraTech_Promotion_Awards_Shortlist.csv`);
  }

  downloadCSV(rows, filename) {
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Exported ${filename} successfully! (Structurally Zero Compensation Fields)`, 'success');
  }

  filterTeamReport() {
    const tenureVal = document.getElementById('head-report-filter-tenure')?.value;
    const compVal = document.getElementById('head-report-filter-completions')?.value;
    const user = store.getCurrentUser();
    
    let filtered = store.state.users.filter(u => u.headId === user.id);
    if (tenureVal !== 'all') {
      filtered = filtered.filter(u => u.tenureYears >= parseFloat(tenureVal));
    }
    if (compVal !== 'all') {
      filtered = filtered.filter(u => (u.completedCount || 0) >= parseInt(compVal, 10));
    }

    const tbody = document.getElementById('team-report-tbody');
    if (!tbody) return;

    tbody.innerHTML = filtered.map(emp => {
      const flag = store.state.promotionFlags.find(f => f.userId === emp.id);
      return `
        <tr>
          <td class="font-bold text-xs text-[#14181F]">${emp.name}</td>
          <td class="text-xs text-gray-700">${emp.position}</td>
          <td class="tabular-nums font-semibold text-xs text-gray-800">${emp.tenureYears} yrs</td>
          <td class="tabular-nums font-bold text-xs text-[#2F7D5A]">${emp.completedCount || 0} verified</td>
          <td>
            <div class="flex flex-wrap gap-1">
              ${emp.skills ? emp.skills.slice(0, 2).map(s => `
                <span class="text-[10px] bg-[#F7F6F3] border border-[#E4E1DA] px-1 py-0.5 rounded">${s}</span>
              `).join('') : ''}
            </div>
          </td>
          <td class="max-w-xs">
            ${flag ? `
              <div class="text-[11px] text-gray-600 line-clamp-1 hover:line-clamp-none cursor-pointer" title="${flag.notes}">
                <strong>[${flag.category}]</strong> ${flag.notes}
              </div>
            ` : `
              <span class="text-xs text-gray-400">No notes flagged</span>
            `}
          </td>
          <td>
            <button class="btn-ops-secondary py-1 px-2 text-[11px]" onclick="window.app.openPromotionModal('${emp.id}')">
              <i data-lucide="award" class="w-3 h-3 text-[#B8860B]"></i>
              ${flag ? 'Update Flag' : 'Flag for Award'}
            </button>
          </td>
        </tr>
      `;
    }).join('');

    lucide.createIcons({ root: tbody });
  }

  markAllRead() {
    store.markAllNotificationsRead();
    showToast("All notifications marked as read", "success");
  }
}

// Instantiate and bind to window for inline onclick handlers
window.app = new App();
