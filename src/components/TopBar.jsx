
const { useState, useRef, useEffect } = React;

export function TopBar({ onToggleSidebar }) {
  const { state, store, currentUser, scopeInfo, unreadCount, openModal, openDrawer } = useStore();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetDemo = () => {
    if (window.confirm("Reset the portal state to the pre-seeded demo dataset?")) {
      store.resetState();
      showToast("Demo dataset restored to initial state.", "success");
    }
  };

  const handleDeptFilter = (deptId) => {
    store.setDepartmentFilter(deptId);
    showToast(`Filtered by: ${deptId === 'all' ? 'All Departments' : deptId}`, 'info');
  };

  const handleBranchFilter = (branch) => {
    showToast(`Branch filter updated to: ${branch}`, 'info');
  };

  return (
    <header id="topbar" className="h-14 bg-white border-b border-[#E4E1DA] flex items-center justify-between px-4 z-30 shrink-0 select-none">
      {/* Brand & Portal Name */}
      <div className="flex items-center gap-3">
        <button 
          id="btn-toggle-sidebar" 
          onClick={onToggleSidebar}
          className="p-1.5 text-gray-500 hover:text-black rounded hover:bg-gray-100 lg:hidden" 
          title="Toggle Navigation"
        >
          <Icon name="menu" className="w-5 h-5" />
        </button>
        
        <a 
          href="https://ultratech.in" 
          target="_blank" 
          rel="noopener" 
          className="flex items-center gap-2.5 group" 
          title="Visit UltraTech Environmental Consultancy Website"
        >
          <div className="w-8 h-8 bg-[#14181F] text-white rounded flex items-center justify-center font-black text-xs tracking-wider group-hover:bg-[#2F7D5A] transition-colors">
            UT
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#14181F] leading-tight flex items-center gap-1.5">
              UltraTech
              <span className="text-[10px] font-medium bg-[#EDF7F2] text-[#2F7D5A] border border-[#A3D9C1] px-1.5 py-0.2 rounded">Ops Portal</span>
            </span>
            <span className="text-[10px] text-gray-500 font-normal">Environmental Consultancy & Lab</span>
          </div>
        </a>

        {/* Scope Indicator Separator */}
        <div className="hidden md:block h-6 w-[1px] bg-[#E4E1DA] mx-1"></div>

        {/* Persistent Scope Indicator */}
        <div id="scope-indicator-container" className="hidden sm:flex items-center gap-2 bg-[#F7F6F3] border border-[#E4E1DA] px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-[#3B5BDB]"></span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider" id="scope-badge">Scope:</span>
          <span className="text-xs font-semibold text-[#14181F] truncate max-w-[220px]" id="scope-text">{scopeInfo.scope}</span>
        </div>

        {/* HR / Admin Global Filter Dropdowns */}
        <div id="hr-global-filters" className={`${state.currentRole === 'hr' ? 'flex' : 'hidden'} items-center gap-2 ml-2`}>
          <div className="flex items-center gap-1 bg-white border border-[#E4E1DA] px-2 py-1 rounded shadow-xs">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Dept:</span>
            <select 
              id="topbar-dept-filter" 
              value={state.activeDepartmentFilter}
              onChange={(e) => handleDeptFilter(e.target.value)}
              className="text-xs font-semibold text-[#14181F] bg-transparent outline-none cursor-pointer max-w-[180px]"
            >
              <option value="all">All 12 Departments</option>
              {state.departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E4E1DA] px-2 py-1 rounded shadow-xs">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Branch:</span>
            <select 
              id="topbar-branch-filter" 
              defaultValue="all"
              onChange={(e) => handleBranchFilter(e.target.value)}
              className="text-xs font-semibold text-[#14181F] bg-transparent outline-none cursor-pointer"
            >
              <option value="all">All Branches</option>
              <option value="Thane">Thane (HQ & Central Lab)</option>
              <option value="Pune">Pune Branch</option>
              <option value="Kochi">Kochi Lab</option>
              <option value="Kolkata">Kolkata Regional Office</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Reset Demo State Button */}
        <button 
          id="btn-reset-demo" 
          onClick={handleResetDemo}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-gray-700 bg-white border border-[#E4E1DA] hover:bg-gray-50 hover:text-black rounded-md transition-all shadow-xs cursor-pointer" 
          title="Reset dataset to initial state"
        >
          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </button>

        {/* Notification Bell with Unread Badge */}
        <button 
          id="btn-notifications-drawer" 
          onClick={() => openDrawer('notifications')}
          className="relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer" 
          title="View Notifications"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span id="topbar-unread-badge" className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#C92A2A] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Profile Icon & Role Switcher Menu */}
        <div className="relative" id="profile-menu-container" ref={dropdownRef}>
          <button 
            id="topbar-profile-btn" 
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg hover:bg-gray-100 border border-transparent hover:border-[#E4E1DA] transition-all cursor-pointer select-none"
          >
            <div id="topbar-user-avatar" className="w-8 h-8 rounded-full bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center border border-gray-300 overflow-hidden shadow-sm shrink-0">
              {currentUser.avatarInitials || 'RS'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span id="topbar-user-name" className="text-xs font-bold text-[#14181F]">{currentUser.name}</span>
              <span id="topbar-user-role-label" className="text-[10px] text-gray-500 font-medium capitalize">{state.currentRole}</span>
            </div>
            <svg className="w-3.5 h-3.5 text-gray-500 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div 
            id="profile-dropdown-menu" 
            className={`${profileDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-1.5 w-60 bg-white border border-[#E4E1DA] rounded-lg shadow-xl z-50 divide-y divide-[#EFECE6] text-xs`}
          >
            <div className="p-3.5 space-y-0.5">
              <p id="dropdown-user-name" className="font-bold text-sm text-[#14181F]">{currentUser.name}</p>
              <p id="dropdown-user-email" className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              <p className="text-[11px] text-[#2563EB] font-semibold pt-0.5">UNAUTH_PROBE</p>
            </div>

            <div className="p-2">
              <button 
                id="btn-open-manual-login" 
                onClick={() => {
                  setProfileDropdownOpen(false);
                  openModal('login');
                }}
                className="w-full text-left px-2.5 py-2 rounded hover:bg-gray-100 flex items-center gap-2.5 text-xs font-semibold text-gray-800 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Manual Login / Key Auth</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
