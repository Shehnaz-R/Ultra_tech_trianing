
const { useState, useEffect } = React;

export function EmployeeProfile() {
  const { currentUser, store, state } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name || '');
  const [position, setPosition] = useState(currentUser.position || '');
  const [tenureYears, setTenureYears] = useState(currentUser.tenureYears || 3);
  const [email, setEmail] = useState(currentUser.email || '');
  const [department, setDepartment] = useState(currentUser.department || '');

  const [skills, setSkills] = useState(currentUser.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [projects, setProjects] = useState(currentUser.projects || []);
  const [newProject, setNewProject] = useState('');
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  useEffect(() => {
    setName(currentUser.name || '');
    setPosition(currentUser.position || '');
    setTenureYears(currentUser.tenureYears || 3);
    setEmail(currentUser.email || '');
    setDepartment(currentUser.department || '');
    setSkills(currentUser.skills || []);
    setProjects(currentUser.projects || []);
  }, [currentUser]);

  const triggerSaved = () => {
    setShowSavedIndicator(true);
    setTimeout(() => setShowSavedIndicator(false), 3000);
  };

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
    triggerSaved();
    showToast("Profile details updated successfully!", "success");
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      setNewSkill('');
      store.updateProfile(currentUser.id, { skills: updated });
      triggerSaved();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    store.updateProfile(currentUser.id, { skills: updated });
    triggerSaved();
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      const updated = [...projects, newProject.trim()];
      setProjects(updated);
      setNewProject('');
      store.updateProfile(currentUser.id, { projects: updated });
      triggerSaved();
    }
  };

  const handleRemoveProject = (projectToRemove) => {
    const updated = projects.filter(p => p !== projectToRemove);
    setProjects(updated);
    store.updateProfile(currentUser.id, { projects: updated });
    triggerSaved();
  };

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#14181F]">Employee Profile</h1>
            {showSavedIndicator && (
              <span id="profile-save-indicator" className="inline-flex items-center gap-1 text-[11px] text-[#2F7D5A] font-semibold bg-[#EDF7F2] px-2 py-0.5 rounded border border-[#A3D9C1]">
                <Icon name="check" className="w-3 h-3" />
                <span>Saved automatically</span>
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            View and update your technical competencies, NABL methods, and handled projects.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Employment Details (Profile Card) */}
        <div className="ops-panel p-4 space-y-4 self-start" id="profile-left-card">
          <div className="flex items-center gap-3 pb-3 border-b border-[#E4E1DA]">
            <div className="w-12 h-12 bg-[#14181F] text-white rounded font-bold text-base flex items-center justify-center shrink-0" id="profile-avatar-badge">
              {currentUser.avatarInitials || 'PN'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-[#14181F] truncate" id="profile-display-name">{currentUser.name}</h2>
              <p className="text-xs text-gray-500 truncate" id="profile-display-position">{currentUser.position}</p>
            </div>
            <button
              type="button"
              id="btn-edit-profile-details"
              className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-[#3B5BDB] hover:text-[#2E4ABC] border border-[#3B5BDB] hover:bg-[#EEF2FF] rounded px-2 py-1 transition-colors cursor-pointer"
              onClick={() => setIsEditing(!isEditing)}
              title="Edit profile details"
            >
              <Icon name={isEditing ? 'x' : 'pencil'} className="w-3 h-3" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {/* Static view */}
          {!isEditing ? (
            <div id="profile-static-details" className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 font-medium block">Department</span>
                <span className="font-semibold text-gray-800 block mt-0.5" id="profile-static-dept">{currentUser.department}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Reporting Head</span>
                <span className="font-semibold text-gray-800 block mt-0.5">{currentUser.headName || 'Vikram Seth'}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Professional Experience</span>
                <span className="font-semibold text-gray-800 block mt-0.5" id="profile-static-tenure">{currentUser.tenureYears} Years</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Email Address</span>
                <span className="font-semibold text-gray-800 block mt-0.5" id="profile-static-email">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-gray-400 font-medium block">Completed Trainings</span>
                <span className="font-semibold text-[#2F7D5A] block mt-0.5">
                  {currentUser.completedCount || 14} Courses Verified
                </span>
              </div>
            </div>
          ) : (
            /* Edit form */
            <form onSubmit={handleSave} id="profile-edit-form" className="space-y-3 text-xs">
              <div>
                <label className="text-gray-400 font-medium block mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="edit-profile-name" 
                  className="ops-input text-xs w-full" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 font-medium block mb-1">Designation / Position</label>
                <input 
                  type="text" 
                  id="edit-profile-position" 
                  className="ops-input text-xs w-full" 
                  value={position} 
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Designation"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 font-medium block mb-1">Professional Experience (Years)</label>
                <input 
                  type="number" 
                  id="edit-profile-tenure" 
                  className="ops-input text-xs w-full" 
                  value={tenureYears} 
                  onChange={(e) => setTenureYears(e.target.value)}
                  min="0" 
                  max="50" 
                  step="0.1" 
                  placeholder="e.g. 4.2"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 font-medium block mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="edit-profile-email" 
                  className="ops-input text-xs w-full" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 font-medium block mb-1">Department</label>
                <select 
                  id="edit-profile-dept" 
                  className="ops-select text-xs w-full"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {state.departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-ops-primary flex-1 justify-center text-xs py-1.5 flex items-center gap-1 cursor-pointer">
                  <Icon name="check" className="w-3 h-3" />
                  <span>Save Changes</span>
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-ops-secondary flex-1 justify-center text-xs py-1.5 cursor-pointer">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Editable Skills & Projects */}
        <div className="md:col-span-2 space-y-5">
          {/* Skills Tag List */}
          <div className="ops-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#14181F]">Technical Skills & Certifications</h3>
                <p className="text-[11px] text-gray-500">Analytical instruments, NABL methods, and laboratory procedures</p>
              </div>
              <span className="text-[11px] text-gray-400">{skills.length} skills listed</span>
            </div>

            <div id="skills-tag-container" className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F7F6F3] border border-[#E4E1DA] text-xs font-medium text-[#14181F]">
                  <span>{skill}</span>
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-[#B3261E] cursor-pointer" 
                    onClick={() => handleRemoveSkill(skill)}
                    title="Remove tag"
                  >
                    <Icon name="x" className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
              <input 
                type="text" 
                id="new-skill-input" 
                className="ops-input text-xs flex-1" 
                placeholder="Add technical skill or NABL method (e.g. ICP-MS, Toxicity Testing)..." 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
              />
              <button type="submit" className="btn-ops-secondary shrink-0 text-xs flex items-center gap-1 cursor-pointer">
                <Icon name="plus" className="w-3 h-3" />
                <span>Add Skill</span>
              </button>
            </form>
          </div>

          {/* Major Projects Handled */}
          <div className="ops-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#14181F]">Major Projects Handled</h3>
                <p className="text-[11px] text-gray-500">Field studies, EIA baselines, and environmental audits</p>
              </div>
              <span className="text-[11px] text-gray-400">{projects.length} projects</span>
            </div>

            <div id="projects-list-container" className="space-y-2 pt-1">
              {projects.map((proj, idx) => (
                <div key={idx} className="p-2.5 bg-[#F7F6F3] border border-[#E4E1DA] rounded flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Icon name="folder-check" className="w-3.5 h-3.5 text-[#3B5BDB] shrink-0" />
                    <span className="font-medium text-[#14181F]">{proj}</span>
                  </div>
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-[#B3261E] shrink-0 p-1 cursor-pointer" 
                    onClick={() => handleRemoveProject(proj)}
                    title="Remove project"
                  >
                    <Icon name="trash-2" className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Project Input */}
            <form onSubmit={handleAddProject} className="flex items-center gap-2 pt-2">
              <input 
                type="text" 
                id="new-project-input" 
                className="ops-input text-xs flex-1" 
                placeholder="Add major project or environmental assignment..." 
                value={newProject} 
                onChange={(e) => setNewProject(e.target.value)} 
              />
              <button type="submit" className="btn-ops-secondary shrink-0 text-xs flex items-center gap-1 cursor-pointer">
                <Icon name="plus" className="w-3 h-3" />
                <span>Add Project</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
