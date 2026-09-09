
const { useState, useMemo } = React;

export function HrDirectory() {
  const { state, openModal } = useStore();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return state.users.filter(u => {
      if (deptFilter !== 'all' && u.departmentId !== deptFilter && u.department !== deptFilter) return false;
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches = u.name.toLowerCase().includes(q) ||
                        u.position.toLowerCase().includes(q) ||
                        (u.skills || []).some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [state.users, search, deptFilter, roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Organization Employee Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Technical specialists, division heads, and HR capability managers across all laboratories
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs flex flex-wrap items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="Search by name, designation, skill..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="ops-input text-xs pl-8"
          />
          <span className="absolute left-2.5 top-2.5 text-gray-400">
            <Icon name="search" className="w-3.5 h-3.5" />
          </span>
        </div>

        <select 
          value={deptFilter} 
          onChange={(e) => setDeptFilter(e.target.value)}
          className="ops-select text-xs max-w-[200px]"
        >
          <option value="all">All 12 Departments</option>
          {state.departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select 
          value={roleFilter} 
          onChange={(e) => setRoleFilter(e.target.value)}
          className="ops-select text-xs max-w-[150px]"
        >
          <option value="all">All Roles</option>
          <option value="employee">Employees</option>
          <option value="head">Department Heads</option>
          <option value="hr">HR Administrators</option>
        </select>

        <span className="text-gray-400 ml-auto">{filteredUsers.length} Specialists</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(u => (
          <div key={u.id} className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white font-bold text-xs flex items-center justify-center">
                    {u.avatarInitials || 'UT'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#14181F]">{u.name}</h3>
                    <p className="text-xs text-gray-500">{u.position}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 capitalize">
                  {u.role}
                </span>
              </div>

              <div className="text-xs text-gray-600 space-y-0.5">
                <p><strong>Dept:</strong> {u.department}</p>
                <p><strong>Tenure:</strong> {u.tenureYears} Years | <strong>Completions:</strong> <span className="text-[#2F7D5A] font-bold">{u.completedCount || 0}</span></p>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {(u.skills || []).slice(0, 3).map((s, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{s}</span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-end gap-2">
              <button 
                onClick={() => openModal('employeeDetail', { userId: u.id })}
                className="btn-ops-secondary text-xs py-1 px-3"
              >
                <Icon name="eye" className="w-3 h-3" />
                View Profile & History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
