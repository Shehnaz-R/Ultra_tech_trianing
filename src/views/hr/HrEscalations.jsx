
const { useState } = React;

export function HrEscalations() {
  const { state, store } = useStore();
  const [tab, setTab] = useState('signoffs'); // 'signoffs' | 'appeals'

  const overdueSignoffs = state.trainings.filter(t => 
    t.status === 'Pending Sign-off' && calculateCountdown(t.daysElapsed).overdue
  );

  const appeals = state.requests.filter(r => r.status === 'Escalated');

  const handleResolveSignoff = (trainingId, resolution) => {
    const notes = window.prompt(`Enter HR decision note for ${resolution}:`, 'HR Executive Council approval due to 7-day SLA expiration.');
    if (notes) {
      store.resolveEscalation(trainingId, 'signoff', resolution, notes);
      showToast(`Resolved overdue sign-off: ${resolution}`, 'success');
    }
  };

  const handleResolveAppeal = (requestId, resolution) => {
    const notes = window.prompt(`Enter HR decision note for ${resolution}:`, 'Appeal justified on critical project deliverable grounds.');
    if (notes) {
      store.resolveEscalation(requestId, 'appeal', resolution, notes);
      showToast(`Resolved request appeal: ${resolution}`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#14181F]">Escalations Governance Hub</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Secondary executive review for 7-day overdue sign-offs and rejected training nomination appeals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E4E1DA] text-xs">
        <button
          onClick={() => setTab('signoffs')}
          className={`py-2.5 px-4 font-bold border-b-2 cursor-pointer transition-colors ${
            tab === 'signoffs' 
              ? 'border-[#B3261E] text-[#B3261E]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Overdue Sign-Offs (Exceeded 7-Day SLA) ({overdueSignoffs.length})
        </button>
        <button
          onClick={() => setTab('appeals')}
          className={`py-2.5 px-4 font-bold border-b-2 cursor-pointer transition-colors ${
            tab === 'appeals' 
              ? 'border-[#B3261E] text-[#B3261E]' 
              : 'border-transparent text-gray-500 hover:text-black'
          }`}
        >
          Rejected Request Appeals ({appeals.length})
        </button>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        {tab === 'signoffs' ? (
          <div className="divide-y divide-[#EFECE6]">
            {overdueSignoffs.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No overdue sign-offs. All department heads are within the 7-day review window.
              </div>
            ) : (
              overdueSignoffs.map(t => (
                <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#14181F]">{t.userName}</span>
                      <span className="text-xs text-gray-500">— {t.title}</span>
                      <span className="status-pill status-escalated">SLA EXPIRED: {t.daysElapsed}d Elapsed</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Department: {t.department} · Submitted: {t.submissionDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleResolveSignoff(t.id, 'Approve')}
                      className="btn-ops-primary text-xs bg-[#2F7D5A] border-green-800"
                    >
                      HR Force-Approve
                    </button>
                    <button 
                      onClick={() => handleResolveSignoff(t.id, 'Resubmit')}
                      className="btn-ops-secondary text-xs text-red-600"
                    >
                      Return to Employee
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#EFECE6]">
            {appeals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No active employee nomination appeals pending HR board resolution.
              </div>
            ) : (
              appeals.map(r => (
                <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#14181F]">{r.applicantName}</span>
                      <span className="text-xs text-gray-500">— {r.trainingTitle}</span>
                      <span className="status-pill status-escalated">Appealed</span>
                    </div>
                    <p className="text-xs text-gray-600">Department: {r.department}</p>
                    <div className="p-2.5 bg-red-50/50 border border-red-200 rounded text-xs text-red-900 mt-2">
                      <strong>Appeal Justification:</strong> {r.appealNote}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleResolveAppeal(r.id, 'Approve')}
                      className="btn-ops-primary text-xs bg-[#2F7D5A] border-green-800"
                    >
                      Uphold Appeal (Approve)
                    </button>
                    <button 
                      onClick={() => handleResolveAppeal(r.id, 'Reject')}
                      className="btn-ops-secondary text-xs text-red-600"
                    >
                      Dismiss Appeal
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
