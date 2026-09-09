
export function HrPromotions() {
  const { state, openModal } = useStore();
  const flags = state.promotionFlags || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Talent Tracks, Awards & Promotions</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Recognize top technical capability performers and evaluate candidates shortlisted by Department Heads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flags.map(f => (
          <div key={f.id} className="p-5 bg-white border border-[#E4E1DA] rounded-xl shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-[#B8860B] rounded-lg">
                  <Icon name="award" className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#14181F]">{f.userName}</h3>
                  <p className="text-xs text-gray-500">{f.department}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
                {f.status}
              </span>
            </div>

            <div className="p-3 bg-[#F7F6F3] border border-[#E4E1DA] rounded-lg text-xs space-y-1">
              <p><strong>Recognition Track:</strong> <span className="font-bold text-[#B8860B]">{f.category}</span></p>
              <p><strong>Nominated By:</strong> {f.flaggedBy} on {f.flaggedDate}</p>
              <p><strong>Notes:</strong> {f.notes}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
              <span>{f.tenureYears} Yrs Experience</span>
              <span className="font-bold text-[#2F7D5A]">{f.completedTrainings} Verified Trainings</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
