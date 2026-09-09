
const { useState, useMemo } = React;

export function HeadReports() {
  const { currentUser, state, openModal } = useStore();
  const [tenureFilter, setTenureFilter] = useState('all');
  const [completionsFilter, setCompletionsFilter] = useState('all');

  const team = useMemo(() => {
    return state.users.filter(u => u.headId === currentUser.id || u.department === currentUser.department);
  }, [state.users, currentUser]);

  const filteredTeam = useMemo(() => {
    return team.filter(emp => {
      if (tenureFilter !== 'all' && emp.tenureYears < parseFloat(tenureFilter)) return false;
      if (completionsFilter !== 'all' && (emp.completedCount || 0) < parseInt(completionsFilter, 10)) return false;
      return true;
    });
  }, [team, tenureFilter, completionsFilter]);

  const handleExport = () => {
    const headers = ['Employee Name', 'Position', 'Department', 'Tenure (Years)', 'Verified Completions', 'Skills'];
    const rows = [headers];
    filteredTeam.forEach(emp => {
      rows.push([
        emp.name,
        emp.position,
        emp.department,
        emp.tenureYears,
        emp.completedCount || 0,
        (emp.skills || []).join('; ')
      ]);
    });
    downloadCSV(rows, `UltraTech_${currentUser.department.replace(/[^a-zA-Z0-9]/g, '_')}_Team_Report.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Department Capability & Training Reports</h1>
          <p className="text-xs text-gray-500 mt-0.5">Filter team compliance, export CSV records, and flag top performers</p>
        </div>
        <button onClick={handleExport} className="btn-ops-primary">
          <Icon name="download" className="w-3.5 h-3.5" />
          Export Team CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-600">Min Tenure:</span>
          <select 
            id="head-report-filter-tenure"
            value={tenureFilter} 
            onChange={(e) => setTenureFilter(e.target.value)} 
            className="ops-select py-1 px-2 text-xs"
          >
            <option value="all">All Tenures</option>
            <option value="2">2+ Years</option>
            <option value="4">4+ Years</option>
            <option value="6">6+ Years</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-600">Completions:</span>
          <select 
            id="head-report-filter-completions"
            value={completionsFilter} 
            onChange={(e) => setCompletionsFilter(e.target.value)} 
            className="ops-select py-1 px-2 text-xs"
          >
            <option value="all">Any Completions</option>
            <option value="1">1+ Completed</option>
            <option value="3">3+ Completed</option>
            <option value="5">5+ Completed</option>
          </select>
        </div>

        <span className="text-gray-400 ml-auto">{filteredTeam.length} members match criteria</span>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ops-table text-xs w-full">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Position</th>
                <th>Tenure</th>
                <th>Completions</th>
                <th>Key Skills</th>
                <th>Recognition / Award</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="team-report-tbody">
              {filteredTeam.map(emp => {
                const flag = state.promotionFlags.find(f => f.userId === emp.id);
                return (
                  <tr key={emp.id}>
                    <td className="font-bold text-[#14181F]">{emp.name}</td>
                    <td className="text-gray-600">{emp.position}</td>
                    <td className="font-semibold">{emp.tenureYears} yrs</td>
                    <td className="font-bold text-[#2F7D5A]">{emp.completedCount || 0} verified</td>
                    <td>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(emp.skills || []).slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 px-1 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="max-w-xs">
                      {flag ? (
                        <div className="text-[11px] text-gray-700" title={flag.notes}>
                          <strong className="text-[#B8860B]">[{flag.category}]</strong> {flag.notes}
                        </div>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => openModal('promotion', { userId: emp.id })}
                        className="btn-ops-secondary py-1 px-2 text-[11px]"
                      >
                        <Icon name="award" className="w-3 h-3 text-[#B8860B]" />
                        {flag ? 'Update Flag' : 'Flag for Award'}
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
