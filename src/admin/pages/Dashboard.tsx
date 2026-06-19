import { useEffect, useState } from "react";
import { useServices } from "../../hooks/useServices";
import { useDoctors } from "../../hooks/useDoctors";
import { useAppointments } from "../../hooks/useAppointments";
import { getArticles } from "../../firebase/firestore";
import { ArticleItem } from "../../types";

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { services, loading: servicesLoading } = useServices();
  const { doctors, loading: doctorsLoading } = useDoctors();
  const { appointments, loading: appointmentsLoading, updateStatus } = useAppointments();
  
  const [articlesCount, setArticlesCount] = useState(0);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    getArticles()
      .then(items => {
        setArticlesCount(items.length);
      })
      .catch(err => console.error("Failed to load articles count", err))
      .finally(() => setArticlesLoading(false));
  }, []);

  const totalServices = servicesLoading ? "..." : services.length;
  const totalDoctors = doctorsLoading ? "..." : doctors.length;
  const totalAppointments = appointmentsLoading ? "..." : appointments.length;
  const totalArticles = articlesLoading ? "..." : articlesCount;

  const stats = [
    { label: "Clinical Services", value: totalServices, icon: "healing", bgClass: "bg-emerald-50 text-emerald-500", routeId: "services" },
    { label: "Doctors & Team", value: totalDoctors, icon: "medical_services", bgClass: "bg-amber-50 text-amber-500", routeId: "doctors" },
    { label: "Aesthetic Articles", value: totalArticles, icon: "article", bgClass: "bg-teal-50 text-teal-500", routeId: "articles" },
    { label: "Total Bookings", value: totalAppointments, icon: "calendar_month", bgClass: "bg-indigo-50 text-indigo-500", routeId: "appointments" }
  ];

  // Get active or pending appointments
  const recentAppointments = appointments.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const base = "px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block";
    switch (status) {
      case "New": return `${base} bg-blue-50 text-blue-600 border border-blue-100`;
      case "Contacted": return `${base} bg-[#ffe08f]/20 text-[#bf8c00] border border-[#ffe08f]/40`;
      case "Confirmed": return `${base} bg-emerald-50 text-emerald-600 border border-emerald-100`;
      case "Done": return `${base} bg-gray-50 text-gray-500 border border-gray-100`;
      default: return `${base} bg-gray-50 text-gray-500`;
    }
  };

  const isGlobalLoading = servicesLoading || doctorsLoading || appointmentsLoading || articlesLoading;

  return (
    <div className="space-y-8">
      {/* Overview stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx}
            onClick={() => onNavigate(stat.routeId)}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-2xl font-bold font-sans text-gray-900 group-hover:text-primary-mint transition-colors">
                {stat.value}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bgClass} shadow-inner group-hover:scale-105 transition-transform`}>
              <span className="material-symbols-outlined text-[20px] font-medium leading-none">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Recent Appointments (2 cols large screens) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
              Recent Appointments
            </h3>
            <button 
              onClick={() => onNavigate("appointments")}
              className="text-[10px] font-bold text-primary-mint hover:underline uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              See Ledger <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {appointmentsLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-primary-mint border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-medium">syncing appointments ledger...</span>
              </div>
            ) : recentAppointments.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-sans flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl">inbox</span>
                <p className="text-xs font-semibold">No appointment registrations found.</p>
              </div>
            ) : (
              recentAppointments.map((appt) => (
                <div key={appt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1 text-left">
                    <p className="font-sans text-xs font-bold text-gray-900">{appt.name}</p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs leading-none">call</span>
                        {appt.phone}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs leading-none">vaccines</span>
                        {appt.service}
                      </span>
                      <span>•</span>
                      <span className="text-gray-500 font-semibold">{appt.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getStatusBadge(appt.status)}
                    
                    {appt.status === "New" && (
                      <button
                        onClick={() => updateStatus(appt.id, "Contacted")}
                        className="px-3 py-1.5 rounded-lg border border-primary-mint/20 text-primary-mint hover:bg-primary-mint hover:text-white transition-all text-[11px] font-medium font-sans cursor-pointer"
                      >
                        Mark Contacted
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b border-gray-50 pb-4">
              <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
              Quick Launcher
            </h3>

            <div className="grid grid-cols-1 gap-3 font-sans">
              <button
                onClick={() => onNavigate("services")}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-50/50 border border-gray-100 hover:border-emerald-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-gray-800">Add Service</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Define new treatment entries</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("doctors")}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-amber-50/50 border border-gray-100 hover:border-amber-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-sm font-bold">person_add</span>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-gray-800">Add Clinician</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Register dental team members</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("articles")}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-teal-50/50 border border-gray-100 hover:border-teal-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-sm font-bold">edit_note</span>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-gray-800">Write Journal</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Publish a news entry or blog post</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate("clinic-info")}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-indigo-50/50 border border-gray-100 hover:border-indigo-100 text-left transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-105 transition-all">
                  <span className="material-symbols-outlined text-sm font-bold">settings_suggest</span>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-gray-800">Clinic Setup</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Configure address, phone, socials</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
