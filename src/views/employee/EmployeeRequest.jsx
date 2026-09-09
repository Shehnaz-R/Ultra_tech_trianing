
const { useState } = React;

export function EmployeeRequest() {
  const { currentUser, store, state } = useStore();
  const [trainingTitle, setTrainingTitle] = useState('');
  const [category, setCategory] = useState('Environmental Media Monitoring & Lab Analysis');
  const [mode, setMode] = useState('In-House Workshop');
  const [justification, setJustification] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!trainingTitle.trim()) {
      showToast("Please enter a training title", "warning");
      return;
    }

    store.submitRequest({
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      departmentId: currentUser.departmentId || 'dept-01',
      department: currentUser.department,
      designation: currentUser.position,
      headId: currentUser.headId || 'user-head-01',
      headName: currentUser.headName || 'Priya Nair',
      trainingTitle: trainingTitle.trim(),
      category,
      mode,
      justification: justification.trim(),
      type: 'Self'
    });

    setTrainingTitle('');
    setJustification('');
    showToast("Training nomination submitted to HOD Priya Nair!", "success");
    store.setView('employee-trainings');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#14181F]">Request Training Nomination</h1>
        <p className="text-xs text-gray-500 mt-0.5">Submit an individual capability enhancement request to your Department Head</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#14181F] mb-1">
            Training Course / Subject Title <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. Advanced GC-MS Quantitative Analysis for Trace Organics"
            value={trainingTitle}
            onChange={(e) => setTrainingTitle(e.target.value)}
            className="ops-input text-xs" 
            required 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Target Discipline / Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="ops-select text-xs"
            >
              {state.departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Training Delivery Mode</label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="ops-select text-xs"
            >
              <option value="In-House Workshop">In-House Workshop</option>
              <option value="External Masterclass / Seminar">External Masterclass / Seminar</option>
              <option value="Online Virtual Classroom">Online Virtual Classroom</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#14181F]">
              Business & Technical Justification <span className="text-red-500">*</span>
            </label>
            <span className="text-[10px] text-gray-400">{justification.length} / 500 chars</span>
          </div>
          <textarea 
            rows="4" 
            placeholder="Explain how this training strengthens your project delivery, regulatory reporting, or lab testing accuracy..."
            value={justification}
            onChange={(e) => setJustification(e.target.value.slice(0, 500))}
            className="ops-textarea text-xs"
            required
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn-ops-primary w-full">
            <Icon name="send" className="w-4 h-4" />
            Submit Request to Department Head
          </button>
        </div>
      </form>
    </div>
  );
}
