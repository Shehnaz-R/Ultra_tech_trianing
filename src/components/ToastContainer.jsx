
export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div id="toast-container" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let borderColor = 'border-[#E4E1DA]';
        let iconName = 'info';
        let iconColor = 'text-[#3B5BDB]';

        if (toast.type === 'success') {
          borderColor = 'border-[#A3D9C1]';
          iconName = 'check-circle-2';
          iconColor = 'text-[#2F7D5A]';
        } else if (toast.type === 'error' || toast.type === 'danger') {
          borderColor = 'border-[#FCA5A5]';
          iconName = 'alert-circle';
          iconColor = 'text-[#B3261E]';
        } else if (toast.type === 'warning') {
          borderColor = 'border-[#FCD34D]';
          iconName = 'alert-triangle';
          iconColor = 'text-[#B8860B]';
        }

        return (
          <div
            key={toast.id}
            className={`p-3 bg-white border ${borderColor} rounded shadow-md pointer-events-auto flex items-start gap-2.5 transition-all duration-300 max-w-sm`}
          >
            <Icon name={iconName} className={`w-4 h-4 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 text-xs">
              {toast.title && <p className="font-bold text-[#14181F] leading-tight">{toast.title}</p>}
              <p className="text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button 
              className="text-gray-400 hover:text-black p-0.5 ml-1" 
              onClick={() => removeToast(toast.id)}
            >
              <Icon name="x" className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
