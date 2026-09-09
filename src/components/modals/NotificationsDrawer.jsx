
export function NotificationsDrawer() {
  const { state, store, activeDrawer, closeDrawer, currentUser } = useStore();
  const isOpen = activeDrawer === 'notifications';

  const userNotifications = (state.notifications || []).filter(n => 
    n.targetRoles.includes(state.currentRole) || n.targetRoles.includes('all')
  );

  const handleMarkAllRead = () => {
    store.markAllNotificationsRead();
    showToast("All notifications marked as read", "success");
  };

  return (
    <div id="notifications-drawer-overlay" className={`ops-drawer-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-drawer-content">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="bell" className="w-5 h-5 text-[#3B5BDB]" />
            <div>
              <h3 className="text-sm font-bold text-[#14181F]">Operations Feed & Notifications</h3>
              <p className="text-xs text-gray-500">Chronological training cycle, approvals & updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              id="btn-mark-all-read" 
              onClick={handleMarkAllRead}
              className="text-xs text-[#3B5BDB] hover:underline font-medium cursor-pointer"
            >
              Mark all read
            </button>
            <button 
              id="btn-close-notif-drawer" 
              onClick={closeDrawer}
              className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-100"
            >
              <Icon name="x" className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div id="notifications-list" className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#EFECE6]">
          {userNotifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No notifications for your active role.
            </div>
          ) : (
            userNotifications.map(n => (
              <div 
                key={n.id} 
                onClick={() => store.markNotificationRead(n.id)}
                className={`pt-3 first:pt-0 cursor-pointer ${n.unread ? 'bg-blue-50/30 -mx-2 px-2 py-2 rounded' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs text-[#14181F] flex items-center gap-1.5">
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB] shrink-0"></span>}
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
