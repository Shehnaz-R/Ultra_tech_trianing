
const { useState, useEffect } = React;

export function ProofDrawer() {
  const { state, store, activeDrawer, closeDrawer, previewDoc } = useStore();
  const [learnings, setLearnings] = useState('');
  const [attFile, setAttFile] = useState(null);
  const [certFile, setCertFile] = useState(null);
  const [resubmitNotes, setResubmitNotes] = useState('');
  const [showResubmitBox, setShowResubmitBox] = useState(false);

  const isOpen = activeDrawer && (activeDrawer.name === 'proofUpload' || activeDrawer.name === 'proofReview' || activeDrawer.name === 'proofDetail');
  const trainingId = activeDrawer && activeDrawer.data ? activeDrawer.data.trainingId : null;
  const training = state.trainings.find(t => t.id === trainingId);
  const isReviewMode = activeDrawer && activeDrawer.name === 'proofReview';

  useEffect(() => {
    if (training && training.proof) {
      setLearnings(training.proof.learnings || '');
    } else {
      setLearnings('');
      setAttFile(null);
      setCertFile(null);
    }
    setShowResubmitBox(false);
  }, [trainingId, activeDrawer]);

  if (!training) return null;

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    store.submitTrainingProof(training.id, {
      learnings: learnings || 'Completion learnings logged by employee.',
      attendanceFile: attFile ? attFile.name : 'Attendance_Verified.pdf',
      attendanceSize: attFile ? (attFile.size / (1024*1024)).toFixed(1) + ' MB' : '1.1 MB',
      certificateFile: certFile ? certFile.name : 'Certificate_Of_Completion.pdf',
      certificateSize: certFile ? (certFile.size / (1024*1024)).toFixed(1) + ' MB' : '2.4 MB'
    });
    closeDrawer();
    showToast(`Proof submitted for "${training.title}". 7-day sign-off window started.`, 'success');
  };

  const handleApprove = () => {
    store.approveSignoff(training.id, 'Verified compliance with syllabus and attendance requirements.');
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
    closeDrawer();
    showToast(`Signed off "${training.title}" for ${training.userName}!`, 'success');
  };

  const handleResubmit = () => {
    if (!resubmitNotes.trim()) {
      showToast("Please provide revision feedback", "warning");
      return;
    }
    store.resubmitSignoff(training.id, resubmitNotes.trim());
    closeDrawer();
    showToast(`Proof returned for revision to ${training.userName}`, 'info');
  };

  return (
    <div id="proof-drawer-overlay" className={`ops-drawer-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-drawer-content">
        <div className="p-4 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500">
              {isReviewMode ? 'HOD Proof Verification' : 'Training Completion Proof'}
            </span>
            <h3 id="proof-drawer-title" className="text-sm font-bold text-[#14181F] truncate max-w-sm">
              {training.title}
            </h3>
          </div>
          <button id="btn-close-proof-drawer" onClick={closeDrawer} className="p-1 text-gray-400 hover:text-black rounded hover:bg-gray-100">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>

        <div id="proof-drawer-body" className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded-lg text-xs space-y-1">
            <p><strong>Employee:</strong> {training.userName}</p>
            <p><strong>Department:</strong> {training.department}</p>
            <p><strong>Category:</strong> {training.category}</p>
            <p><strong>Status:</strong> <span className="font-semibold">{training.status}</span></p>
          </div>

          {/* If In Review or Already Submitted */}
          {training.proof ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-1">Key Learnings & Takeaways</label>
                <div className="p-3 bg-white border border-[#E4E1DA] rounded text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {training.proof.learnings}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-2">Verified Documents</label>
                <div className="space-y-2">
                  <div className="p-2.5 bg-white border border-[#E4E1DA] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="file-text" className="w-4 h-4 text-[#3B5BDB]" />
                      <div>
                        <p className="text-xs font-bold text-[#14181F]">{training.proof.attendanceFile || 'Attendance_Sheet.pdf'}</p>
                        <p className="text-[10px] text-gray-500">{training.proof.attendanceSize || '1.1 MB'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => previewDoc(training.proof.attendanceFile || 'Attendance_Sheet.pdf', 'attendance', training.id)}
                      className="btn-ops-secondary py-1 px-2 text-xs"
                    >
                      Preview
                    </button>
                  </div>

                  <div className="p-2.5 bg-white border border-[#E4E1DA] rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="award" className="w-4 h-4 text-[#2F7D5A]" />
                      <div>
                        <p className="text-xs font-bold text-[#14181F]">{training.proof.certificateFile || 'Certificate_Completion.pdf'}</p>
                        <p className="text-[10px] text-gray-500">{training.proof.certificateSize || '2.4 MB'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => previewDoc(training.proof.certificateFile || 'Certificate_Completion.pdf', 'certificate', training.id)}
                      className="btn-ops-secondary py-1 px-2 text-xs"
                    >
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {isReviewMode && training.status === 'Pending Sign-off' && (
                <div className="pt-3 border-t border-[#E4E1DA] space-y-3">
                  {!showResubmitBox ? (
                    <div className="flex items-center gap-2">
                      <button onClick={handleApprove} className="btn-ops-primary flex-1">
                        <Icon name="check-circle-2" className="w-4 h-4" />
                        Approve Sign-Off
                      </button>
                      <button onClick={() => setShowResubmitBox(true)} className="btn-ops-secondary flex-1 text-[#B3261E] border-red-200 hover:bg-red-50">
                        <Icon name="rotate-ccw" className="w-4 h-4" />
                        Request Revisions
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-3 bg-red-50 border border-red-200 rounded">
                      <label className="block text-xs font-semibold text-red-900">Revision Instructions for Employee</label>
                      <textarea 
                        rows="3" 
                        className="ops-textarea bg-white" 
                        placeholder="Detail the missing attendance records or learnings documentation..."
                        value={resubmitNotes}
                        onChange={(e) => setResubmitNotes(e.target.value)}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setShowResubmitBox(false)} className="btn-ops-secondary text-xs">Cancel</button>
                        <button onClick={handleResubmit} className="btn-ops-danger text-xs">Confirm Resubmit Request</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Upload Mode Form */
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-1">
                  1. Attendance Sheet / Log <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.png" 
                  onChange={(e) => setAttFile(e.target.files[0])}
                  className="ops-input text-xs"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">NABL / Lab log verified attendance sheet</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-1">
                  2. Certificate of Completion <span className="text-red-500">*</span>
                </label>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.png" 
                  onChange={(e) => setCertFile(e.target.files[0])}
                  className="ops-input text-xs"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">Official certificate with assessor seal</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14181F] mb-1">
                  3. Key Practical Learnings <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="4" 
                  className="ops-textarea" 
                  placeholder="Summarize 2-3 key practical takeaways and how they apply to your project deliverables..."
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  required
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="btn-ops-primary w-full">
                  <Icon name="upload" className="w-4 h-4" />
                  Submit Completion Proof
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
