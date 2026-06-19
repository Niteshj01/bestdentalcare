import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export default function Modal({ isOpen, title, onClose, children, maxWidthClass = "max-w-xl" }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[8888] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-[#00120a]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Scrollable Container */}
      <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
        {/* Modal content element */}
        <div className={`relative w-full ${maxWidthClass} bg-white rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,33,19,0.25)] border border-primary-mint/10 transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]`}>
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-sans text-sm md:text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-sm leading-none font-semibold">close</span>
            </button>
          </div>
          
          {/* Main Content Areas with scrolled viewports */}
          <div className="p-6 overflow-y-auto flex-1 font-sans text-xs md:text-sm text-gray-700">
            {children}
          </div>
          
        </div>
      </div>
    </div>
  );
}
