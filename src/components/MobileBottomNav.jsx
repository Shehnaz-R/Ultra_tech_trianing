
export function MobileBottomNav() {
  const { state, store } = useStore();

  const getMobileItems = () => {
    switch (state.currentRole) {
      case 'employee':
        return [
          { view: 'employee-home', label: 'Home', icon: 'home' },
          { view: 'employee-profile', label: 'Profile', icon: 'user' },
          { view: 'employee-trainings', label: 'Trainings', icon: 'graduation-cap' },
          { view: 'employee-request', label: 'Request', icon: 'send' },
          { view: 'employee-notifications', label: 'Notifs', icon: 'bell' },
        ];
      case 'head':
        return [
          { view: 'head-home', label: 'Home', icon: 'home' },
          { view: 'head-signoffs', label: 'Sign-Offs', icon: 'clock' },
          { view: 'head-team', label: 'Team', icon: 'users' },
          { view: 'head-reports', label: 'Reports', icon: 'bar-chart-3' },
        ];
      case 'hr':
      default:
        return [
          { view: 'hr-home', label: 'Home', icon: 'home' },
          { view: 'hr-requests', label: 'Requests', icon: 'layers' },
          { view: 'hr-calendar', label: 'Calendar', icon: 'calendar' },
          { view: 'hr-directory', label: 'Directory', icon: 'book-open' },
          { view: 'hr-escalations', label: 'Escalations', icon: 'alert-triangle' },
        ];
    }
  };

  const items = getMobileItems();

  return (
    <nav id="mobile-bottom-nav" className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-[#E4E1DA] flex items-center justify-around z-30 px-1 py-1 shadow-md">
      {items.map((item) => {
        const isActive = state.currentView === item.view;
        return (
          <button
            key={item.view}
            onClick={() => store.setView(item.view)}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-[#3B5BDB]' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Icon name={item.icon} className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#3B5BDB]' : 'text-gray-400'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
