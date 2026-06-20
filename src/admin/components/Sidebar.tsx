import { Link, useLocation } from "react-router-dom";
import BDLogo from "../../components/BDLogo";

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onChangePassword: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ currentTab, onSelectTab, onLogout, onChangePassword, mobileOpen, setMobileOpen }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "services", label: "Services", icon: "healing" },
    { id: "doctors", label: "Doctors", icon: "medical_services" },
    { id: "gallery", label: "Gallery", icon: "photo_library" },
    { id: "articles", label: "Articles", icon: "article" },
    { id: "videos", label: "Videos", icon: "video_library" },
    { id: "clinic-info", label: "Clinic Info", icon: "store" },
    { id: "appointments", label: "Appointments", icon: "calendar_month" }
  ];

  const handleItemClick = (id: string) => {
    onSelectTab(id);
    setMobileOpen(false);
  };

  const navClasses = (id: string) => {
    const isActive = currentTab === id;
    return `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-sans text-[11.5px] uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
      isActive 
        ? "bg-primary-mint text-white shadow-md shadow-primary-mint/15 scale-[1.02]" 
        : "text-[#b2cbd0] hover:text-[#dcf9f0] hover:bg-white/5"
    }`;
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar sidebar node */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-[#001D11] border-r border-[#002f1d] flex flex-col z-[45] transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="h-20 border-b border-[#002f1d] px-6 flex items-center gap-3">
          <BDLogo className="w-8 h-8 text-primary-mint" />
          <div className="flex flex-col">
            <span className="font-cormorant text-md font-bold text-white tracking-[0.1em] uppercase leading-tight">
              Dr. Sky Dentistry
            </span>
            <span className="font-sans text-[9px] text-[#2ebd90] uppercase tracking-widest font-semibold">
              Atelier Admin Portal
            </span>
          </div>
        </div>

        {/* Dynamic menu items list */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={navClasses(item.id)}
            >
              <span className="material-symbols-outlined text-[18px] leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action controls footer */}
        <div className="p-4 border-t border-[#002f1d] flex flex-col gap-2">
          <button
            onClick={() => {
              onChangePassword();
              setMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-[#dfba5c]/15 text-[#dfba5c] hover:bg-[#dfba5c]/25 rounded-xl font-sans text-[11px] uppercase tracking-widest font-bold border border-[#dfba5c]/30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">key</span>
            <span>Change Password</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl font-sans text-[11px] uppercase tracking-widest font-bold border border-rose-500/20 text-rose-400 hover:text-white hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">logout</span>
            <span>Exit Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
