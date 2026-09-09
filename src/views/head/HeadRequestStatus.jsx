
export function HeadRequestStatus() {
  const { currentUser, state, openModal } = useStore();

  const deptRequests = state.requests.filter(r => 
    r.department === currentUser.department || r.headId === currentUser.id
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Training Request Status</h1>
          <p className="text-xs text-gray-500 mt-0.5">Tracking status of department nominations forwarded to Corporate HR</p>
        </div>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ops-table text-xs w-full">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Training Title</th>
                <th>Applicant / Batch</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deptRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No requests submitted for this department yet.
                  </td>
                </tr>
              ) : (
                deptRequests.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono font-bold">{r.id}</td>
                    <td className="font-bold text-[#14181F] max-w-xs truncate">{r.trainingTitle}</td>
                    <td>{r.applicantName}</td>
                    <td><span className="font-semibold text-gray-600">{r.type}</span></td>
                    <td>
                      <span className={`status-pill ${
                        r.status === 'Approved' ? 'status-completed' :
                        r.status === 'Rejected' ? 'status-rejected' :
                        r.status === 'Escalated' ? 'status-escalated' : 'status-pending'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === 'Rejected' && (
                        <button 
                          onClick={() => openModal('escalate', r)}
                          className="btn-ops-danger text-[11px] py-1 px-2"
                        >
                          <Icon name="alert-triangle" className="w-3 h-3" />
                          Appeal to HR
                        </button>
                      )}
                      {r.status === 'Approved' && (
                        <span className="text-[11px] text-[#2F7D5A] font-bold">Scheduled in Calendar</span>
                      )}
                      {r.status !== 'Rejected' && r.status !== 'Approved' && (
                        <span className="text-[11px] text-gray-400">In HR Review</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
