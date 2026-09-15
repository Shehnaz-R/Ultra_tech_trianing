
export function HrReports() {
  const { state } = useStore();

  const handleExportFullCSV = () => {
    const headers = ['Record ID', 'Employee Name', 'Department', 'Course Title', 'Category', 'Mode', 'Status', 'Sign-Off Date', 'Signed Off By'];
    const rows = [headers];
    state.trainings.forEach(t => {
      rows.push([
        t.id,
        t.userName,
        t.department,
        t.title,
        t.category,
        t.mode,
        t.status,
        t.signoffDate || 'N/A',
        t.signedOffBy || 'N/A'
      ]);
    });
    downloadCSV(rows, `UltraTech_Comprehensive_Training_Compliance_${Date.now()}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#14181F]">Compliance Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ISO 17025 compliance audit logs, training hour completion metrics, and structural privacy export
          </p>
        </div>

        <button onClick={handleExportFullCSV} className="btn-ops-primary">
          <Icon name="download" className="w-3.5 h-3.5" />
          Export Organization CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Compliance Rate</span>
          <p className="text-2xl font-black text-[#2F7D5A] mt-2">94.2%</p>
          <p className="text-[11px] text-gray-500 mt-1">Audit-ready documentation</p>
        </div>

        <div className="p-4 bg-white border border-[#E4E1DA] rounded-xl shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase">Total Training Hours</span>
          <p className="text-2xl font-black text-[#14181F] mt-2">2,480 hrs</p>
          <p className="text-[11px] text-gray-500 mt-1">NABL accredited hours logged</p>
        </div>
      </div>

      <div className="bg-white border border-[#E4E1DA] rounded-xl shadow-xs p-5 space-y-4">
        <h3 className="font-bold text-sm text-[#14181F]">Regulatory Quality & Audit Assurance</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          UltraTech Environmental Consultancy & Laboratory maintains NABL accreditation (ISO/IEC 17025:2017) and QCI-NABET EIA consultancy accreditation. This portal enforces auditable training sign-offs, 7-day SLA governance, and verified attendance sheets without exposing sensitive payroll information.
        </p>
      </div>
    </div>
  );
}
