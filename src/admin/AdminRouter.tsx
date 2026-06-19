import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

// Components
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Toast, { ToastMessage } from "./components/Toast";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Doctors from "./pages/Doctors";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import Videos from "./pages/Videos";
import ClinicInfo from "./pages/ClinicInfo";
import Appointments from "./pages/Appointments";

export default function AdminRouter() {
  const { user, loading: authLoading, logout, isAuthenticated, login } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({
      id: Date.now().toString(),
      type,
      message
    });
  };

  const handleLogout = async () => {
    if (window.confirm("Confirm Exit: End active administrative session?")) {
      try {
        await logout();
        showToast("Logged out successfully.", "info");
      } catch (err) {
        showToast("Error processing sign-out.", "error");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#001D11] flex flex-col items-center justify-center gap-3.5 px-4 font-sans text-xs">
        <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
        <span className="text-[#a4cebf] uppercase tracking-widest font-bold font-sans text-[10px]">Verifying secure login session...</span>
      </div>
    );
  }

  // Not authenticated: render centering login card
  if (!isAuthenticated) {
    return (
      <>
        <Login 
          loginFn={login}
          onLoginSuccess={(isFallback) => {
            showToast(
              isFallback 
                ? "Access granted via offline Staff Fallback session!" 
                : "Administrative access granted!", 
              "success"
            );
          }} 
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Render Section viewport
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case "services":
        return <Services showToast={showToast} />;
      case "doctors":
        return <Doctors showToast={showToast} />;
      case "gallery":
        return <Gallery showToast={showToast} />;
      case "articles":
        return <Articles showToast={showToast} />;
      case "videos":
        return <Videos showToast={showToast} />;
      case "clinic-info":
        return <ClinicInfo showToast={showToast} />;
      case "appointments":
        return <Appointments showToast={showToast} />;
      default:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Admin Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar 
          currentTab={currentTab} 
          adminEmail={user?.email || null} 
          onHamburgerClick={() => setMobileOpen(true)}
        />
        
        {/* Dynamic page content wrapper */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Success/Error Toasts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
