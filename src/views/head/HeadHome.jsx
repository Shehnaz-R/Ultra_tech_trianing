
export function HeadHome() {
  const { state, store, currentUser, openDrawer } = useStore();

  const teamMembers = state.users.filter(u => u.headId === currentUser.id || u.department === currentUser.department);
  const deptTrainings = state.trainings.filter(t => t.department === currentUser.department);
  const pendingSignoffs = deptTrainings.filter(t => t.status === 'Pending Sign-off');
  const escalatedItems = deptTrainings.filter(t => calculateCountdown(t.daysElapsed).overdue);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F7D5A] bg-green-50 border border-green-200 px-2 py-0.5 rounded">
            Department Scope
          </span>
          <h1 className="text-xl font-extrabold text-[#14181F] mt-1">
            {currentUser.name} — Department Ops
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Head of {currentUser.department} · {teamMembers.length} Direct Specialists
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => store.setView('head-signoffs')} className="btn-ops-primary">
            <Icon name="clock" className="w-3.5 h-3.5" />
            Sign-Off Queue ({pendingSignoffs.length})
          </button>
          <button onClick={() => store.setView('head-team')} className="btn-ops-secondary">
            <Icon name="users" className="w-3.5 h-3.5" />
            Team Roster
          </button>
        </div>
      </div>

      {/* Escalation Warning if any */}
      {escalatedItems.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 text-[#B3261E] rounded-lg">
              <Icon name="alert-triangle" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-900">7-Day SLA Escalation Warning</h4>
              <p className="text-xs text-red-700 mt-0.5">
                {escalatedItems.length} completion proof(s) have passed the 7-day sign-off SLA and have been escalated to Corporate HR.
              </p>
            </div>
          </div>
          <button 
            onClick={() => store.setView('head-signoffs')}
            className="btn-ops-danger text-xs whitespace-nowrap"
          >
            Review Queue
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Sign-offs</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">{pendingSignoffs.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Within 7-day review SLA</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Direct Team</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">{teamMembers.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Environmental specialists</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Trainings</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">
            {deptTrainings.filter(t => t.status === 'In Progress').length}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Currently enrolled</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completions</span>
          <p className="text-2xl font-black text-[#2F7D5A] mt-2">
            {deptTrainings.filter(t => t.status === 'Completed').length}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Verified certificates</p>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Sign-Off Preview */}
        <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
            <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="clock" className="w-4 h-4 text-[#3B5BDB]" />
              Urgent Sign-off Queue
            </h3>
            <button onClick={() => store.setView('head-signoffs')} className="text-xs text-[#3B5BDB] font-semibold hover:underline">
              View All ({pendingSignoffs.length})
            </button>
          </div>
          <div className="divide-y divide-[#EFECE6]">
            {pendingSignoffs.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400">All submissions signed off.</div>
            ) : (
              pendingSignoffs.slice(0, 3).map(t => {
                const cd = calculateCountdown(t.daysElapsed);
                return (
                  <div key={t.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-[#14181F]">{t.userName}</p>
                      <p className="text-gray-500 text-[11px]">{t.title}</p>
                    </div>
                    <span className={`status-pill ${cd.pillClass}`}>
                      {cd.daysLeft}d left
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Team Capability Snapshot */}
        <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
            <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="users" className="w-4 h-4 text-[#2F7D5A]" />
              Department Roster Snapshot
            </h3>
            <button onClick={() => store.setView('head-team')} className="text-xs text-[#3B5BDB] font-semibold hover:underline">
              Manage Team
            </button>
          </div>
          <div className="divide-y divide-[#EFECE6]">
            {teamMembers.slice(0, 3).map(m => (
              <div key={m.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white font-bold text-[10px] flex items-center justify-center">
                    {m.avatarInitials || 'UT'}
                  </div>
                  <div>
                    <p className="font-bold text-[#14181F]">{m.name}</p>
                    <p className="text-gray-500 text-[11px]">{m.position}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#2F7D5A]">{m.completedCount || 0} completed</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
