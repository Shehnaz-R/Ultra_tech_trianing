
export function HeadSignoffs() {
  const { currentUser, state, openDrawer, store } = useStore();

  const pendingList = state.trainings.filter(t => 
    t.department === currentUser.department && (t.status === 'Pending Sign-off' || t.status === 'Resubmit Requested')
  );

  const handleQuickApprove = (training) => {
    store.approveSignoff(training.id, 'Verified completion attendance and learning outcomes.');
    if (window.confetti) {
      window.confetti({ particleCount: 70, spread: 60 });
    }
    showToast(`Approved sign-off for ${training.userName}!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#14181F]">Training Sign-Off Queue</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review completion proofs with 7-day auto-escalation countdown SLA
        </p>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="divide-y divide-[#EFECE6]">
          {pendingList.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400 space-y-1">
              <Icon name="check-circle" className="w-8 h-8 text-[#2F7D5A] mx-auto opacity-40" />
              <p className="font-bold text-sm text-gray-700">Sign-Off Queue Clear</p>
              <p>No pending proofs requiring Department Head verification.</p>
            </div>
          ) : (
            pendingList.map(t => {
              const cd = calculateCountdown(t.daysElapsed);
              return (
                <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#14181F]">{t.userName}</span>
                      <span className="text-xs text-gray-500">— {t.title}</span>
                      <span className={`status-pill ${cd.pillClass}`}>
                        {cd.status} ({cd.daysLeft}d left)
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Submitted: {t.submissionDate || 'Recently'} · Category: {t.category} · Mode: {t.mode}
                    </p>

                    {t.proof && t.proof.learnings && (
                      <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-1 italic">
                        "{t.proof.learnings}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => openDrawer('proofReview', { trainingId: t.id })}
                      className="btn-ops-secondary text-xs"
                    >
                      <Icon name="file-text" className="w-3.5 h-3.5" />
                      Review Documents
                    </button>
                    <button 
                      onClick={() => handleQuickApprove(t)}
                      className="btn-ops-primary text-xs"
                    >
                      <Icon name="check" className="w-3.5 h-3.5" />
                      Approve Sign-Off
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
