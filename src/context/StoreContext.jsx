
const { createContext, useContext, useState, useEffect, useCallback } = React;

export const StoreContext = createContext(null);

export function StoreProvider({ children, storeInstance }) {
  const [state, setState] = useState(() => storeInstance.state);
  const [activeModal, setActiveModal] = useState(null); // { name: string, data?: any }
  const [activeDrawer, setActiveDrawer] = useState(null); // { name: string, data?: any }
  const [docPreview, setDocPreview] = useState(null); // { filename, docType, trainingId }
  const [toasts, setToasts] = useState([]);
  const [headRequestTab, setHeadRequestTab] = useState('self'); // 'self' | 'team'

  useEffect(() => {
    const unsubscribe = storeInstance.subscribe((newState) => {
      setState({ ...newState });
    });

    const handleToast = (e) => {
      const { message, type, title } = e.detail;
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, title }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    };

    window.addEventListener('ops-toast', handleToast);
    return () => {
      unsubscribe();
      window.removeEventListener('ops-toast', handleToast);
    };
  }, [storeInstance]);

  // Re-run Lucide icons whenever state or views change safely
  useEffect(() => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      const timer = setTimeout(() => {
        try {
          window.lucide.createIcons();
        } catch (e) {
          // ignore icon scanner exceptions
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [state.currentView, state.currentRole, activeModal, activeDrawer]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openModal = useCallback((name, data = null) => {
    setActiveModal({ name, data });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const openDrawer = useCallback((name, data = null) => {
    setActiveDrawer({ name, data });
  }, []);

  const closeDrawer = useCallback(() => {
    setActiveDrawer(null);
  }, []);

  const previewDoc = useCallback((filename, docType, trainingId = null) => {
    setDocPreview({ filename, docType, trainingId });
    openModal('docPreview', { filename, docType, trainingId });
  }, [openModal]);

  const value = {
    state,
    store: storeInstance,
    currentUser: storeInstance.getCurrentUser(),
    scopeInfo: storeInstance.getScopeInfo(),
    unreadCount: storeInstance.getUnreadCount(),
    activeModal,
    openModal,
    closeModal,
    activeDrawer,
    openDrawer,
    closeDrawer,
    docPreview,
    previewDoc,
    toasts,
    removeToast,
    headRequestTab,
    setHeadRequestTab
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
