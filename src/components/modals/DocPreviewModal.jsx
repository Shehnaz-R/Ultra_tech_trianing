
export function DocPreviewModal() {
  const { activeModal, closeModal, state } = useStore();
  const isOpen = activeModal && activeModal.name === 'docPreview';
  const data = activeModal ? activeModal.data : null;

  const training = data && data.trainingId ? state.trainings.find(t => t.id === data.trainingId) : null;
  const filename = data ? data.filename : 'Document_Preview.pdf';
  const isCert = data && data.docType === 'certificate';

  return (
    <div id="doc-preview-modal" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box max-w-2xl max-h-[85vh] flex flex-col">
        <div className="p-3.5 border-b border-[#E4E1DA] flex items-center justify-between bg-[#FBFBFA]">
          <div className="flex items-center gap-2">
            <Icon name="file-check-2" className="w-4 h-4 text-[#2F7D5A]" />
            <span id="doc-preview-filename" className="text-xs font-bold text-[#14181F]">{filename}</span>
          </div>
          <button id="btn-close-doc-preview" onClick={closeModal} className="p-1 text-gray-400 hover:text-black rounded">
            <Icon name="x" className="w-4 h-4" />
          </button>
        </div>
        
        <div id="doc-preview-body" className="p-5 overflow-y-auto bg-gray-50 flex-1">
          {isCert ? (
            <div className="bg-white border-4 border-double border-[#2F7D5A] p-6 rounded-lg shadow-sm text-center space-y-3">
              <div className="text-xs font-bold text-[#2F7D5A] tracking-widest uppercase">UltraTech Environmental Consultancy & Laboratory</div>
              <h2 className="text-xl font-extrabold text-[#14181F]">CERTIFICATE OF COMPETENCY</h2>
              <p className="text-xs text-gray-600">This is to certify that</p>
              <p className="text-lg font-bold text-[#14181F] border-b border-gray-300 pb-1 max-w-sm mx-auto">
                {training ? training.userName : 'Employee Candidate'}
              </p>
              <p className="text-xs text-gray-600">has successfully completed technical masterclass in</p>
              <p className="text-sm font-bold text-[#3B5BDB]">
                {training ? training.title : 'Environmental Operations Protocol'}
              </p>
              <div className="pt-4 flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100">
                <span>Date: {training ? (training.completedDate || 'Sep 2026') : 'Sep 2026'}</span>
                <span>Sign-off: {training ? (training.signedOffBy || 'Priya Nair, HOD') : 'QCI Lead Assessor'}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E4E1DA] p-5 rounded-lg shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-sm text-[#14181F]">TRAINING ATTENDANCE LOG</span>
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">100% ATTENDANCE VERIFIED</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <p><strong>Candidate:</strong> {training ? training.userName : 'Rahul Sharma'}</p>
                <p><strong>Training:</strong> {training ? training.title : 'Field Sampling Protocols'}</p>
                <p><strong>Duration:</strong> 16 Contact Hours</p>
                <p><strong>Lab Facility:</strong> Central Testing Lab, Thane</p>
              </div>
              <div className="p-3 bg-gray-50 border rounded text-[11px] text-gray-500">
                Verified biometric check-in/out records archived in UltraTech ERP compliance module.
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-[#FBFBFA] border-t border-[#E4E1DA] flex items-center justify-between">
          <span className="text-[11px] text-gray-500 flex items-center gap-1">
            <Icon name="shield-check" className="w-3.5 h-3.5 text-[#2F7D5A]" />
            Digitally Signed · UltraTech Environmental Quality Assurance (ISO 17025:2017)
          </span>
          <button id="btn-close-doc-preview-bottom" onClick={closeModal} className="btn-ops-secondary">Close Document</button>
        </div>
      </div>
    </div>
  );
}
