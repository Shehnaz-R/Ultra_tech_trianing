
const { useState } = React;

export function CreateEventModal() {
  const { activeModal, closeModal, store } = useStore();
  const isOpen = activeModal && activeModal.name === 'createEvent';

  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('In-House');
  const [category, setCategory] = useState('Environmental Media Monitoring & Lab Analysis');
  const [date, setDate] = useState('2026-09-22');
  const [endDate, setEndDate] = useState('2026-09-23');
  const [capacity, setCapacity] = useState('20');
  const [branch, setBranch] = useState('Thane');
  const [venue, setVenue] = useState('Central Lab Training Hall, Thane');
  const [instructor, setInstructor] = useState('UltraTech QCI Academy');
  const [hodApproval, setHodApproval] = useState(false);
  const [reimbursement, setReimbursement] = useState('80');

  const handleSubmit = (e) => {
    e.preventDefault();
    store.createEvent({
      title,
      category,
      mode,
      date,
      endDate,
      capacity,
      venue: `${venue} (${branch})`,
      instructor,
      hodApprovalRequired: hodApproval,
      reimbursementPercent: reimbursement
    });
    closeModal();
    showToast(`Created training event: "${title}"`, 'success');
  };

  return (
    <div id="create-event-modal" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box max-w-xl">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="calendar-plus" className="w-5 h-5 text-[#3B5BDB]" />
            <h3 className="text-sm font-bold text-[#14181F]">Schedule New Training Event</h3>
          </div>
          <button id="btn-close-create-event" onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        <form id="create-event-form" onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Event Title <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              id="evt-title" 
              className="ops-input" 
              placeholder="e.g. CPCB Stack Emission Sampling Protocols" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Training Mode <span className="text-red-500">*</span></label>
              <select id="evt-mode" className="ops-select" value={mode} onChange={(e) => setMode(e.target.value)} required>
                <option value="In-House">In-House Workshop</option>
                <option value="External">External Masterclass / Seminar</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Target Department <span className="text-red-500">*</span></label>
              <select id="evt-category" className="ops-select" value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="All Departments">All Departments (Organization-Wide)</option>
                <option value="Environmental Media Monitoring & Lab Analysis">Environmental Media Monitoring & Lab Analysis</option>
                <option value="Environmental Clearance & EIA">Environmental Clearance & EIA</option>
                <option value="Turnkey Engineering & Project Consultancy">Turnkey Engineering & Project Consultancy</option>
                <option value="STP / ETP Operation & Maintenance">STP / ETP Operation & Maintenance</option>
                <option value="Environmental & Social Due Diligence (ESDD)">Environmental & Social Due Diligence (ESDD)</option>
                <option value="Environmental Regulatory Compliance">Environmental Regulatory Compliance</option>
                <option value="Air Quality Monitoring & Stack Testing">Air Quality Monitoring & Stack Testing</option>
                <option value="Chemical & Microbiological Lab Services">Chemical & Microbiological Lab Services</option>
                <option value="Occupational Health, Safety & Environment (HSE)">Occupational Health, Safety & Environment (HSE)</option>
                <option value="Solid & Hazardous Waste Management">Solid & Hazardous Waste Management</option>
                <option value="Sustainability, Carbon & ESG Advisory">Sustainability, Carbon & ESG Advisory</option>
                <option value="GIS, Remote Sensing & Hydrogeological Modeling">GIS, Remote Sensing & Hydrogeological Modeling</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Start Date <span className="text-red-500">*</span></label>
              <input type="date" id="evt-date" className="ops-input" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">End Date</label>
              <input type="date" id="evt-end-date" className="ops-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Capacity (Seats) <span className="text-red-500">*</span></label>
              <input type="number" id="evt-capacity" className="ops-input" value={capacity} onChange={(e) => setCapacity(e.target.value)} min="1" max="100" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#14181F] mb-1">Branch / Location <span className="text-red-500">*</span></label>
              <select id="evt-branch" className="ops-select" value={branch} onChange={(e) => setBranch(e.target.value)} required>
                <option value="Thane">Thane (HQ & Central Lab)</option>
                <option value="Pune">Pune Branch</option>
                <option value="Kochi">Kochi Lab</option>
                <option value="Kolkata">Kolkata Regional Office</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Venue / Platform Detail <span className="text-red-500">*</span></label>
            <input type="text" id="evt-venue" className="ops-input" value={venue} onChange={(e) => setVenue(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Instructor / Certified Provider</label>
            <input type="text" id="evt-instructor" className="ops-input" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
          </div>

          {mode === 'External' && (
            <div id="evt-external-fields" className="p-3 bg-[#FEF9E7] border border-[#F3DB94] rounded space-y-2.5">
              <span className="text-[11px] font-bold text-[#92400E] uppercase tracking-wider block">External Training Governance</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="evt-hod-approval" checked={hodApproval} onChange={(e) => setHodApproval(e.target.checked)} className="rounded text-[#3B5BDB]" />
                <span className="text-xs font-medium text-[#14181F]">Require HOD Pre-approval before employee confirmation</span>
              </label>
              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-1">Reimbursement Percentage (%)</label>
                <div className="flex items-center gap-2">
                  <input type="number" id="evt-reimbursement" className="ops-input w-28" value={reimbursement} onChange={(e) => setReimbursement(e.target.value)} min="0" max="100" />
                  <span className="text-xs text-gray-500">% company sponsored</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] -mx-5 -mb-5 flex items-center justify-end gap-2">
            <button type="button" id="btn-cancel-create-event" onClick={closeModal} className="btn-ops-secondary">Cancel</button>
            <button type="submit" className="btn-ops-primary">
              <Icon name="check" className="w-3.5 h-3.5" />
              Create Training Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
