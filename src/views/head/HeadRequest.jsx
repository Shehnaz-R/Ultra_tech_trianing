
const { useState } = React;

export function HeadRequest() {
  const { currentUser, store, state, headRequestTab, setHeadRequestTab } = useStore();

  // Self nomination state
  const [selfTitle, setSelfTitle] = useState('');
  const [selfCategory, setSelfCategory] = useState(currentUser.department);
  const [selfMode, setSelfMode] = useState('External Masterclass / Seminar');
  const [selfJust, setSelfJust] = useState('');

  // Team nomination state
  const [teamTitle, setTeamTitle] = useState('');
  const [teamCategory, setTeamCategory] = useState(currentUser.department);
  const [teamMode, setTeamMode] = useState('In-House Workshop');
  const [teamJust, setTeamJust] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const teamRoster = state.users.filter(u => u.headId === currentUser.id || u.department === currentUser.department);

  const toggleEmployeeSelection = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(e => e !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const handleSelfSubmit = (e) => {
    e.preventDefault();
    store.submitRequest({
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      departmentId: currentUser.departmentId || 'dept-01',
      department: currentUser.department,
      designation: currentUser.position,
      headId: currentUser.id,
      headName: currentUser.name,
      trainingTitle: selfTitle.trim(),
      category: selfCategory,
      mode: selfMode,
      justification: selfJust.trim(),
      type: 'Self'
    });
    setSelfTitle('');
    setSelfJust('');
    showToast("Self-nomination submitted to Corporate HR!", "success");
    store.setView('head-request-status');
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();
    if (selectedEmployees.length === 0) {
      showToast("Please select at least one team member to nominate", "warning");
      return;
    }

    const employeeNames = teamRoster
      .filter(u => selectedEmployees.includes(u.id))
      .map(u => u.name)
      .join(', ');

    store.submitRequest({
      applicantId: currentUser.id,
      applicantName: `${currentUser.name} (HOD Batch Nomination)`,
      departmentId: currentUser.departmentId || 'dept-01',
      department: currentUser.department,
      designation: currentUser.position,
      headId: currentUser.id,
      headName: currentUser.name,
      trainingTitle: teamTitle.trim(),
      category: teamCategory,
      mode: teamMode,
      justification: `Team Batch (${selectedEmployees.length} members: ${employeeNames}): ${teamJust.trim()}`,
      targetEmployees: selectedEmployees,
      type: 'Team'
    });

    setTeamTitle('');
    setTeamJust('');
    setSelectedEmployees([]);
    showToast(`Team nomination for ${selectedEmployees.length} specialists submitted to HR!`, "success");
    store.setView('head-request-status');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#14181F]">Department Training Nominations</h1>
        <p className="text-xs text-gray-500 mt-0.5">Submit personal executive nominations or batch nominate department specialists</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4E1DA] text-xs">
        <button
          onClick={() => setHeadRequestTab('self')}
          className={`py-2.5 px-4 font-bold border-b-2 cursor-pointer transition-colors ${
            headRequestTab === 'self' 
              ? 'border-[#3B5BDB] text-[#3B5BDB]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          1. Self Nomination (HOD)
        </button>
        <button
          onClick={() => setHeadRequestTab('team')}
          className={`py-2.5 px-4 font-bold border-b-2 cursor-pointer transition-colors ${
            headRequestTab === 'team' 
              ? 'border-[#3B5BDB] text-[#3B5BDB]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          2. Batch Team Nomination ({selectedEmployees.length} selected)
        </button>
      </div>

      {headRequestTab === 'self' ? (
        <form onSubmit={handleSelfSubmit} className="p-6 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">
              Executive Workshop / Seminar Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. ISO 17025 Lead Technical Assessor Qualification"
              value={selfTitle}
              onChange={(e) => setSelfTitle(e.target.value)}
              className="ops-input text-xs" 
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Subject Area</label>
              <select value={selfCategory} onChange={(e) => setSelfCategory(e.target.value)} className="ops-select text-xs">
                {state.departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Training Mode</label>
              <select value={selfMode} onChange={(e) => setSelfMode(e.target.value)} className="ops-select text-xs">
                <option value="External Masterclass / Seminar">External Masterclass / Seminar</option>
                <option value="In-House Executive Workshop">In-House Executive Workshop</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Strategic Justification</label>
            <textarea 
              rows="3" 
              placeholder="Describe department strategic objectives and lab quality certifications supported..."
              value={selfJust}
              onChange={(e) => setSelfJust(e.target.value)}
              className="ops-textarea text-xs"
              required
            />
          </div>

          <button type="submit" className="btn-ops-primary w-full">
            <Icon name="send" className="w-4 h-4" />
            Submit HOD Request to Corporate HR
          </button>
        </form>
      ) : (
        <form onSubmit={handleTeamSubmit} className="p-6 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">
              Team Training Program Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. High Volume Air Sampler Calibration Protocols"
              value={teamTitle}
              onChange={(e) => setTeamTitle(e.target.value)}
              className="ops-input text-xs" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-2">
              Select Department Candidates <span className="text-red-500">*</span>
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto border border-[#E4E1DA] p-2 rounded-lg bg-gray-50/50">
              {teamRoster.map(emp => (
                <label 
                  key={emp.id} 
                  className="flex items-center justify-between p-2 bg-white rounded border border-[#E4E1DA] hover:bg-blue-50/20 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => toggleEmployeeSelection(emp.id)}
                      className="rounded text-[#3B5BDB]"
                    />
                    <span className="font-bold text-[#14181F]">{emp.name}</span>
                    <span className="text-gray-500 text-[11px]">— {emp.position}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold">{emp.tenureYears} yrs tenure</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Discipline</label>
              <select value={teamCategory} onChange={(e) => setTeamCategory(e.target.value)} className="ops-select text-xs">
                {state.departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Training Mode</label>
              <select value={teamMode} onChange={(e) => setTeamMode(e.target.value)} className="ops-select text-xs">
                <option value="In-House Workshop">In-House Workshop</option>
                <option value="External Masterclass / Seminar">External Masterclass / Seminar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Operational Justification</label>
            <textarea 
              rows="3" 
              placeholder="Detail client project deadlines or NABL quality audit requirements..."
              value={teamJust}
              onChange={(e) => setTeamJust(e.target.value)}
              className="ops-textarea text-xs"
              required
            />
          </div>

          <button type="submit" className="btn-ops-primary w-full">
            <Icon name="send" className="w-4 h-4" />
            Submit Batch Nomination ({selectedEmployees.length} Nominees) to HR
          </button>
        </form>
      )}
    </div>
  );
}
