
export function HeadTeam() {
  const { currentUser, state, openModal } = useStore();

  const teamMembers = state.users.filter(u => u.headId === currentUser.id || u.department === currentUser.department);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Department Specialists Roster</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {teamMembers.length} active analysts, environmental engineers, and technicians in {currentUser.department}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(emp => {
          const empTrainings = state.trainings.filter(t => t.userId === emp.id);
          const activeTraining = empTrainings.find(t => t.status === 'In Progress' || t.status === 'Pending Sign-off');

          return (
            <div key={emp.id} className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center">
                      {emp.avatarInitials || 'UT'}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#14181F]">{emp.name}</h3>
                      <p className="text-xs text-gray-500">{emp.position}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {emp.tenureYears}y exp
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Completions:</strong> <span className="text-[#2F7D5A] font-bold">{emp.completedCount || 0} verified</span></p>
                  {activeTraining && (
                    <p className="truncate"><strong>Active:</strong> {activeTraining.title}</p>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-1">
                    {(emp.skills || []).slice(0, 3).map((s, idx) => (
                      <span key={idx} className="text-[10px] bg-[#F7F6F3] border border-[#E4E1DA] px-1.5 py-0.5 rounded text-gray-700">
                        {s}
                      </span>
                    ))}
                    {(emp.skills || []).length > 3 && (
                      <span className="text-[10px] text-gray-400">+{emp.skills.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E1DA] flex items-center gap-2">
                <button 
                  onClick={() => openModal('employeeDetail', { userId: emp.id })}
                  className="btn-ops-secondary text-xs flex-1 py-1"
                >
                  <Icon name="eye" className="w-3 h-3" />
                  Profile
                </button>
                <button 
                  onClick={() => openModal('promotion', { userId: emp.id })}
                  className="btn-ops-secondary text-xs flex-1 py-1 text-[#B8860B] border-amber-200 hover:bg-amber-50"
                >
                  <Icon name="award" className="w-3 h-3" />
                  Nominate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
