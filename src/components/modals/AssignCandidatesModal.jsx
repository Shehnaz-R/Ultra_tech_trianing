
const { useState, useMemo } = React;

export function AssignCandidatesModal() {
  const { activeModal, closeModal, state, store } = useStore();
  const isOpen = activeModal && activeModal.name === 'assignCandidates';
  const event = activeModal && activeModal.data ? activeModal.data.event : null;

  const eligibleCandidates = useMemo(() => {
    if (!event) return [];
    return state.users.filter(u => u.role === 'employee' && !event.assignedUserIds.includes(u.id));
  }, [event, state.users]);

  const [selectedUserId, setSelectedUserId] = useState('');

  const selectedCandidate = useMemo(() => {
    return state.users.find(u => u.id === (selectedUserId || (eligibleCandidates[0] ? eligibleCandidates[0].id : '')));
  }, [selectedUserId, eligibleCandidates, state.users]);

  if (!event) return null;

  const handleConfirm = () => {
    const targetId = selectedUserId || (eligibleCandidates[0] ? eligibleCandidates[0].id : '');
    if (!targetId) {
      showToast("No candidate selected", "warning");
      return;
    }
    store.assignEmployeesToEvent(event.id, [targetId]);
    closeModal();
    showToast(`Candidate allocated to "${event.title}"`, 'success');
  };

  return (
    <div id="assign-candidates-modal" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="user-plus" className="w-5 h-5 text-[#3B5BDB]" />
            <div>
              <h3 className="text-sm font-bold text-[#14181F]">Allocate Candidates to Training</h3>
              <p id="assign-modal-event-title" className="text-xs text-gray-500 font-medium">{event.title}</p>
            </div>
          </div>
          <button id="btn-close-assign-modal" onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-100">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600">Select an eligible employee candidate from the department roster to allocate to this training workshop:</p>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Select Candidate</label>
            <select 
              id="assign-candidate-select" 
              className="ops-select text-xs font-medium py-2"
              value={selectedUserId || (eligibleCandidates[0] ? eligibleCandidates[0].id : '')}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              {eligibleCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.position} ({c.department})</option>
              ))}
            </select>
          </div>

          {selectedCandidate && (
            <div id="assign-candidate-preview" className="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded-lg text-xs space-y-1">
              <p className="font-bold text-[#14181F]">{selectedCandidate.name}</p>
              <p className="text-gray-600">Position: {selectedCandidate.position} ({selectedCandidate.tenureYears} yrs tenure)</p>
              <p className="text-gray-600">Completed Trainings: {selectedCandidate.completedCount || 0}</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] flex items-center justify-end gap-2">
          <button id="btn-cancel-assign-candidate" onClick={closeModal} className="btn-ops-secondary">Cancel</button>
          <button id="btn-confirm-assign-candidate" onClick={handleConfirm} className="btn-ops-primary">
            <Icon name="user-check" className="w-3.5 h-3.5" />
            Allocate Selected Candidate
          </button>
        </div>
      </div>
    </div>
  );
}
