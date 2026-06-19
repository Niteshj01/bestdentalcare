import { useState } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { AppointmentItem } from "../../types";

interface AppointmentsProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Appointments({ showToast }: AppointmentsProps) {
  const { appointments, loading, updateStatus, remove } = useAppointments();
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const handleStatusChange = async (id: string, currentVal: AppointmentItem["status"], nextVal: AppointmentItem["status"]) => {
    if (currentVal === nextVal) return;
    try {
      await updateStatus(id, nextVal);
      showToast(`Appointment status changed to "${nextVal}".`, "success");
    } catch (err) {
      showToast("Failed to modify appointment status.", "error");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Verify release: Erase appointment file registration for patient "${name}"?`)) {
      return;
    }

    try {
      await remove(id);
      showToast(`Appointment for patient "${name}" canceled.`, "success");
    } catch (err) {
      showToast("Failed to delete appointment listing.", "error");
    }
  };

  const handleWhatsAppShare = (name: string, phone: string, date: string, service: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    // If it's a standard Indian mobile number (10-digits), prepend 91
    const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const text = `Hello *${name}*, your appointment with *Dr. Sky Dentistry* is confirmed for *${date}* for *${service}*. We look forward to seeing you!`;
    const url = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    showToast(`Opening WhatsApp to notify ${name}`, "success");
  };

  const handleSMSShare = (name: string, phone: string, date: string, service: string) => {
    const text = `Hello ${name}, your appointment with Dr. Sky Dentistry is confirmed for ${date} for ${service}. We look forward to seeing you!`;
    const url = `sms:${phone}?body=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    showToast(`Opening SMS companion to notify ${name}`, "success");
  };

  const handleExportCSV = () => {
    try {
      if (appointments.length === 0) {
        showToast("No appointments logged yet to export.", "error");
        return;
      }
      
      const headers = ["Patient Name", "Phone Number", "Clinic Treatment Service", "Appt Date Requested", "Current Status", "Registered At"];
      const rows = appointments.map(a => [
        `"${a.name.replace(/"/g, '""')}"`,
        `"${a.phone.replace(/"/g, '""')}"`,
        `"${a.service.replace(/"/g, '""')}"`,
        `"${a.date.replace(/"/g, '""')}"`,
        `"${a.status}"`,
        `"${a.createdAt || ""}"`
      ].join(","));

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `drsky_appointments_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("Patient Appointments Ledger exported successfully!", "success");
    } catch (e) {
      showToast("CSV generation failed.", "error");
    }
  };

  // Filter listings based on hooks
  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.phone.includes(searchTerm);
    const matchesFilter = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBg = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Contacted": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Confirmed": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Done": return "bg-gray-100 text-gray-500 border-gray-200";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and control filter panels */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm font-sans">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl text-left">
          
          {/* Search Patient */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-md leading-none">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Patient Name or Mobile..."
              className="w-full pl-9 pr-4 py-2.5 placeholder-gray-400 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-1 focus:ring-primary-mint/10 text-xs font-medium"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider whitespace-nowrap">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2.5 border border-gray-150 bg-white rounded-xl outline-none focus:border-primary-mint/55 text-xs font-semibold text-gray-700"
            >
              <option value="All">All statuses</option>
              <option value="New">New Entries</option>
              <option value="Contacted">Contacted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Done">Done / Treated</option>
            </select>
          </div>
        </div>

        {/* CSV export */}
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 bg-[#112d1f] hover:bg-[#1a3f2c] text-white px-5 py-2.5 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-sm hover:translate-y-[-0.5px] transition-all cursor-pointer select-none shrink-0"
        >
          <span className="material-symbols-outlined text-[15px]">download</span>
          <span>CSV Export</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5 shadow-sm">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">Syncing scheduling records...</span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300">event_busy</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No matching appointment requests logged.</p>
          <p className="text-[10px] text-gray-400">Either clean search filter fields or wait for patient bookings.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans text-xs">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Patient Details</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Phone Number</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Requested Treatment</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Target Date</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Status</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-right text-[#4A5E54]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50/20 transition-all">
                    
                    {/* Patient detail */}
                    <td className="p-4.5 font-bold text-gray-900 text-left">
                      <div className="flex flex-col">
                        <span>{appt.name}</span>
                        {appt.createdAt && (
                          <span className="text-[9.5px] text-gray-400 font-medium normal-case mt-0.5">
                            Logged: {new Date(appt.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Phone link */}
                    <td className="p-4.5 font-medium">
                      <a href={`tel:${appt.phone}`} className="hover:text-primary-mint hover:underline flex items-center gap-1.5 justify-start">
                        <span className="material-symbols-outlined text-xs text-gray-405">call</span>
                        {appt.phone}
                      </a>
                    </td>

                    {/* Service */}
                    <td className="p-4.5">
                      <span className="font-semibold bg-[#eaeefe] text-[#3b5998] text-[9.5px] px-2.5 py-0.5 rounded-full border border-[#d0d8fc]/50">
                        {appt.service}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4.5 font-bold text-gray-500 text-left">{appt.date}</td>

                    {/* Status inline editor dropdown */}
                    <td className="p-4.5">
                      <div className="inline-flex">
                        <select
                          value={appt.status}
                          onChange={(e) => handleStatusChange(appt.id, appt.status, e.target.value as AppointmentItem["status"])}
                          className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold border rounded-full outline-none focus:ring-1 focus:ring-primary-mint/20 cursor-pointer ${getStatusBg(appt.status)}`}
                        >
                          <option value="New">🔴 New Request</option>
                          <option value="Contacted">🟡 Contacted</option>
                          <option value="Confirmed">🟢 Confirmed</option>
                          <option value="Done">☑️ Completed</option>
                        </select>
                      </div>
                    </td>

                    {/* Deletion action row */}
                    <td className="p-4.5 text-right space-x-2 whitespace-nowrap">
                      {/* WhatsApp Confirmation */}
                      <button
                        onClick={() => handleWhatsAppShare(appt.name, appt.phone, appt.date, appt.service)}
                        className="w-8 h-8 rounded-lg border border-emerald-100 bg-emerald-50/20 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center inline-flex transition-all cursor-pointer shadow-sm"
                        title="Send confirmation via WhatsApp"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12.004 2C6.48 2 2 6.48 2 12c0 1.94.55 3.82 1.54 5.48L2 22l4.67-1.48c1.59.88 3.42 1.48 5.33 1.48 5.52 0 10-4.48 10-10S17.52 2 12.004 2zm5.71 14.12c-.22.62-1.31 1.2-1.83 1.24-.48.04-.96.22-3.08-.62-2.15-.85-3.52-3.04-3.63-3.19-.11-.15-.89-1.19-.89-2.27s.56-1.61.8-1.84c.24-.23.51-.29.68-.29.17 0 .34.01.49.02.16.01.37-.06.58.45.22.52.75 1.83.82 1.96.07.13.11.29.02.48-.09.18-.17.3-.29.44-.12.14-.26.31-.37.42-.12.12-.25.26-.11.49.14.24.63 1.05 1.36 1.7 1 .89 1.85 1.16 2.11 1.29.27.13.43.11.59-.07.16-.18.7-1.04.88-1.42s.36-.31.62-.21c.25.1.1.25 1.63.82.26.13.43.2.53.37.11.16.11.95-.11 1.57z" />
                        </svg>
                      </button>

                      {/* SMS Confirmation */}
                      <button
                        onClick={() => handleSMSShare(appt.name, appt.phone, appt.date, appt.service)}
                        className="w-8 h-8 rounded-lg border border-sky-100 bg-sky-50/20 hover:bg-sky-500 text-sky-600 hover:text-white flex items-center justify-center inline-flex transition-all cursor-pointer shadow-sm"
                        title="Send confirmation via SMS"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">sms</span>
                      </button>

                      <button
                        onClick={() => handleDelete(appt.id, appt.name)}
                        className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50/20 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center inline-flex transition-all cursor-pointer shadow-sm"
                        title="Cancel appointment reservation"
                      >
                        <span className="material-symbols-outlined text-xs font-bold">delete</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
