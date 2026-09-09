
const { useState } = React;

export function LoginModal() {
  const { activeModal, closeModal, store } = useStore();
  const [email, setEmail] = useState('vikram.seth@ultratech.com');
  const [password, setPassword] = useState('password123');
  const [location, setLocation] = useState('Thane');

  const isOpen = activeModal && activeModal.name === 'login';

  const selectPersona = (role) => {
    store.setRole(role);
    closeModal();
    showToast(`Switched persona to ${role.toUpperCase()}`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let matchedRole = 'employee';
    if (email.includes('head') || email.includes('priya')) {
      matchedRole = 'head';
    } else if (email.includes('hr') || email.includes('vikram') || email.includes('admin')) {
      matchedRole = 'hr';
    }
    store.setRole(matchedRole);
    closeModal();
    showToast(`Authenticated as ${email} (${matchedRole.toUpperCase()}) - ${location}`, 'success');
  };

  return (
    <div id="login-modal-overlay" className={`ops-modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="ops-modal-box max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2563EB] text-white rounded-lg flex items-center justify-center font-black text-sm tracking-wider shadow-sm shrink-0">
              UT
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 leading-tight">UltraTech Portal Login</h3>
              <p className="text-xs text-gray-500">JWT Authenticated Access & Role Switcher</p>
            </div>
          </div>
          <button 
            id="btn-close-login-modal" 
            onClick={closeModal}
            className="text-gray-400 hover:text-black p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2.5">
              QUICK ONE-CLICK DEMO ACCESS
            </span>
            <div className="space-y-2">
              <button 
                type="button" 
                onClick={() => selectPersona('employee')}
                className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div>
                  <p className="font-bold text-sm text-gray-900 group-hover:text-[#2563EB] leading-snug">Rahul Sharma</p>
                  <p className="text-xs text-gray-500">Senior Environmental Analyst</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-[#2563EB] border border-[#BFDBFE] rounded bg-white">
                  EMPLOYEE
                </span>
              </button>

              <button 
                type="button" 
                onClick={() => selectPersona('head')}
                className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div>
                  <p className="font-bold text-sm text-gray-900 group-hover:text-[#2563EB] leading-snug">Priya Nair</p>
                  <p className="text-xs text-gray-500">Head of Environmental Media Monitoring</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-[#2563EB] border border-[#BFDBFE] rounded bg-white">
                  HEAD
                </span>
              </button>

              <button 
                type="button" 
                onClick={() => selectPersona('hr')}
                className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#2563EB] hover:bg-blue-50/40 text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div>
                  <p className="font-bold text-sm text-gray-900 group-hover:text-[#2563EB] leading-snug">Vikram Seth</p>
                  <p className="text-xs text-gray-500">GM - People, Culture & Capability (Corporate HR)</p>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-[#2563EB] border border-[#BFDBFE] rounded bg-white">
                  HR
                </span>
              </button>
            </div>
          </div>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-bold text-[10px] tracking-wider">
                OR SIGN IN WITH PASSWORD
              </span>
            </div>
          </div>

          <form id="manual-login-form" onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Branch / Location Access</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Icon name="map-pin" className="w-4 h-4" />
                </span>
                <select 
                  id="login-location-input" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="ops-select pl-9 text-xs font-semibold"
                >
                  <option value="Thane">Thane (HQ & Central Lab)</option>
                  <option value="Pune">Pune Branch</option>
                  <option value="Kochi">Kochi Lab</option>
                  <option value="Kolkata">Kolkata Regional Office</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">UltraTech Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Icon name="mail" className="w-4 h-4" />
                </span>
                <input 
                  type="email" 
                  id="login-email-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ops-input pl-9 text-xs" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-900 mb-1">Password</label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-400">
                  <Icon name="lock" className="w-4 h-4" />
                </span>
                <input 
                  type="password" 
                  id="login-password-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ops-input pl-9 text-xs" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-2 bg-[#111827] text-white hover:bg-black font-semibold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Icon name="shield" className="w-4 h-4 text-[#3B82F6]" />
              <span>Sign In to Portal</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
