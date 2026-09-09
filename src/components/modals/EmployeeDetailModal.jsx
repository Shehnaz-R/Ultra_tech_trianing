
export function EmployeeDetailModal() {
  const { activeModal, closeModal, state, openModal } = useStore();
  const isOpen = activeModal && activeModal.name === 'employeeDetail';
  const userId = activeModal && activeModal.data ? activeModal.data.userId : null;
  const user = state.users.find(u => u.id === userId);
  const trainings = user ? state.trainings.filter(t => t.userId === user.id) : [];

  if (!user) return null;

  return (
    <div className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box max-w-xl">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E293B] text-white font-bold text-sm flex items-center justify-center">
              {user.avatarInitials || 'UT'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#14181F]">{user.name}</h3>
              <p className="text-xs text-gray-500">{user.position} · {user.department}</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded-lg">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Email</span>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Tenure</span>
              <p className="font-semibold text-gray-800">{user.tenureYears} Years</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Completions</span>
              <p className="font-bold text-[#2F7D5A]">{user.completedCount || 0} Verified</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Reporting Head</span>
              <p className="font-semibold text-gray-800">{user.headName || 'Priya Nair'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5 uppercase text-[11px] tracking-wider">Technical Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {(user.skills || []).map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-white border border-[#E4E1DA] rounded text-gray-700">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1.5 uppercase text-[11px] tracking-wider">Active Training Track</h4>
            <div className="space-y-1.5">
              {trainings.map(t => (
                <div key={t.id} className="p-2 bg-white border border-[#E4E1DA] rounded flex items-center justify-between">
                  <span className="font-medium text-gray-800">{t.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] flex items-center justify-end gap-2">
          <button onClick={() => openModal('promotion', { userId: user.id })} className="btn-ops-primary text-xs bg-[#B8860B] border-[#B8860B] hover:bg-[#92400E]">
            <Icon name="award" className="w-3.5 h-3.5" />
            Flag for Award / Promotion
          </button>
          <button onClick={closeModal} className="btn-ops-secondary text-xs">Close</button>
        </div>
      </div>
    </div>
  );
}
