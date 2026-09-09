
export function HrCycle() {
  const { state, store } = useStore();
  const cycle = state.cycle || {};

  const handleToggleCycle = () => {
    store.toggleCycle();
    showToast(`Training cycle is now ${!cycle.isOpen ? 'OPEN' : 'CLOSED'}`, 'info');
  };

  const handleRemind = (deptId, deptName) => {
    store.sendDepartmentReminder(deptId);
    showToast(`Reminder notification dispatched to ${deptName}`, 'success');
  };

  const submissions = cycle.departmentSubmissions || [];
  const submittedCount = submissions.filter(s => s.submitted).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Training Cycle Governance & Control</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage open nomination windows, monitor 12-department batch submissions, and trigger deadline reminders
          </p>
        </div>

        <button 
          onClick={handleToggleCycle}
          className={`btn-ops-primary ${cycle.isOpen ? 'bg-[#B3261E] hover:bg-red-800 border-red-800' : 'bg-[#2F7D5A] hover:bg-green-800 border-green-800'}`}
        >
          <Icon name="power" className="w-3.5 h-3.5" />
          {cycle.isOpen ? 'Close Current Cycle' : 'Open Nomination Cycle'}
        </button>
      </div>

      {/* Cycle Progress Bar */}
      <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#14181F] text-sm">{cycle.name || 'SEPTEMBER 2026 CYCLE'}</span>
            <span className={`ml-2 status-pill ${cycle.isOpen ? 'status-completed' : 'status-rejected'}`}>
              {cycle.isOpen ? 'NOMINATIONS OPEN' : 'CYCLE CLOSED'}
            </span>
          </div>
          <span className="font-semibold text-gray-600">
            {submittedCount} / {submissions.length} Departments Submitted ({Math.round((submittedCount/submissions.length)*100)}%)
          </span>
        </div>

        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#2F7D5A] h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(submittedCount / (submissions.length || 1)) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>Cycle Start: Sep 01, 2026</span>
          <span className="font-bold text-red-600">Submission Cutoff: Sep 18, 2026 (5 Days Remaining)</span>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider">
            12-Department Nomination Tracking & Reminders
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="ops-table text-xs w-full">
            <thead>
              <tr>
                <th>Department</th>
                <th>Submissions</th>
                <th>Nominees</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.deptId}>
                  <td className="font-bold text-[#14181F]">{s.deptName}</td>
                  <td>{s.submitted ? 'Batch Received' : 'Awaiting HOD'}</td>
                  <td className="font-semibold">{s.count || 0} Candidates</td>
                  <td>
                    <span className={`status-pill ${s.submitted ? 'status-completed' : 'status-pending'}`}>
                      {s.submitted ? 'Submitted' : 'Pending Submission'}
                    </span>
                  </td>
                  <td>
                    {!s.submitted && (
                      <button 
                        onClick={() => handleRemind(s.deptId, s.deptName)}
                        className="btn-ops-secondary text-[11px] py-1 px-2.5"
                      >
                        <Icon name="bell" className="w-3 h-3 text-[#3B5BDB]" />
                        Send Reminder Ping
                      </button>
                    )}
                    {s.submitted && (
                      <span className="text-[11px] text-[#2F7D5A] font-semibold">Received On Schedule</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
