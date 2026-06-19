import React, { useState, useEffect } from "react";
import { getClinicInfo, updateClinicInfo } from "../../firebase/firestore";
import { ClinicInfoData } from "../../types";

interface ClinicInfoProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function ClinicInfo({ showToast }: ClinicInfoProps) {
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form Fields
  const [clinicName, setClinicName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [googleMapsEmbedLink, setGoogleMapsEmbedLink] = useState("");

  // Working Hours (individual)
  const [monHours, setMonHours] = useState("");
  const [tueHours, setTueHours] = useState("");
  const [wedHours, setWedHours] = useState("");
  const [thuHours, setThuHours] = useState("");
  const [friHours, setFriHours] = useState("");
  const [satHours, setSatHours] = useState("");
  const [sunHours, setSunHours] = useState("");

  // Social Links
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true);
      try {
        const info = await getClinicInfo();
        setClinicName(info.clinicName || "Dr. Sky Dentistry");
        setTagline(info.tagline || "");
        setPhone1(info.phone1 || "");
        setPhone2(info.phone2 || "");
        setWhatsappNumber(info.whatsappNumber || "");
        setEmail(info.email || "");
        setAddress(info.address || "");
        setGoogleMapsEmbedLink(info.googleMapsEmbedLink || "");

        // Opening Hours fallback checks
        const hours: any = info.openingHours || {};
        setMonHours(hours.monday || "Open 24 Hours");
        setTueHours(hours.tuesday || "Open 24 Hours");
        setWedHours(hours.wednesday || "Open 24 Hours");
        setThuHours(hours.thursday || "Open 24 Hours");
        setFriHours(hours.friday || "Open 24 Hours");
        setSatHours(hours.saturday || "Open 24 Hours");
        setSunHours(hours.sunday || "Open 24 Hours");

        // Socials fallback checks
        const socials: any = info.socialLinks || {};
        setFacebook(socials.facebook || "");
        setInstagram(socials.instagram || "");
        setYoutube(socials.youtube || "");
      } catch (err) {
        showToast("Failed to fetch studio information setup.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    const updatedData: ClinicInfoData = {
      clinicName,
      tagline,
      phone1,
      phone2,
      whatsappNumber,
      email,
      address,
      googleMapsEmbedLink,
      openingHours: {
        monday: monHours,
        tuesday: tueHours,
        wednesday: wedHours,
        thursday: thuHours,
        friday: friHours,
        saturday: satHours,
        sunday: sunHours
      },
      socialLinks: {
        facebook,
        instagram,
        youtube
      }
    };

    try {
      await updateClinicInfo(updatedData);
      showToast("Studio metadata configurations successfully persisted!", "success");
    } catch (err) {
      showToast("Failed to update studio configurations.", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5 shadow-sm">
        <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
        <span className="font-sans text-xs text-gray-400 font-semibold">Reading studio configuration specs...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans text-xs">
      {/* 1. Core Clinic details properties card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2 uppercase tracking-widest text-left">
          <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
          Primary Studio Metadata
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Clinic Name</label>
            <input
              required
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Clinic Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Tagline / Mission statement</label>
          <textarea
            required
            rows={2}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Primary Hotline 1</label>
            <input
              required
              type="text"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Secondary Hotline 2</label>
            <input
              type="text"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">WhatsApp Hotlink Number</label>
            <input
              required
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Full Physical Address</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Google Maps Embed Link (Iframe Src URL)</label>
            <textarea
              required
              rows={3}
              value={googleMapsEmbedLink}
              onChange={(e) => setGoogleMapsEmbedLink(e.target.value)}
              placeholder="e.g. https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed font-mono"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. Opening hours weekly grid cards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2 uppercase tracking-widest text-left">
            <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
            Clinic Service Hours
          </h3>

          <div className="space-y-3 font-sans text-left">
            {[
              { label: "Monday", val: monHours, set: setMonHours },
              { label: "Tuesday", val: tueHours, set: setTueHours },
              { label: "Wednesday", val: wedHours, set: setWedHours },
              { label: "Thursday", val: thuHours, set: setThuHours },
              { label: "Friday", val: friHours, set: setFriHours },
              { label: "Saturday", val: satHours, set: setSatHours },
              { label: "Sunday", val: sunHours, set: setSunHours }
            ].map(day => (
              <div key={day.label} className="grid grid-cols-1 sm:grid-cols-3 items-center gap-2 border-b border-gray-50 pb-1.5">
                <span className="font-bold text-gray-500 uppercase tracking-widest text-[9.5px]">{day.label}</span>
                <input
                  type="text"
                  value={day.val}
                  onChange={(e) => day.set(e.target.value)}
                  placeholder="e.g., Open 24 Hours or 09:00 AM - 08:30 PM"
                  className="sm:col-span-2 px-3 py-2 border border-gray-150 rounded-lg outline-none focus:border-primary-mint/55 text-xs font-semibold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Social connections fields card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-3 flex items-center gap-2 uppercase tracking-widest text-left">
              <span className="w-1.5 h-3 bg-primary-mint rounded-full inline-block" />
              Social Media Channels
            </h3>

            <div className="space-y-4 font-sans text-left">
              <div className="space-y-1">
                <label className="text-[9.5px] uppercase font-bold tracking-widest text-gray-400">Facebook Page URL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[11px] uppercase tracking-wider font-sans">FB :</span>
                  <input
                    type="url"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/drskydentistry"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] uppercase font-bold tracking-widest text-gray-400">Instagram Handle URL</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[11px] uppercase tracking-wider font-sans">IG :</span>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/drskydentistry"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9.5px] uppercase font-bold tracking-widest text-gray-400">YouTube Channel Link</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[11px] uppercase tracking-wider font-sans">YT :</span>
                  <input
                    type="url"
                    value={youtube}
                    onChange={(e) => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/c/drskydentistry"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className="w-full sm:w-auto bg-[#3eb489] hover:bg-[#20946b] text-white px-8 py-3.5 rounded-2xl font-sans text-[11px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saveLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Syncing configurations...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm font-bold">save_as</span>
                  <span>Commit All Configurations</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
