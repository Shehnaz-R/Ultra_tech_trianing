
export function EmployeeHome() {
  const { state, store, currentUser, openDrawer, openModal } = useStore();

  const myTrainings = state.trainings.filter(t => t.userId === currentUser.id);
  const completed = myTrainings.filter(t => t.status === 'Completed').length;
  const inProgress = myTrainings.filter(t => t.status === 'In Progress' || t.status === 'Pending Sign-off').length;
  const upcoming = myTrainings.filter(t => t.status === 'Upcoming').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B5BDB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Individual Workspace
          </span>
          <h1 className="text-xl font-extrabold text-[#14181F] mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentUser.position} · {currentUser.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => store.setView('employee-request')} 
            className="btn-ops-primary"
          >
            <Icon name="plus" className="w-3.5 h-3.5" />
            Request Training
          </button>
          <button 
            onClick={() => store.setView('employee-trainings')} 
            className="btn-ops-secondary"
          >
            <Icon name="graduation-cap" className="w-3.5 h-3.5" />
            My Trainings
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Progress</span>
            <span className="p-2 bg-blue-50 text-[#3B5BDB] rounded-lg">
              <Icon name="loader" className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-[#14181F] mt-2">{inProgress}</p>
          <p className="text-[11px] text-gray-500 mt-1">Active courses & pending sign-offs</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</span>
            <span className="p-2 bg-green-50 text-[#2F7D5A] rounded-lg">
              <Icon name="check-circle" className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-[#14181F] mt-2">{completed}</p>
          <p className="text-[11px] text-gray-500 mt-1">Verified certificates on profile</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Upcoming</span>
            <span className="p-2 bg-amber-50 text-[#B8860B] rounded-lg">
              <Icon name="calendar" className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-[#14181F] mt-2">{upcoming}</p>
          <p className="text-[11px] text-gray-500 mt-1">Scheduled sessions in active cycle</p>
        </div>
      </div>

      {/* Ongoing Training Activity */}
      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="book-open" className="w-4 h-4 text-[#3B5BDB]" />
            <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider">Current Training Track</h3>
          </div>
          <button 
            onClick={() => store.setView('employee-trainings')} 
            className="text-xs text-[#3B5BDB] hover:underline font-semibold"
          >
            View All ({myTrainings.length})
          </button>
        </div>

        <div className="divide-y divide-[#EFECE6]">
          {myTrainings.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">No training records assigned.</div>
          ) : (
            myTrainings.slice(0, 4).map(t => {
              const countdown = calculateCountdown(t.daysElapsed);
              return (
                <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#14181F]">{t.title}</span>
                      <span className={`status-pill ${
                        t.status === 'Completed' ? 'status-completed' :
                        t.status === 'In Progress' ? 'status-in-progress' :
                        t.status === 'Pending Sign-off' ? 'status-pending' : 'status-upcoming'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {t.category} · {t.mode} · Scheduled: {t.scheduledDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {t.status === 'In Progress' && (
                      <button 
                        onClick={() => openDrawer('proofUpload', { trainingId: t.id })}
                        className="btn-ops-primary text-xs py-1 px-2.5"
                      >
                        <Icon name="upload" className="w-3 h-3" />
                        Upload Proof
                      </button>
                    )}
                    {t.status === 'Pending Sign-off' && (
                      <span className={`status-pill ${countdown.pillClass}`}>
                        {countdown.status} ({countdown.daysLeft}d left)
                      </span>
                    )}
                    {t.status === 'Completed' && (
                      <button 
                        onClick={() => openDrawer('proofDetail', { trainingId: t.id })}
                        className="btn-ops-secondary text-xs py-1 px-2.5"
                      >
                        <Icon name="file-text" className="w-3 h-3" />
                        View Proof
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
