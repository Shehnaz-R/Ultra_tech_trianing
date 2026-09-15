
export function Sidebar({ isOpen, onClose }) {
  const { state, store, currentUser } = useStore();

  const getNavItems = () => {
    switch (state.currentRole) {
      case 'employee': {
        const inProgressCount = state.trainings.filter(t => t.userId === currentUser.id && t.status === 'In Progress').length;
        const unread = store.getUnreadCount();
        return [
          { view: 'employee-home', label: 'Home', icon: 'home' },
          { view: 'employee-profile', label: 'My Profile', icon: 'user' },
          { view: 'employee-trainings', label: 'My Trainings', icon: 'graduation-cap', badge: inProgressCount || null },
          { view: 'employee-request', label: 'Request Training', icon: 'file-plus' },
          { view: 'employee-notifications', label: 'Notifications', icon: 'bell', badge: unread || null, badgeAlert: unread > 0 },
        ];
      }
      case 'head': {
        const pendingSignoffsCount = state.trainings.filter(t => t.department === currentUser.department && t.status === 'Pending Sign-off' && (t.daysElapsed || 0) < 7).length;
        const unread = store.getUnreadCount();
        return [
          { view: 'head-home', label: 'Home', icon: 'home' },
          { view: 'head-profile', label: 'My Profile', icon: 'user' },
          { view: 'head-trainings', label: 'My Trainings', icon: 'graduation-cap' },
          { view: 'head-request', label: 'Request Training', icon: 'file-plus' },
          { view: 'head-team', label: 'Team', icon: 'users' },
          { view: 'head-signoffs', label: 'Sign-Off Queue', icon: 'clock', badge: pendingSignoffsCount || null, badgeAlert: pendingSignoffsCount > 0 },
          { view: 'head-request-status', label: 'Training Requested Status', icon: 'hourglass' },
          { view: 'head-reports', label: 'Team Reports & Awards', icon: 'bar-chart-2' },
          { view: 'head-notifications', label: 'Notifications', icon: 'bell', badge: unread || null, badgeAlert: unread > 0 },
        ];
      }
      case 'hr':
      default: {
        const openEscalationsCount = state.trainings.filter(t => t.status === 'Escalated').length + state.requests.filter(r => r.status === 'Escalated').length;
        const pendingRequestsCount = state.requests.filter(r => r.status === 'Pending HR Approval' || r.status === 'Pending Head Review').length;
        return [
          { view: 'hr-home', label: 'Home', icon: 'home' },
          { view: 'hr-profile', label: 'My Profile', icon: 'user' },
          { view: 'hr-cycle', label: 'Cycle Control', icon: 'refresh-cw' },
          { view: 'hr-requests', label: 'Requests Consolidation', icon: 'layers', badge: pendingRequestsCount || null },
          { view: 'hr-calendar', label: 'Calendar & Allocation', icon: 'calendar' },
          { view: 'hr-directory', label: 'Employee Directory', icon: 'book-open' },
          { view: 'hr-escalations', label: 'Escalations Hub', icon: 'alert-triangle', badge: openEscalationsCount || null, badgeAlert: openEscalationsCount > 0 },
          { view: 'hr-promotions', label: 'Promotions & Awards', icon: 'award' },
          { view: 'hr-reports', label: 'Reports & Export', icon: 'file-text' },
        ];
      }
    }
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (state.currentRole) {
      case 'head': return 'Department Head View';
      case 'hr': return 'Corporate HR Admin View';
      case 'employee':
      default: return 'Employee View';
    }
  };

  return (
    <aside 
      id="sidebar" 
      className={`w-60 bg-white border-r border-[#E4E1DA] flex flex-col shrink-0 z-20 transition-all duration-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } absolute lg:relative h-full shadow-lg lg:shadow-none`}
    >
      {/* Role Badge Header */}
      <div className="p-3 border-b border-[#E4E1DA] bg-[#FBFBFA] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Navigation Menu</span>
          <div id="sidebar-role-indicator" className="text-xs font-bold text-[#14181F] flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${state.currentRole === 'head' ? 'bg-[#B8860B]' : state.currentRole === 'hr' ? 'bg-[#3B5BDB]' : 'bg-[#2F7D5A]'}`}></span>
            <span>{getRoleBadge()}</span>
          </div>
        </div>
        <button id="btn-close-sidebar" onClick={onClose} className="p-1 text-gray-400 hover:text-black lg:hidden">
          <Icon name="x" className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav id="sidebar-nav" className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = state.currentView === item.view;
          const activeClass = isActive 
            ? 'bg-[#F2EFE9] text-[#14181F] font-semibold border-l-2 border-[#3B5BDB]' 
            : 'text-gray-600 hover:text-black hover:bg-[#FBFBFA] font-medium';

          return (
            <button
              key={item.view}
              data-view={item.view}
              onClick={() => {
                store.setView(item.view);
                if (onClose) onClose();
              }}
              className={`nav-link w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between ${activeClass} transition-colors cursor-pointer`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon name={item.icon} className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#3B5BDB]' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge ? (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  item.badgeAlert ? 'bg-[#FEE2E2] text-[#991B1B]' : 'bg-[#F1F5F9] text-gray-600'
                }`}>
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#E4E1DA] bg-[#FBFBFA] text-[11px] text-gray-500 space-y-1">
        <div className="flex items-center justify-between font-medium text-gray-700">
          <span>Active Cycle</span>
          <span className="status-pill status-in-progress" id="sidebar-cycle-pill">
            {state.cycle && state.cycle.isOpen ? 'CYCLE OPEN' : 'CYCLE CLOSED'}
          </span>
        </div>
        <div className="text-[10px] text-gray-400 pt-0.5">
          UltraTech Internal Ops Board v2.4
        </div>
      </div>
    </aside>
  );
}
