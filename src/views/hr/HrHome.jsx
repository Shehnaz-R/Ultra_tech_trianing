
export function HrHome() {
  const { state, store, currentUser } = useStore();

  const totalEmployees = state.users.filter(u => u.role === 'employee').length;
  const totalTrainings = state.trainings.length;
  const pendingRequests = state.requests.filter(r => r.status.includes('Pending')).length;
  const overdueEscalations = state.trainings.filter(t => t.status === 'Pending Sign-off' && calculateCountdown(t.daysElapsed).overdue).length;
  const appealEscalations = state.requests.filter(r => r.status === 'Escalated').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B5BDB] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Executive Admin Scope
          </span>
          <h1 className="text-xl font-extrabold text-[#14181F] mt-1">
            Corporate HR & Capability Portal
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {currentUser.name} · Managing 12 Environmental Departments & Regional Laboratories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => store.setView('hr-cycle')} className="btn-ops-primary">
            <Icon name="refresh-cw" className="w-3.5 h-3.5" />
            Cycle Control ({state.cycle.isOpen ? 'OPEN' : 'CLOSED'})
          </button>
          <button onClick={() => store.setView('hr-requests')} className="btn-ops-secondary">
            <Icon name="layers" className="w-3.5 h-3.5" />
            Consolidated Requests
          </button>
        </div>
      </div>

      {/* Escalation Hub Alert if any */}
      {(overdueEscalations > 0 || appealEscalations > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-[#B8860B] rounded-lg">
              <Icon name="alert-triangle" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">Escalations Pending HR Intervention</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {overdueEscalations} overdue sign-off(s) exceeded 7-day SLA, and {appealEscalations} request appeal(s) require resolution.
              </p>
            </div>
          </div>
          <button onClick={() => store.setView('hr-escalations')} className="btn-ops-secondary text-xs whitespace-nowrap">
            Open Escalations Hub
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Specialists</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">{totalEmployees}</p>
          <p className="text-[11px] text-gray-500 mt-1">Across 12 technical divisions</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Requests</span>
          <p className="text-2xl font-black text-[#3B5BDB] mt-2">{pendingRequests}</p>
          <p className="text-[11px] text-gray-500 mt-1">Requiring HR review & approval</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Cycle</span>
          <p className="text-2xl font-black text-[#2F7D5A] mt-2">{state.cycle.name}</p>
          <p className="text-[11px] text-gray-500 mt-1">Deadline: Sep 18, 2026</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Trainings</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">{totalTrainings}</p>
          <p className="text-[11px] text-gray-500 mt-1">Enrolled & completed courses</p>
        </div>
      </div>

      {/* 12 Departments Overview Table */}
      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-2">
            <Icon name="building" className="w-4 h-4 text-[#3B5BDB]" />
            12 UltraTech Operational Divisions Status
          </h3>
          <span className="text-xs text-gray-500">12 / 12 Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="ops-table text-xs w-full">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Division Head</th>
                <th>Staff Count</th>
                <th>Training Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.departments.map(dept => {
                const count = state.users.filter(u => u.department === dept.name).length;
                return (
                  <tr key={dept.id}>
                    <td className="font-bold text-[#14181F]">{dept.name}</td>
                    <td>{dept.headName}</td>
                    <td className="font-semibold">{count} Specialists</td>
                    <td>
                      <span className="status-pill status-completed">In Compliance</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          store.setDepartmentFilter(dept.id);
                          store.setView('hr-directory');
                        }}
                        className="text-xs text-[#3B5BDB] hover:underline font-semibold"
                      >
                        View Staff
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
