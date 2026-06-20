import React, { useState, useEffect } from "react";
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
  const { user, loading: authLoading, logout, isAuthenticated, login, changePassword } = useAuth();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Password changing modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("The passwords do not match.", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await changePassword?.(newPassword);
      showToast(res?.message || "Password updated successfully!", "success");
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || "Could not save the new password.", "error");
    } finally {
      setPasswordLoading(false);
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
        onChangePassword={() => setShowPasswordModal(true)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar 
          currentTab={currentTab} 
          adminEmail={user?.email || null} 
          onHamburgerClick={() => setMobileOpen(true)}
          onChangePasswordClick={() => setShowPasswordModal(true)}
        />
        
        {/* Dynamic page content wrapper */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>

      {/* Change Password Dialog Modal Popup */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#dfba5c]/10 flex items-center justify-center text-[#bf9b38]">
                  <span className="material-symbols-outlined text-sm">key</span>
                </div>
                <h3 className="font-cormorant text-xl font-bold text-gray-900">
                  Update Account Password
                </h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer transitions-all"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10.5px] uppercase tracking-wider font-bold text-gray-500 font-sans">
                  New Secure Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full text-sm font-sans border border-gray-200 focus:border-primary-mint focus:ring-1 focus:ring-primary-mint/20 rounded-xl px-4 py-3 leading-none transition-all outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-[10px] text-gray-400 font-sans pt-0.5">
                  Must be at least 6 characters in length.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[10.5px] uppercase tracking-wider font-bold text-gray-500 font-sans">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full text-sm font-sans border border-gray-200 focus:border-primary-mint focus:ring-1 focus:ring-primary-mint/20 rounded-xl px-4 py-3 leading-none transition-all outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {user?.isLocalFallback && (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl px-4 py-3 text-amber-800 text-[11px] leading-relaxed font-sans flex gap-2">
                  <span className="material-symbols-outlined text-[15px] shrink-0 text-amber-600 mt-0.5">info</span>
                  <span>
                    <strong>Offline Local Fallback Session:</strong> Since Firebase configuration is loading via proxy, updating your password will change your active browser session state only.
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 text-[11px] font-bold uppercase tracking-widest font-sans rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-3 bg-primary-mint hover:bg-[#349e79] text-white text-[11px] font-bold uppercase tracking-widest font-sans rounded-xl shadow-md shadow-primary-mint/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Toasts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
