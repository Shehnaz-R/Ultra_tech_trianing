
function initReactApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element #root not found!");
    return;
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StoreProvider storeInstance={store}>
      <App />
    </StoreProvider>
  );

  // Expose window.app helper for legacy / programmatic testing
  window.app = {
    store,
    selectLoginPersona: (role, email) => {
      store.setRole(role);
      showToast(`Switched to ${role.toUpperCase()}`, 'info');
    },
    handleManualLogin: (e) => {
      if (e) e.preventDefault();
      const email = document.getElementById('login-email-input')?.value || 'vikram.seth@ultratech.com';
      let matchedRole = 'employee';
      if (email.includes('head') || email.includes('priya')) matchedRole = 'head';
      else if (email.includes('hr') || email.includes('vikram')) matchedRole = 'hr';
      store.setRole(matchedRole);
      showToast(`Logged in as ${matchedRole.toUpperCase()}`, 'success');
    },
    handleTopbarDeptFilter: (deptId) => {
      store.setDepartmentFilter(deptId);
    },
    handleTopbarBranchFilter: (branch) => {
      showToast(`Branch filtered: ${branch}`, 'info');
    },
    openPromotionModal: (userId) => {
      window.dispatchEvent(new CustomEvent('ops-open-modal', { detail: { name: 'promotion', data: { userId } } }));
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initReactApp);
} else {
  initReactApp();
}
