
const { useState } = React;

export function EmployeeTrainings() {
  const { state, currentUser, openDrawer, previewDoc } = useStore();
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'In Progress' | 'Completed' | 'Upcoming'

  const myTrainings = state.trainings.filter(t => t.userId === currentUser.id);

  const filteredTrainings = myTrainings.filter(t => {
    if (filterTab === 'all') return true;
    if (filterTab === 'In Progress') return t.status === 'In Progress' || t.status === 'Pending Sign-off';
    return t.status === filterTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">My Training Programs</h1>
          <p className="text-xs text-gray-500 mt-0.5">Assigned workshops, progress tracker & completion proof submission</p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 bg-white border border-[#E4E1DA] p-1 rounded-lg self-start sm:self-auto text-xs">
          {['all', 'In Progress', 'Completed', 'Upcoming'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${
                filterTab === tab ? 'bg-[#14181F] text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab === 'all' ? 'All Trainings' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="divide-y divide-[#EFECE6]">
          {filteredTrainings.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No trainings found under this filter.
            </div>
          ) : (
            filteredTrainings.map(t => {
              const countdown = calculateCountdown(t.daysElapsed);
              return (
                <div key={t.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#14181F]">{t.title}</span>
                      <span className={`status-pill ${
                        t.status === 'Completed' ? 'status-completed' :
                        t.status === 'In Progress' ? 'status-in-progress' :
                        t.status === 'Pending Sign-off' ? 'status-pending' : 'status-upcoming'
                      }`}>
                        {t.status}
                      </span>
                      {t.status === 'Pending Sign-off' && (
                        <span className={`status-pill ${countdown.pillClass}`}>
                          7-Day Sign-Off: {countdown.status} ({countdown.daysLeft}d left)
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                      <span><strong>Category:</strong> {t.category}</span>
                      <span><strong>Mode:</strong> {t.mode}</span>
                      <span><strong>Dates:</strong> {t.scheduledDate} {t.endDate ? `to ${t.endDate}` : ''}</span>
                    </div>
                    {t.venue && (
                      <p className="text-xs text-gray-500"><strong>Venue:</strong> {t.venue}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {t.status === 'In Progress' && (
                      <button 
                        onClick={() => openDrawer('proofUpload', { trainingId: t.id })}
                        className="btn-ops-primary text-xs"
                      >
                        <Icon name="upload" className="w-3.5 h-3.5" />
                        Submit Proof
                      </button>
                    )}

                    {t.status === 'Pending Sign-off' && (
                      <button 
                        onClick={() => openDrawer('proofDetail', { trainingId: t.id })}
                        className="btn-ops-secondary text-xs"
                      >
                        <Icon name="eye" className="w-3.5 h-3.5" />
                        Review Submitted Proof
                      </button>
                    )}

                    {t.status === 'Completed' && (
                      <button 
                        onClick={() => previewDoc(t.proof ? t.proof.certificateFile : 'Certificate_Completion.pdf', 'certificate', t.id)}
                        className="btn-ops-secondary text-xs"
                      >
                        <Icon name="award" className="w-3.5 h-3.5 text-[#2F7D5A]" />
                        View Certificate
                      </button>
                    )}
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
