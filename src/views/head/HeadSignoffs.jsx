
export function HeadSignoffs() {
  const { currentUser, state, openDrawer, previewDoc } = useStore();

  const pendingList = state.trainings.filter(t => 
    t.department === currentUser.department && t.status === 'Pending Sign-off'
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#E4E1DA]">
        <div>
          <h1 className="text-xl font-bold text-[#14181F]">Completion Sign-Off Queue</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Review employee proof submissions within 7 days. Submissions older than 7 days automatically lock and escalate to Corporate HR.
          </p>
        </div>
      </div>

      <div className="ops-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Training Program</th>
                <th>Submission Date</th>
                <th>Countdown until Auto-Escalation</th>
                <th>Proof Documents</th>
                <th>Review Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingList.length > 0 ? (
                pendingList.map(t => {
                  const isOverdue = t.daysElapsed >= 7;
                  const daysLeft = Math.max(0, 7 - (t.daysElapsed || 0));

                  return (
                    <tr key={t.id} className={isOverdue ? 'bg-[#FFF5F5]' : ''}>
                      <td>
                        <div className="font-bold text-xs text-[#14181F]">{t.userName}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{t.department}</div>
                      </td>
                      <td className="max-w-xs">
                        <div className="font-semibold text-xs text-[#14181F]">{t.title}</div>
                        <div className="text-[11px] text-gray-500">{t.category}</div>
                      </td>
                      <td className="whitespace-nowrap text-xs text-gray-600">{t.submissionDate}</td>
                      <td>
                        {isOverdue || daysLeft === 0 ? (
                          <span className="countdown-pill countdown-overdue" title="Exceeded 7-day review limit. Auto-escalated to Corporate HR.">
                            <Icon name="alert-octagon" className="w-3 h-3 shrink-0" />
                            <span>Overdue · Escalated to HR</span>
                          </span>
                        ) : daysLeft <= 1 ? (
                          <span className="countdown-pill countdown-urgent" title={`Urgent: Auto-escalates in ${daysLeft} day`}>
                            <Icon name="alert-circle" className="w-3 h-3 text-[#991B1B] shrink-0" />
                            <span>{daysLeft} day left!</span>
                          </span>
                        ) : daysLeft <= 3 ? (
                          <span className="countdown-pill countdown-warning" title="Warning: Deadline approaching">
                            <Icon name="clock" className="w-3 h-3 text-[#92400E] shrink-0" />
                            <span>{daysLeft} days left</span>
                          </span>
                        ) : (
                          <span className="countdown-pill countdown-safe" title="Standard review window">
                            <Icon name="hourglass" className="w-3 h-3 text-gray-500 shrink-0" />
                            <span>{daysLeft} days left</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          <button 
                            type="button"
                            onClick={() => previewDoc(t.proof ? t.proof.attendanceFile : 'Attendance.pdf', 'Attendance Sheet', t.id)}
                            className="text-[11px] text-[#3B5BDB] hover:underline flex items-center gap-1 text-left cursor-pointer"
                          >
                            <Icon name="file-text" className="w-3.5 h-3.5 text-[#2F7D5A] shrink-0" />
                            <span>{t.proof ? t.proof.attendanceFile : 'Attendance.pdf'}</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => previewDoc(t.proof ? t.proof.certificateFile : 'Certificate.pdf', 'Certificate', t.id)}
                            className="text-[11px] text-[#3B5BDB] hover:underline flex items-center gap-1 text-left cursor-pointer"
                          >
                            <Icon name="award" className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                            <span>{t.proof ? t.proof.certificateFile : 'Certificate.pdf'}</span>
                          </button>
                        </div>
                      </td>
                      <td>
                        {isOverdue ? (
                          <div className="space-y-1">
                            <span className="text-[11px] text-[#B3261E] font-bold block">Escalated to HR</span>
                            <span className="text-[10px] text-gray-400 block">7-day SLA passed (Read-Only)</span>
                          </div>
                        ) : (
                          <button 
                            type="button"
                            onClick={() => openDrawer('proofReview', { trainingId: t.id })}
                            className="btn-ops-primary py-1 px-3 text-xs flex items-center justify-center cursor-pointer whitespace-nowrap"
                          >
                            Review & Sign-Off
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 text-xs">
                    No pending submissions in sign-off queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
