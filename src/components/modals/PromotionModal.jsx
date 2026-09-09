
const { useState } = React;

export function PromotionModal() {
  const { activeModal, closeModal, state, store } = useStore();
  const isOpen = activeModal && activeModal.name === 'promotion';
  const userId = activeModal && activeModal.data ? activeModal.data.userId : null;
  const user = state.users.find(u => u.id === userId);

  const [category, setCategory] = useState('Technical Specialist / Senior Consultant Track');
  const [notes, setNotes] = useState('');

  if (!user) return null;

  const handleConfirm = () => {
    store.flagForPromotion(user.id, {
      category,
      notes: notes || 'Nominated based on outstanding training velocity and field delivery.'
    });
    closeModal();
    showToast(`${user.name} nominated for ${category}!`, 'success');
  };

  return (
    <div id="promotion-modal" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="award" className="w-5 h-5 text-[#B8860B]" />
            <h3 className="text-sm font-bold text-[#14181F]">Flag Employee for Promotion / Award</h3>
          </div>
          <button id="btn-close-prm-modal" onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div id="prm-candidate-summary" className="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded text-xs space-y-1">
            <p><strong>Candidate:</strong> {user.name} ({user.position})</p>
            <p><strong>Department:</strong> {user.department}</p>
            <p><strong>Tenure:</strong> {user.tenureYears} yrs | <strong>Completed Trainings:</strong> {user.completedCount || 0}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Track / Recognition Category <span className="text-red-500">*</span></label>
            <select 
              id="prm-category-select" 
              className="ops-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Technical Specialist / Senior Consultant Track">Technical Specialist / Senior Consultant Track</option>
              <option value="Laboratory Quality Lead / Deputy QM">Laboratory Quality Lead / Deputy QM</option>
              <option value="Excellence in Field Operations Award">Excellence in Field Operations Award</option>
              <option value="Outstanding Project Delivery & Turnkey Leadership">Outstanding Project Delivery & Turnkey Leadership</option>
              <option value="Innovation in Environmental Method Development">Innovation in Environmental Method Development</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">Justification & Capability Notes <span className="text-red-500">*</span></label>
            <textarea 
              id="prm-notes-input" 
              rows="3" 
              className="ops-textarea" 
              placeholder="Detail the candidate's technical mastery, training completion velocity, and leadership potential..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] flex items-center justify-end gap-2">
          <button id="btn-cancel-prm" onClick={closeModal} className="btn-ops-secondary">Cancel</button>
          <button id="btn-confirm-prm" onClick={handleConfirm} className="btn-ops-primary bg-[#B8860B] hover:bg-[#92400E] border-[#92400E]">
            <Icon name="flag" className="w-3.5 h-3.5" />
            Confirm & Shortlist
          </button>
        </div>
      </div>
    </div>
  );
}
