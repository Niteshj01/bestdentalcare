import { Link } from "react-router-dom";

interface TopBarProps {
  currentTab: string;
  adminEmail: string | null;
  onHamburgerClick: () => void;
}

export default function TopBar({ currentTab, adminEmail, onHamburgerClick }: TopBarProps) {
  const getTabTitle = () => {
    switch (currentTab) {
      case "dashboard": return "Command Core";
      case "services": return "Clinical Catalog";
      case "doctors": return "Doctors & Specialists";
      case "gallery": return "Gallery Portfolio";
      case "articles": return "Aesthetic Journal Care";
      case "videos": return "Consultation Video Library";
      case "clinic-info": return "Studio Information Setup";
      case "appointments": return "Appointments Ledger";
      default: return "Admin Workspace";
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-[35] shadow-sm">
      <div className="flex items-center gap-4">
        {/* Hamburger trigger for mobile */}
        <button
          onClick={onHamburgerClick}
          className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-full transition-all cursor-pointer border border-gray-100"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-lg leading-none">menu</span>
        </button>

        <div className="flex flex-col">
          <h2 className="font-sans text-sm md:text-base font-bold text-gray-900 uppercase tracking-widest leading-none">
            {getTabTitle()}
          </h2>
          <span className="font-sans text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            Manage your clinic's digital workspace
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Main clinic link */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary-mint/20 text-primary-mint hover:bg-primary-mint/5 font-sans font-bold text-[10.5px] uppercase tracking-widest transition-all"
        >
          <span className="material-symbols-outlined text-sm leading-none">open_in_new</span>
          <span>View Site</span>
        </Link>

        {/* Profile badge */}
        <div className="flex items-center gap-2.5 border-l border-gray-100 pl-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="font-sans text-[11px] font-bold text-gray-700">Administrator</span>
            <span className="font-sans text-[9px] text-[#42b58c] font-medium tracking-tight mt-0.5 max-w-[130px] truncate">
              {adminEmail || "admin@drskydentistry.com"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-mint/10 border border-primary-mint/20 flex items-center justify-center text-primary-mint shadow-inner">
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
          </div>
        </div>
      </div>
    </header>
  );
}
