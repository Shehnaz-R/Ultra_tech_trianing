
export function HrCalendar() {
  const { state, openModal } = useStore();
  const events = state.events || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Training Calendar & Allocation</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Schedule centralized in-house workshops, approve external training programs, and assign candidate cohorts
          </p>
        </div>

        <button onClick={() => openModal('createEvent')} className="btn-ops-primary">
          <Icon name="calendar-plus" className="w-3.5 h-3.5" />
          Schedule Training Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(evt => {
          const assignedCount = (evt.assignedUserIds || []).length;
          const capacity = evt.capacity || 20;

          return (
            <div key={evt.id} className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    evt.mode === 'External' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                  }`}>
                    {evt.mode} Training
                  </span>
                  <span className="text-xs font-mono text-gray-400">{evt.id}</span>
                </div>

                <h3 className="font-bold text-sm text-[#14181F]">{evt.title}</h3>
                <p className="text-xs text-gray-500">{evt.category}</p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-1">
                  <p><strong>Dates:</strong> {evt.date} {evt.endDate ? `to ${evt.endDate}` : ''}</p>
                  <p><strong>Instructor:</strong> {evt.instructor || 'Lead Specialist'}</p>
                  <p className="col-span-2"><strong>Venue:</strong> {evt.venue}</p>
                </div>

                {evt.mode === 'External' && (
                  <div className="p-2 bg-yellow-50/50 border border-yellow-200 rounded text-[11px] text-yellow-800">
                    Sponsorship: {evt.reimbursementPercent || 80}% · HOD Approval Required
                  </div>
                )}

                {/* Capacity Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-semibold">
                    <span>Allocated Candidates:</span>
                    <span>{assignedCount} / {capacity} Seats</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#3B5BDB] h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (assignedCount / capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4E1DA] flex items-center justify-end gap-2">
                <button 
                  onClick={() => openModal('assignCandidates', { event: evt })}
                  className="btn-ops-primary text-xs py-1 px-3"
                >
                  <Icon name="user-plus" className="w-3.5 h-3.5" />
                  Allocate Candidates
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
