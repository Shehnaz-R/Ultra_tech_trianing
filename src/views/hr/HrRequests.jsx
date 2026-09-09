
const { useState, useMemo } = React;

export function HrRequests() {
  const { state, store } = useStore();
  const [filter, setFilter] = useState('all');

  const requests = state.requests || [];

  const commonRequests = useMemo(() => {
    return requests.filter(r => r.isCommon && r.status !== 'Approved');
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (filter === 'all') return requests;
    if (filter === 'common') return requests.filter(r => r.isCommon);
    return requests.filter(r => r.status === filter);
  }, [requests, filter]);

  const handleBulkApprove = () => {
    const ids = commonRequests.map(r => r.id);
    if (ids.length === 0) {
      showToast("No common requests pending approval", "info");
      return;
    }
    const count = store.bulkApproveCommonRequests(ids);
    if (window.confetti) {
      window.confetti({ particleCount: 100, spread: 70 });
    }
    showToast(`1-Click Batch Approved ${count} common requests across departments!`, "success");
  };

  const handleApprove = (id, title) => {
    store.approveRequest(id);
    showToast(`Approved request for "${title}"`, "success");
  };

  const handleReject = (id, title) => {
    const reason = window.prompt("Enter rejection / deferral reason for applicant:", "Budget constraints in active cycle.");
    if (reason) {
      store.rejectRequest(id, reason);
      showToast(`Rejected request for "${title}"`, "info");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Training Requests Consolidation</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Consolidated requests across all 12 divisions with cross-department common training detection
          </p>
        </div>

        {commonRequests.length > 0 && (
          <button onClick={handleBulkApprove} className="btn-ops-primary bg-[#2F7D5A] hover:bg-green-800 border-green-800">
            <Icon name="check-check" className="w-4 h-4" />
            1-Click Bulk Approve Common ({commonRequests.length})
          </button>
        )}
      </div>

      {/* Common Training Banner */}
      {commonRequests.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-[#3B5BDB] rounded-lg">
              <Icon name="sparkles" className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-blue-900">Shared Curriculum Opportunity Detected</h4>
              <p className="text-xs text-blue-700 mt-0.5">
                {commonRequests.length} nominations share overlapping subject curricula across multiple departments. Bulk approve to schedule a joint in-house masterclass.
              </p>
            </div>
          </div>
          <button onClick={handleBulkApprove} className="btn-ops-primary text-xs whitespace-nowrap">
            Bulk Approve ({commonRequests.length})
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-white border border-[#E4E1DA] p-1 rounded-lg self-start text-xs">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'common', label: `Common Matches (${commonRequests.length})` },
          { id: 'Pending Head Review', label: 'Pending Head' },
          { id: 'Pending HR Approval', label: 'Pending HR' },
          { id: 'Approved', label: 'Approved' },
          { id: 'Rejected', label: 'Rejected' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              filter === tab.id ? 'bg-[#14181F] text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="ops-table text-xs w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Training Program</th>
                <th>Department</th>
                <th>Applicant</th>
                <th>Status</th>
                <th>Commonality</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No requests found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono font-bold">{r.id}</td>
                    <td className="font-bold text-[#14181F] max-w-xs truncate">{r.trainingTitle}</td>
                    <td>{r.department}</td>
                    <td>{r.applicantName}</td>
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
                      {r.isCommon ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          {r.departmentOverlapCount} depts overlap
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Specific</span>
                      )}
                    </td>
                    <td>
                      {r.status !== 'Approved' && r.status !== 'Rejected' ? (
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => handleApprove(r.id, r.trainingTitle)}
                            className="btn-ops-primary py-1 px-2 text-[11px]"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(r.id, r.trainingTitle)}
                            className="btn-ops-secondary text-red-600 hover:bg-red-50 py-1 px-2 text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Processed</span>
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
