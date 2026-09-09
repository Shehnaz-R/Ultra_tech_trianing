
export function EmployeeNotifications() {
  const { state, store, currentUser } = useStore();

  const userNotifications = (state.notifications || []).filter(n => 
    n.targetRoles.includes(state.currentRole) || n.targetRoles.includes('all')
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Operations Feed & Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">Chronological record of training allocations, sign-offs, and approvals</p>
        </div>
        <button 
          onClick={() => {
            store.markAllNotificationsRead();
            showToast("All notifications marked as read", "success");
          }}
          className="btn-ops-secondary text-xs"
        >
          <Icon name="check" className="w-3.5 h-3.5" />
          Mark All Read
        </button>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden divide-y divide-[#EFECE6]">
        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            No notifications available.
          </div>
        ) : (
          userNotifications.map(n => (
            <div 
              key={n.id} 
              onClick={() => store.markNotificationRead(n.id)}
              className={`p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50/50 ${
                n.unread ? 'bg-blue-50/20' : ''
              }`}
            >
              <div className="p-2 bg-gray-100 rounded-lg shrink-0 mt-0.5 text-gray-600">
                <Icon name="bell" className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-[#14181F] flex items-center gap-1.5">
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#3B5BDB]"></span>}
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
