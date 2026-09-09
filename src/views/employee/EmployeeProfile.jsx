
const { useState, useEffect } = React;

export function EmployeeProfile() {
  const { currentUser, store, state, previewDoc } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [position, setPosition] = useState(currentUser.position);
  const [tenureYears, setTenureYears] = useState(currentUser.tenureYears || 3);
  const [email, setEmail] = useState(currentUser.email);
  const [department, setDepartment] = useState(currentUser.department);

  const [skills, setSkills] = useState(currentUser.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState(currentUser.projects || []);
  const [newProject, setNewProject] = useState('');

  useEffect(() => {
    setName(currentUser.name);
    setPosition(currentUser.position);
    setTenureYears(currentUser.tenureYears || 3);
    setEmail(currentUser.email);
    setDepartment(currentUser.department);
    setSkills(currentUser.skills || []);
    setProjects(currentUser.projects || []);
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    store.updateProfile(currentUser.id, {
      name,
      position,
      tenureYears,
      email,
      department,
      skills,
      projects
    });
    setIsEditing(false);
    showToast("Profile details updated successfully!", "success");
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject('');
    }
  };

  const handleRemoveProject = (projectToRemove) => {
    setProjects(projects.filter(p => p !== projectToRemove));
  };

  const completedTrainings = state.trainings.filter(t => t.userId === currentUser.id && t.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="p-6 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1E293B] text-white font-extrabold text-xl flex items-center justify-center border-2 border-gray-200 shadow-sm">
              {currentUser.avatarInitials || 'RS'}
            </div>
            <div>
              <h1 className="text-xl font-black text-[#14181F]">{currentUser.name}</h1>
              <p className="text-xs font-semibold text-gray-700">{currentUser.position}</p>
              <p className="text-xs text-gray-500">{currentUser.department} · {currentUser.tenureYears} Years Tenure</p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? 'btn-ops-secondary' : 'btn-ops-primary'} self-start sm:self-auto`}
          >
            <Icon name={isEditing ? 'x' : 'edit-3'} className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Edit Form or Readonly View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#14181F] border-b pb-2">Edit Employment Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Full Legal Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="ops-input text-xs" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Designation / Role Title</label>
              <input 
                type="text" 
                value={position} 
                onChange={(e) => setPosition(e.target.value)} 
                className="ops-input text-xs" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">UltraTech Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="ops-input text-xs" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Experience / Tenure (Years)</label>
              <input 
                type="number" 
                step="0.5" 
                value={tenureYears} 
                onChange={(e) => setTenureYears(e.target.value)} 
                className="ops-input text-xs" 
                required 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-800 mb-1">Primary Department</label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="ops-select text-xs"
              >
                {state.departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E4E1DA] flex justify-end gap-2">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-ops-secondary">Cancel</button>
            <button type="submit" className="btn-ops-primary">
              <Icon name="check" className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      ) : null}

      {/* Skills & Capabilities Tag Editor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="cpu" className="w-4 h-4 text-[#3B5BDB]" />
              Technical Skill Matrix
            </h3>
            <span className="text-[10px] text-gray-400">{skills.length} skills verified</span>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[48px]">
            {skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F6F3] border border-[#E4E1DA] rounded-md text-xs font-medium text-gray-800">
                {s}
                <button type="button" onClick={() => handleRemoveSkill(s)} className="text-gray-400 hover:text-red-500">
                  <Icon name="x" className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
            <input 
              type="text" 
              placeholder="Add skill (e.g. Stack Sampling)..." 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)} 
              className="ops-input text-xs flex-1"
            />
            <button type="submit" className="btn-ops-secondary text-xs px-3">Add</button>
          </form>
        </div>

        {/* Projects Assigned */}
        <div className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="briefcase" className="w-4 h-4 text-[#2F7D5A]" />
              Active Project Deliverables
            </h3>
            <span className="text-[10px] text-gray-400">{projects.length} assignments</span>
          </div>

          <div className="space-y-1.5 min-h-[48px]">
            {projects.map((p, i) => (
              <div key={i} className="p-2 bg-[#F7F6F3] border border-[#E4E1DA] rounded flex items-center justify-between text-xs">
                <span className="font-medium text-gray-800">{p}</span>
                <button type="button" onClick={() => handleRemoveProject(p)} className="text-gray-400 hover:text-red-500">
                  <Icon name="x" className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddProject} className="flex gap-2 pt-2">
            <input 
              type="text" 
              placeholder="Add project (e.g. Navi Mumbai ETP Audit)..." 
              value={newProject} 
              onChange={(e) => setNewProject(e.target.value)} 
              className="ops-input text-xs flex-1"
            />
            <button type="submit" className="btn-ops-secondary text-xs px-3">Add</button>
          </form>
        </div>
      </div>

      {/* Completed Trainings & Verified Certificates */}
      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <h3 className="text-xs font-bold text-[#14181F] uppercase tracking-wider flex items-center gap-2">
            <Icon name="award" className="w-4 h-4 text-[#2F7D5A]" />
            Verified Training Credentials & Competency Log
          </h3>
          <span className="status-pill status-completed">{completedTrainings.length} Verified</span>
        </div>

        <div className="divide-y divide-[#EFECE6]">
          {completedTrainings.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">No completed trainings logged yet.</div>
          ) : (
            completedTrainings.map(t => (
              <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-[#14181F]">{t.title}</h4>
                  <p className="text-xs text-gray-500">
                    Sign-off: {t.signedOffBy || 'HOD Priya Nair'} · Completed: {t.completedDate || 'Sep 2026'}
                  </p>
                </div>
                <button 
                  onClick={() => previewDoc(t.proof ? t.proof.certificateFile : 'Certificate_Completion.pdf', 'certificate', t.id)}
                  className="btn-ops-secondary text-xs py-1 px-3 self-start sm:self-auto"
                >
                  <Icon name="file-text" className="w-3.5 h-3.5 text-[#2F7D5A]" />
                  View Certificate
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
