
const { useState } = React;

export function App() {
  const { state } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderCurrentView = () => {
    switch (state.currentView) {
      // Employee
      case 'employee-home':
        return <EmployeeHome />;
      case 'employee-profile':
        return <EmployeeProfile />;
      case 'employee-trainings':
        return <EmployeeTrainings />;
      case 'employee-request':
        return <EmployeeRequest />;
      case 'employee-notifications':
        return <EmployeeNotifications />;

      // Department Head
      case 'head-home':
        return <HeadHome />;
      case 'head-profile':
        return <EmployeeProfile />;
      case 'head-trainings':
        return <EmployeeTrainings />;
      case 'head-request':
        return <HeadRequest />;
      case 'head-team':
        return <HeadTeam />;
      case 'head-signoffs':
        return <HeadSignoffs />;
      case 'head-request-status':
        return <HeadRequestStatus />;
      case 'head-reports':
        return <HeadReports />;
      case 'head-notifications':
        return <EmployeeNotifications />;

      // Corporate HR Admin
      case 'hr-home':
        return <HrHome />;
      case 'hr-profile':
        return <EmployeeProfile />;
      case 'hr-cycle':
        return <HrCycle />;
      case 'hr-requests':
        return <HrRequests />;
      case 'hr-calendar':
        return <HrCalendar />;
      case 'hr-directory':
        return <HrDirectory />;
      case 'hr-escalations':
        return <HrEscalations />;
      case 'hr-promotions':
        return <HrPromotions />;
      case 'hr-reports':
        return <HrReports />;

      default:
        return <EmployeeHome />;
    }
  };

  return (
    <div className="bg-[#F7F6F3] text-[#14181F] flex flex-col h-screen overflow-hidden antialiased select-none-text">
      {/* TopBar */}
      <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main id="main-content" className="flex-1 bg-[#F7F6F3] overflow-y-auto p-4 md:p-6 relative">
          <div id="view-mount" className="max-w-7xl mx-auto space-y-5 pb-16">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Modals & Drawers */}
      <LoginModal />
      <NotificationsDrawer />
      <ProofDrawer />
      <EscalateModal />
      <DocPreviewModal />
      <CreateEventModal />
      <AssignCandidatesModal />
      <PromotionModal />
      <EmployeeDetailModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
