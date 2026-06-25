import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  BookOpen,
  Video,
  Briefcase,
  Calendar,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Send,
  Lock,
  User,
  Eye,
  ArrowRight,
  Menu,
  X,
  Globe,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  FileText
} from "lucide-react";

// Retrieve Cloudflare worker URL from Vite env variables
const WORKER_URL = (import.meta as any).env?.VITE_WORKER_URL || "";

// Type definitions matching database schemas
interface Appointment {
  id: number;
  name: string;
  phone: string;
  service: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

interface Photo {
  id: number;
  url: string;
  caption: string;
  created_at: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  cover_image: string;
  publish_date: string;
}

interface VideoItem {
  id: number;
  youtube_url: string;
  title: string;
}

interface Service {
  id: number;
  name: string;
  display_order: number;
}

type TabType = "dashboard" | "gallery" | "articles" | "videos" | "services" | "appointments" | "settings";

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("drsky_admin_token"));
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Nav tab control
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shared application state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Fetch status tracking
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Gallery Add fields
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");

  // Article Add fields
  const [articleTitle, setArticleTitle] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCover, setArticleCover] = useState("");
  const [articleDate, setArticleDate] = useState("");

  // Video Add fields
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  // Service Add fields
  const [serviceName, setServiceName] = useState("");

  // Settings password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Appointment filtering state
  const [appointmentFilter, setAppointmentFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  // Automatically clear status message
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // General loader for authenticated content
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const headers = { "Authorization": `Bearer ${token}` };
      
      // Fetch concurrently to maximize response speed
      const [resAppt, resPhotos, resArticles, resVideos, resServices] = await Promise.all([
        fetch(`${WORKER_URL}/api/appointments`, { headers }),
        fetch(`${WORKER_URL}/api/photos`),
        fetch(`${WORKER_URL}/api/articles`),
        fetch(`${WORKER_URL}/api/videos`),
        fetch(`${WORKER_URL}/api/services`)
      ]);

      if (resAppt.status === 401) {
        // Token expired or invalid
        handleLogout();
        return;
      }

      const [dataAppt, dataPhotos, dataArticles, dataVideos, dataServices] = await Promise.all([
        resAppt.json(),
        resPhotos.json(),
        resArticles.json(),
        resVideos.json(),
        resServices.json()
      ]);

      if (Array.isArray(dataAppt)) setAppointments(dataAppt);
      if (Array.isArray(dataPhotos)) setPhotos(dataPhotos);
      if (Array.isArray(dataArticles)) setArticles(dataArticles);
      if (Array.isArray(dataVideos)) setVideos(dataVideos);
      if (Array.isArray(dataServices)) setServices(dataServices);

    } catch (err) {
      console.error("Error loading admin core details:", err);
      showStatus("Connection error while requesting remote server logs.", true);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (text: string, isError = false) => {
    setStatusMessage({ text, isError });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch(`${WORKER_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem("drsky_admin_token", data.token);
        setToken(data.token);
        setPassword("");
      } else {
        setLoginError(data.error || "Invalid administrator password credentials.");
      }
    } catch (err) {
      setLoginError("Could not connect to Cloudflare Workers server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("drsky_admin_token");
    setToken(null);
    setAppointments([]);
    setPhotos([]);
    setArticles([]);
    setVideos([]);
    setServices([]);
  };

  // Appointment Status changes
  const updateAppointmentStatus = async (id: number, status: "pending" | "confirmed" | "cancelled") => {
    setActionLoading(`appt-${id}`);
    try {
      const response = await fetch(`${WORKER_URL}/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setAppointments(prev =>
          prev.map(item => (item.id === id ? { ...item, status } : item))
        );
        showStatus(`Appointment #${id} updated to ${status}.`);
      } else {
        showStatus("Could not modify booking status parameters.", true);
      }
    } catch (err) {
      showStatus("Network transaction failed during update.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Upload photo directly using Image URL
  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl) {
      showStatus("Please enter an image URL.", true);
      return;
    }

    setActionLoading("gallery-add");
    try {
      const response = await fetch(`${WORKER_URL}/api/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          url: photoUrl,
          caption: photoCaption
        })
      });

      if (response.ok) {
        const newPhoto = await response.json();
        setPhotos(prev => [newPhoto, ...prev]);
        setPhotoUrl("");
        setPhotoCaption("");
        showStatus("Image published successfully.");
      } else {
        const errData = await response.json();
        showStatus(errData.error || "Failed to finalize image publication.", true);
      }
    } catch (err) {
      showStatus("Failed to execute network request.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this photo?")) return;
    setActionLoading(`delete-photo-${id}`);
    try {
      const response = await fetch(`${WORKER_URL}/api/photos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setPhotos(prev => prev.filter(item => item.id !== id));
        showStatus("Photo deleted from storage and gallery records.");
      } else {
        showStatus("Failed to delete photo.", true);
      }
    } catch (err) {
      showStatus("Network failure during deletion request.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Create article
  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !articleContent) {
      showStatus("Article title and content body are required.", true);
      return;
    }

    setActionLoading("article-add");
    try {
      const response = await fetch(`${WORKER_URL}/api/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: articleTitle,
          content: articleContent,
          cover_image: articleCover,
          publish_date: articleDate
        })
      });

      if (response.ok) {
        const newArticle = await response.json();
        setArticles(prev => [newArticle, ...prev]);
        setArticleTitle("");
        setArticleContent("");
        setArticleCover("");
        setArticleDate("");
        showStatus("New educational article published successfully.");
      } else {
        showStatus("Could not write article records.", true);
      }
    } catch (err) {
      showStatus("Network transaction error.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Delete this article permanently?")) return;
    setActionLoading(`delete-article-${id}`);
    try {
      const response = await fetch(`${WORKER_URL}/api/articles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setArticles(prev => prev.filter(item => item.id !== id));
        showStatus("Article successfully removed.");
      } else {
        showStatus("Delete transaction rejected.", true);
      }
    } catch (err) {
      showStatus("Network deletion failed.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Add video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !videoTitle) {
      showStatus("Video YouTube URL and title are required.", true);
      return;
    }

    setActionLoading("video-add");
    try {
      const response = await fetch(`${WORKER_URL}/api/videos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          youtube_url: videoUrl,
          title: videoTitle
        })
      });

      if (response.ok) {
        const newVideo = await response.json();
        setVideos(prev => [newVideo, ...prev]);
        setVideoUrl("");
        setVideoTitle("");
        showStatus("YouTube stream added to patient video library.");
      } else {
        showStatus("Failed to submit video item.", true);
      }
    } catch (err) {
      showStatus("Network transmission failed.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Video
  const handleDeleteVideo = async (id: number) => {
    if (!confirm("Are you sure you want to remove this video link?")) return;
    setActionLoading(`delete-video-${id}`);
    try {
      const response = await fetch(`${WORKER_URL}/api/videos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setVideos(prev => prev.filter(item => item.id !== id));
        showStatus("Video removed successfully.");
      } else {
        showStatus("Could not remove video entry.", true);
      }
    } catch (err) {
      showStatus("Failed to finalize video deletion.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Add service
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName) return;

    setActionLoading("service-add");
    try {
      const response = await fetch(`${WORKER_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: serviceName })
      });

      if (response.ok) {
        const newService = await response.json();
        setServices(prev => [...prev, newService]);
        setServiceName("");
        showStatus("New treatment service activated.");
      } else {
        showStatus("Could not register treatment service.", true);
      }
    } catch (err) {
      showStatus("Service insertion encountered a network failure.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Delete service
  const handleDeleteService = async (id: number) => {
    if (!confirm("Delete this service? It will disappear from the public booking options!")) return;
    setActionLoading(`delete-service-${id}`);
    try {
      const response = await fetch(`${WORKER_URL}/api/services/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setServices(prev => prev.filter(item => item.id !== id));
        showStatus("Service deleted successfully.");
      } else {
        showStatus("Delete rejected.", true);
      }
    } catch (err) {
      showStatus("Network failure during deletion.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showStatus("All fields are mandatory.", true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showStatus("New passwords do not match each other.", true);
      return;
    }

    setActionLoading("change-password");
    try {
      const response = await fetch(`${WORKER_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showStatus("Administrator credentials modified successfully.");
      } else {
        showStatus(data.error || "Failed to change admin password.", true);
      }
    } catch (err) {
      showStatus("Could not complete password change transaction.", true);
    } finally {
      setActionLoading(null);
    }
  };

  // Generate WhatsApp Direct-to-Patient message URL
  const getWhatsAppLink = (appt: Appointment) => {
    const encodedMessage = encodeURIComponent(
      `Hello ${appt.name}! Thank you for trusting Dr. Sky Dentistry. Your appointment for ${appt.service} on ${appt.date} is confirmed. We look forward to seeing you! 🦷`
    );
    // Replace non-numeric symbols in phone for a clean API redirect, default custom target number fallback
    const rawNumber = appt.phone.replace(/[^0-9]/g, "");
    const cleanPhone = rawNumber || "917717642334";
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  // Unauthenticated Login Guard
  if (!token) {
    return (
      <div className="min-h-screen bg-[#05130b] flex flex-col justify-center items-center p-6 text-white font-sans antialiased">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#3EB489]/10 to-transparent pointer-events-none" />
        
        <div className="w-full max-w-md bg-[#0D2016]/90 border border-[#3EB489]/20 p-8 md:p-10 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-md">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-[#3EB489]/10 border border-[#3EB489]/30 items-center justify-center text-[#3EB489]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-light tracking-wide">Command Core</h2>
              <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Dr. Sky Dentistry</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="bg-red-950/40 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Administrator Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#05130b]/60 border border-[#3EB489]/20 rounded-xl outline-none focus:border-[#3EB489]/60 focus:ring-1 focus:ring-[#3EB489]/10 text-sm font-medium transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-[#05130b] font-semibold text-xs tracking-widest uppercase py-4 rounded-xl shadow-lg shadow-[#3EB489]/10 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying keys...</span>
                </>
              ) : (
                <>
                  <span>Initialize Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#3EB489]/5 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-[11px] text-[#3EB489] hover:text-white font-medium tracking-wide transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Return to Public Clinic Portal</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-[10px] tracking-widest uppercase">
          SECURE ENCRYPTED PROTOCOL // AUTH-02
        </div>
      </div>
    );
  }

  // Filter appointments
  const filteredAppointments = appointments.filter(appt => {
    if (appointmentFilter === "all") return true;
    return appt.status === appointmentFilter;
  });

  return (
    <div className="min-h-screen bg-[#F4F9F6] text-gray-800 font-sans antialiased flex flex-col md:flex-row">
      
      {/* ----------------------------------------------------
          DESKTOP SIDEBAR PANEL (Persistent)
         ---------------------------------------------------- */}
      <aside className="hidden md:flex md:w-64 bg-[#0A1A12] text-white flex-col flex-shrink-0 z-20">
        <div className="p-6 border-b border-white/5 flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3EB489] flex items-center justify-center text-[#0A1A12] font-black tracking-tighter">
              DS
            </div>
            <h1 className="font-semibold text-sm tracking-wide uppercase">Dr. Sky Dentistry</h1>
          </div>
          <p className="text-[10px] text-[#3EB489] font-bold tracking-[0.2em] uppercase pl-10">Command Core</p>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "appointments", label: "Appointments", icon: Calendar },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "articles", label: "Articles", icon: BookOpen },
            { id: "videos", label: "Videos", icon: Video },
            { id: "services", label: "Services", icon: Briefcase },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#3EB489] text-[#0A1A12] shadow-md shadow-[#3EB489]/10 font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "stroke-[2.5px]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer details */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#3EB489] animate-pulse" />
            <span className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">System Online</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Close Console</span>
          </button>
        </div>
      </aside>

      {/* ----------------------------------------------------
          MOBILE MENU HEADER BAR
         ---------------------------------------------------- */}
      <header className="md:hidden bg-[#0A1A12] text-white p-4 flex items-center justify-between border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#3EB489] flex items-center justify-center text-[#0A1A12] font-black text-xs">
            DS
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-wide uppercase">Dr. Sky Admin</h1>
            <p className="text-[8px] text-[#3EB489] uppercase tracking-widest">Command Core</p>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Dropdown overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] bg-[#0A1A12] border-b border-white/10 text-white z-20 shadow-2xl flex flex-col p-4 space-y-1.5 animate-fade-in">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "appointments", label: "Appointments", icon: Calendar },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "articles", label: "Articles", icon: BookOpen },
            { id: "videos", label: "Videos", icon: Video },
            { id: "services", label: "Services", icon: Briefcase },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all text-left ${
                  isSelected ? "bg-[#3EB489] text-[#0A1A12] font-bold" : "text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="border-t border-white/5 pt-3 mt-1.5">
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase text-red-400 text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Close Console</span>
            </button>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          MAIN CONTENT WORKSPACE AREA
         ---------------------------------------------------- */}
      <main className="flex-1 min-w-0 flex flex-col p-6 md:p-10 space-y-8 relative">
        
        {/* Dynamic Action Success/Error Notification */}
        {statusMessage && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-slide-in max-w-sm ${
            statusMessage.isError
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              statusMessage.isError ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
            }`}>
              {statusMessage.isError ? <AlertTriangle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            </div>
            <p className="text-xs font-semibold leading-relaxed">{statusMessage.text}</p>
          </div>
        )}

        {/* Top Header bar details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div className="text-left space-y-1">
            <span className="font-mono text-[9px] font-bold tracking-[0.25em] text-[#3EB489] uppercase">
              Secure Operations Portal
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 capitalize flex items-center gap-2">
              <span>{activeTab} Management</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Logs</span>
            </button>

            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#3EB489] text-white rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-[#2e9c73] active:scale-95 transition-all cursor-pointer shadow-md shadow-[#3EB489]/10"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </a>
          </div>
        </div>

        {/* ----------------------------------------------------
            TAB 1: DASHBOARD TAB
           ---------------------------------------------------- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Appointments", value: appointments.length, icon: Calendar, color: "text-blue-500 bg-blue-50" },
                { label: "Gallery Photos", value: photos.length, icon: ImageIcon, color: "text-emerald-500 bg-emerald-50" },
                { label: "Journal Articles", value: articles.length, icon: BookOpen, color: "text-purple-500 bg-purple-50" },
                { label: "Patient Videos", value: videos.length, icon: Video, color: "text-orange-500 bg-orange-50" },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white border border-gray-150 p-6 rounded-2xl flex items-center justify-between shadow-sm">
                    <div className="text-left space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Appointments Block */}
            <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden text-left">
              <div className="p-6 border-b border-gray-150 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Recent Appointments</h3>
                  <p className="text-xs text-gray-400 font-medium">Overview of the last 10 clinical consultation requests</p>
                </div>
                <button
                  onClick={() => setActiveTab("appointments")}
                  className="text-xs font-bold uppercase tracking-wider text-[#3EB489] hover:text-[#2e9c73] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>See All Log Files</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="p-12 text-center text-gray-400 space-y-3">
                  <Calendar className="w-10 h-10 mx-auto stroke-1" />
                  <p className="text-xs font-semibold">No patient appointments have been registered yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                      <tr>
                        <th className="px-6 py-4">Patient Name</th>
                        <th className="px-6 py-4">Treatment Required</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {appointments.slice(0, 10).map((appt) => (
                        <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{appt.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{appt.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[10.5px]">
                              {appt.service}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-700">{appt.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              appt.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              appt.status === "cancelled" ? "bg-red-50 text-red-700 border border-red-100" :
                              "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                appt.status === "confirmed" ? "bg-emerald-500" :
                                appt.status === "cancelled" ? "bg-red-500" :
                                "bg-amber-500"
                              }`} />
                              <span>{appt.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              {/* Quick status dropdown */}
                              <select
                                value={appt.status}
                                onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as any)}
                                disabled={actionLoading === `appt-${appt.id}`}
                                className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[11px] font-semibold text-gray-700"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirm</option>
                                <option value="cancelled">Cancel</option>
                              </select>

                              {/* WhatsApp Direct Link */}
                              <a
                                href={getWhatsAppLink(appt)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10.5px] font-bold tracking-wide uppercase shadow-sm transition-colors"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: GALLERY TAB
           ---------------------------------------------------- */}
        {activeTab === "gallery" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Left Upload Card */}
            <div className="lg:col-span-4 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Upload Clinic Photo</h3>
                <p className="text-xs text-gray-400 font-medium">Adds photos to the Instagram Section grid on the main page</p>
              </div>

              <form onSubmit={handlePhotoUpload} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Image URL</label>
                  <input
                    required
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Caption / Alternative Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Beautiful aesthetic aligner consults"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "gallery-add"}
                  className="w-full py-3 bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-widest cursor-pointer shadow-md shadow-[#3EB489]/10 flex items-center justify-center gap-2"
                >
                  {actionLoading === "gallery-add" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Photo...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Photo</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Photo Catalog */}
            <div className="lg:col-span-8 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Captured Photos Gallery</h3>
                <p className="text-xs text-gray-400 font-medium">Currently published clinic photos ({photos.length} total)</p>
              </div>

              {photos.length === 0 ? (
                <div className="p-16 text-center text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl">
                  <ImageIcon className="w-12 h-12 mx-auto stroke-1 text-gray-300" />
                  <p className="text-xs font-semibold">Your gallery bucket is empty. Upload your first clinic photo above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo) => (
                    <div key={photo.id} className="group relative aspect-square bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                        <p className="text-[10px] font-semibold line-clamp-2 leading-relaxed mb-3">{photo.caption || "No caption added"}</p>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          disabled={actionLoading === `delete-photo-${photo.id}`}
                          className="w-full py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: ARTICLES TAB
           ---------------------------------------------------- */}
        {activeTab === "articles" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Left form to add Article */}
            <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Publish Journal Article</h3>
                <p className="text-xs text-gray-400 font-medium">Create custom patient guides and articles for the main site</p>
              </div>

              <form onSubmit={handleAddArticle} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Article Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Painless Laser Surgery Solutions"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Publish Date Caption</label>
                  <input
                    type="text"
                    placeholder="e.g. JUNE 24, 2026 (Leave empty for today)"
                    value={articleDate}
                    onChange={(e) => setArticleDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cover Image Path/URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /119.jpg or external secure URL"
                    value={articleCover}
                    onChange={(e) => setArticleCover(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                  <p className="text-[9px] text-gray-400 italic">Available local fallbacks: /111.jpg up to /123.jpg</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Article Content Body</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Provide article content (standard text paragraphs)"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60 font-sans leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "article-add"}
                  className="w-full py-3.5 bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-widest cursor-pointer shadow-md shadow-[#3EB489]/10 flex items-center justify-center gap-2"
                >
                  {actionLoading === "article-add" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                  <span>Publish Article</span>
                </button>
              </form>
            </div>

            {/* Right List of articles */}
            <div className="lg:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Active Published Articles</h3>
                <p className="text-xs text-gray-400 font-medium">Manage and remove articles from patient records</p>
              </div>

              {articles.length === 0 ? (
                <div className="p-16 text-center text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl">
                  <BookOpen className="w-12 h-12 mx-auto stroke-1 text-gray-300" />
                  <p className="text-xs font-semibold">No custom articles have been published. System will display defaults.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-150 rounded-2xl hover:border-[#3EB489]/30 transition-all">
                      <div className="w-16 h-16 rounded-xl bg-emerald-950/20 overflow-hidden flex-shrink-0">
                        {item.cover_image ? (
                          <img
                            src={item.cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#3EB489] font-bold text-xs bg-[#3EB489]/5">
                            Doc
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 text-left space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">{item.publish_date}</span>
                          <span className="text-[9px] font-mono bg-emerald-50 text-[#3EB489] px-1.5 py-0.5 rounded border border-[#3EB489]/10">ID: {item.id}</span>
                        </div>
                        <h4 className="font-semibold text-xs text-gray-900 truncate leading-snug">{item.title}</h4>
                        <p className="text-[10.5px] text-gray-400 line-clamp-1 leading-relaxed">{item.content}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteArticle(item.id)}
                        disabled={actionLoading === `delete-article-${item.id}`}
                        className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer flex-shrink-0"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: VIDEOS TAB
           ---------------------------------------------------- */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Left form */}
            <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Add YouTube Video Link</h3>
                <p className="text-xs text-gray-400 font-medium">Links videos to the Media Center section on the main page</p>
              </div>

              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Video Title</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Explaining Advanced Painless Laser Dentistry"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">YouTube Video URL</label>
                  <input
                    required
                    type="url"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "video-add"}
                  className="w-full py-3 bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-widest cursor-pointer shadow-md shadow-[#3EB489]/10 flex items-center justify-center gap-2"
                >
                  {actionLoading === "video-add" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Add Video File</span>
                </button>
              </form>
            </div>

            {/* Right List */}
            <div className="lg:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Published Video Center</h3>
                <p className="text-xs text-gray-400 font-medium">Available client videos in system catalog</p>
              </div>

              {videos.length === 0 ? (
                <div className="p-16 text-center text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl">
                  <Video className="w-12 h-12 mx-auto stroke-1 text-gray-300" />
                  <p className="text-xs font-semibold">No custom video logs registered. Displays fallbacks on main site.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {videos.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-150 rounded-2xl hover:border-[#3EB489]/30 transition-all text-left">
                      <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex w-2 h-2 rounded-full bg-[#3EB489]" />
                          <span className="text-[9px] font-mono bg-[#3EB489]/5 text-[#3EB489] px-1.5 py-0.5 rounded border border-[#3EB489]/10">ID: {item.id}</span>
                        </div>
                        <h4 className="font-semibold text-xs text-gray-900 truncate leading-snug">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 truncate font-mono">{item.youtube_url}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteVideo(item.id)}
                        disabled={actionLoading === `delete-video-${item.id}`}
                        className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                        title="Remove video link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 5: SERVICES TAB
           ---------------------------------------------------- */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Left Form */}
            <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Add Clinic Service</h3>
                <p className="text-xs text-gray-400 font-medium">Adds a new option to the patient booking dropdown and catalog</p>
              </div>

              <form onSubmit={handleAddService} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Service Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Advanced Ceramic Crowns"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "service-add"}
                  className="w-full py-3 bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-widest cursor-pointer shadow-md shadow-[#3EB489]/10 flex items-center justify-center gap-2"
                >
                  {actionLoading === "service-add" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>Activate Service</span>
                </button>
              </form>
            </div>

            {/* Right List */}
            <div className="lg:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Active Registered Services</h3>
                <p className="text-xs text-gray-400 font-medium">These items appear in the clinical booking treatment dropdown</p>
              </div>

              {services.length === 0 ? (
                <div className="p-16 text-center text-gray-400 space-y-3 border border-dashed border-gray-200 rounded-2xl">
                  <Briefcase className="w-12 h-12 mx-auto stroke-1 text-gray-300" />
                  <p className="text-xs font-semibold">No services found in database records.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-150 rounded-2xl hover:border-[#3EB489]/30 transition-all">
                      <div className="flex items-center gap-3 text-left">
                        <span className="w-6 h-6 rounded-lg bg-[#3EB489]/10 border border-[#3EB489]/20 text-[#3EB489] flex items-center justify-center text-[10px] font-bold font-mono">
                          {index + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-xs text-gray-900">{item.name}</span>
                          <span className="text-[9px] font-mono bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded border border-gray-100 ml-2">ID: {item.id}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteService(item.id)}
                        disabled={actionLoading === `delete-service-${item.id}`}
                        className="p-2.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors cursor-pointer"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 6: APPOINTMENTS TAB
           ---------------------------------------------------- */}
        {activeTab === "appointments" && (
          <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden text-left animate-fade-in">
            <div className="p-6 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Clinical Appointments Archive</h3>
                <p className="text-xs text-gray-400 font-medium">Review and confirm all incoming diagnostic request files ({appointments.length} total)</p>
              </div>

              {/* Filtering triggers */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-150 rounded-xl">
                {(["all", "pending", "confirmed", "cancelled"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppointmentFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      appointmentFilter === filter
                        ? "bg-[#3EB489] text-[#0A1A12] shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-16 text-center text-gray-400 space-y-3">
                <Calendar className="w-12 h-12 mx-auto stroke-1" />
                <p className="text-xs font-semibold">No appointments matching current filters were found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Patient Name</th>
                      <th className="px-6 py-4">Required Service</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Registered On</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-gray-400">#{appt.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{appt.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono mt-0.5">{appt.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 text-[10.5px]">
                            {appt.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-700">{appt.date}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            appt.status === "cancelled" ? "bg-red-50 text-red-700 border border-red-100" :
                            "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              appt.status === "confirmed" ? "bg-emerald-500" :
                              appt.status === "cancelled" ? "bg-red-500" :
                              "bg-amber-500"
                            }`} />
                            <span>{appt.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[10.5px] text-gray-400">{appt.created_at ? new Date(appt.created_at).toLocaleString() : "Unknown"}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            {/* Quick status dropdown */}
                            <select
                              value={appt.status}
                              onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as any)}
                              disabled={actionLoading === `appt-${appt.id}`}
                              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-[11px] font-semibold text-gray-700"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="cancelled">Cancel</option>
                            </select>

                            {/* WhatsApp Direct Link */}
                            <a
                              href={getWhatsAppLink(appt)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10.5px] font-bold tracking-wide uppercase shadow-sm transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 7: SETTINGS TAB
           ---------------------------------------------------- */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in text-left">
            {/* Left Password form */}
            <div className="lg:col-span-5 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Change Admin Password</h3>
                <p className="text-xs text-gray-400 font-medium">Modify credentials to secure administrative logs and buckets</p>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Enter new strong password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirm New Password</label>
                  <input
                    required
                    type="password"
                    placeholder="Confirm new strong password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-xs font-medium focus:border-[#3EB489]/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading === "change-password"}
                  className="w-full py-3 bg-[#3EB489] hover:bg-[#2e9c73] disabled:opacity-50 text-white rounded-xl text-[10.5px] font-bold uppercase tracking-widest cursor-pointer shadow-md shadow-[#3EB489]/10 flex items-center justify-center gap-2"
                >
                  {actionLoading === "change-password" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Update Admin Password</span>
                </button>
              </form>
            </div>

            {/* Right details about credentials security */}
            <div className="lg:col-span-7 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Security Protocol Advice</h3>
                <p className="text-xs text-gray-400 font-medium">Keep your console protected at all times</p>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-gray-500">
                <div className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-[#3EB489]/20 rounded-2xl text-gray-700">
                  <ShieldCheck className="w-5 h-5 text-[#3EB489] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-left">
                    <h5 className="font-bold text-[#0A1A12] text-xs uppercase tracking-wide">Crypto Signature Enabled</h5>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      All admin access tokens are generated via premium HMAC-SHA256 crypto signatures and stored in localStorage. Session logs expire automatically after 24 hours.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pl-2">
                  <h4 className="font-semibold text-gray-800 uppercase tracking-wide text-[10.5px]">Important Rules:</h4>
                  <ul className="list-disc list-inside space-y-2 pl-1">
                    <li>Never disclose or share your clinic password with unauthorized personnel.</li>
                    <li>Always close the console (logout) when utilizing a public or shared tablet/computer.</li>
                    <li>If you suspect your credentials have been compromised, immediately change your password using the form on the left.</li>
                    <li>All R2 image buckets are publicly read-only, but writes are exclusively authorized through signature tokens.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
