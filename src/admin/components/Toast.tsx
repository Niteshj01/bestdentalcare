import { useEffect } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const bgClasses = {
    success: "bg-emerald-600 border border-emerald-500/20 text-white shadow-[0_8px_30px_rgba(16,185,129,0.3)]",
    error: "bg-rose-600 border border-rose-500/20 text-white shadow-[0_8px_30px_rgba(244,63,94,0.3)]",
    info: "bg-[#112D1F] border border-primary-mint/25 text-white shadow-xl"
  };

  const iconName = {
    success: "check_circle",
    error: "cancel",
    info: "info"
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] animate-bounce-short">
      <div className={`flex items-center gap-3.5 px-6 py-4 rounded-2xl ${bgClasses[toast.type]} font-sans transition-all duration-300 transform translate-y-0 scale-100`}>
        <span className="material-symbols-outlined text-lg leading-none font-medium">
          {iconName[toast.type]}
        </span>
        <span className="text-[12.5px] font-medium tracking-wide leading-none">{toast.message}</span>
        <button 
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity cursor-pointer text-white/70"
        >
          <span className="material-symbols-outlined text-base leading-none">close</span>
        </button>
      </div>
    </div>
  );
}
