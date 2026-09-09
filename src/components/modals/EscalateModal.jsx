
const { useState } = React;

export function EscalateModal() {
  const { activeModal, closeModal, store } = useStore();
  const [note, setNote] = useState('');
  const [error, setError] = useState(false);

  const isOpen = activeModal && activeModal.name === 'escalate';
  const reqData = activeModal ? activeModal.data : null;

  const handleConfirm = () => {
    if (!note.trim()) {
      setError(true);
      return;
    }
    if (reqData && reqData.id) {
      store.escalateRequest(reqData.id, note.trim());
      closeModal();
      showToast("Escalation appeal submitted to Corporate HR board.", "success");
    }
  };

  return (
    <div id="escalate-modal-overlay" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="alert-triangle" className="w-5 h-5 text-[#B3261E]" />
            <h3 className="text-sm font-bold text-[#14181F]">Escalate Appeal to Corporate HR</h3>
          </div>
          <button id="btn-close-escalate-modal" onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-100">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-600">
            You are escalating this training request or resubmission to Corporate HR for secondary review. Please provide a factual rationale detailing why this training is critical to current project deliverables or statutory compliance.
          </p>
          {reqData && (
            <div id="escalate-context-summary" className="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded text-xs space-y-1">
              <p><strong>Training:</strong> {reqData.trainingTitle || reqData.title}</p>
              <p><strong>Applicant:</strong> {reqData.applicantName || reqData.userName}</p>
              <p><strong>Status:</strong> {reqData.status}</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-[#14181F] mb-1">
              Appeal Justification Note <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="escalate-note-input" 
              rows="4" 
              className="ops-textarea" 
              placeholder="Explain the regulatory mandate, client requirement, or methodological justification for HR..."
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError(false);
              }}
            />
            {error && (
              <p id="escalate-error-msg" className="text-xs text-[#B3261E] mt-1">
                Please provide an appeal justification note before submitting.
              </p>
            )}
          </div>
        </div>
        <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] flex items-center justify-end gap-2">
          <button id="btn-cancel-escalate" onClick={closeModal} className="btn-ops-secondary">Cancel</button>
          <button id="btn-confirm-escalate" onClick={handleConfirm} className="btn-ops-danger">
            <Icon name="send" className="w-3.5 h-3.5" />
            Submit Escalation to HR
          </button>
        </div>
      </div>
    </div>
  );
}
