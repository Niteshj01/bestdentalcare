import React, { useState, useRef } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { DoctorProfile } from "../../types";
import { uploadFile } from "../../firebase/storage";
import Modal from "../components/Modal";

interface DoctorsProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Doctors({ showToast }: DoctorsProps) {
  const { doctors, loading, add, edit, remove } = useDoctors();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [badge, setBadge] = useState("");
  const [qualificationsText, setQualificationsText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAddModal = () => {
    setCurrentDoctor(null);
    setName("");
    setRole("");
    setBio("");
    setBadge("");
    setQualificationsText("");
    setImageUrl("");
    setUploadProgress(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (doc: DoctorProfile) => {
    setCurrentDoctor(doc);
    setName(doc.name);
    setRole(doc.role);
    setBio(doc.bio);
    setBadge(doc.badge || "");
    setQualificationsText(doc.qualifications ? doc.qualifications.join("\n") : "");
    setImageUrl(doc.image || "");
    setUploadProgress(null);
    setModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(1); // initiate loader
    try {
      const url = await uploadFile(file, "doctors", (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(url);
      showToast("Profile image loaded successfully.", "success");
    } catch (err) {
      showToast("Failed to upload profile image.", "error");
    } finally {
      setUploadProgress(null);
    }
  };

  const handleDelete = async (id: string, docName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to deactivate clinician: "${docName}"?`)) {
      return;
    }

    try {
      await remove(id);
      showToast(`Clinician "${docName}" deactivated.`, "success");
    } catch (err) {
      showToast("Failed to delete clinician record.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    const parsedQualifications = qualificationsText
      .split("\n")
      .map(q => q.trim())
      .filter(q => q !== "");

    const payload = {
      name,
      role,
      bio,
      badge: badge || "Specialist",
      image: imageUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
      qualifications: parsedQualifications.length > 0 ? parsedQualifications : ["M.D.S. Specialist Care"]
    };

    try {
      if (currentDoctor) {
        await edit(currentDoctor.id, payload);
        showToast(`Clinician Profile "${name}" updated successfully!`, "success");
      } else {
        await add(payload);
        showToast(`New Specialist "${name}" added successfully!`, "success");
      }
      setModalOpen(false);
    } catch (err) {
      showToast("Failed to process profile submission.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-0.5 text-left">
          <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
            Medical Team Atelier
          </h3>
          <p className="font-sans text-[10px] text-gray-450 uppercase tracking-wider font-semibold">
            Manage your registered doctors and specialists appearing in sections
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#3eb489] hover:bg-[#209c6f] text-white px-5 py-3 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 hover:shadow-primary-mint/30 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">person_add</span>
          <span>Register Clinician</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">Syncing specialist directories...</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-300">account_box</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No clinical profiles registered.</p>
          <p className="text-[10px] text-gray-400">Add dental team leaders above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col text-left group">
              {/* Doctor Header Banner Card with profile image */}
              <div className="h-52 bg-gradient-to-br from-[#112D1F] to-[#001D11] relative flex overflow-hidden">
                <img 
                  src={doc.image} 
                  alt={doc.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-[#ffe08f] text-[#002113] text-[9.5px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full shadow-sm">
                  {doc.badge || "Specialist"}
                </span>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-12 flex flex-col">
                  <h4 className="font-sans text-sm font-bold text-white leading-tight">{doc.name}</h4>
                  <p className="font-sans text-[10px] text-primary-mint font-semibold mt-1 uppercase tracking-wide leading-none">{doc.role}</p>
                </div>
              </div>

              {/* Bio & Quals Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-left">
                  <p className="text-xs text-gray-500 leading-relaxed max-h-24 overflow-y-auto pr-1">
                    {doc.bio}
                  </p>
                  
                  {/* Qualifications tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {doc.qualifications && doc.qualifications.map((q, qIdx) => (
                      <span key={qIdx} className="bg-[#eafef7] text-[#1c7855] text-[9px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card action controls */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => handleOpenEditModal(doc)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-600 hover:text-primary-mint font-sans font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">edit</span>
                    <span>Amend Profile</span>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    className="w-10 h-10 rounded-xl border border-rose-100 bg-rose-50/20 hover:bg-rose-600 text-rose-550 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    title="Remove specialist"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specialist Entry / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        title={currentDoctor ? `Amend Profile: ${name}` : "Create Doctor Profile"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Doctor's Full Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Dr. Gagandeep S Gauba"
                className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Title / Subheading</label>
              <input
                required
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Senior Implant Specialist"
                className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Aesthetic Honor Ribbon / Status</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., Lead Implantologist, Senior Consultant"
                className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Specialist Picture</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Insert image location URL or upload below..."
                  className="flex-1 px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 text-xs text-gray-800 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-600 flex items-center justify-center cursor-pointer transition-all shrink-0"
                  title="Upload profile photo file"
                >
                  <span className="material-symbols-outlined text-sm leading-none">cloud_upload</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              {uploadProgress !== null && (
                <div className="w-full bg-gray-50 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-primary-mint h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Specialist Narrative Biography</label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full bio detail highlighting clinical experience, specialized procedures, qualifications, and patient philosophy..."
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex justify-between">
              <span>Scientific Qualifications / Degrees</span>
              <span className="text-[8.5px] text-gray-400 lowercase font-medium">one per line</span>
            </label>
            <textarea
              rows={3}
              value={qualificationsText}
              onChange={(e) => setQualificationsText(e.target.value)}
              placeholder="e.g.&#10;B.D.S. & M.D.S. Specialist&#10;Advanced Implants Provider&#10;14+ Years Clinical Excellence"
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-3 rounded-xl border border-gray-150 hover:bg-gray-50 text-gray-500 font-sans text-[10.5px] uppercase tracking-widest font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitLoading || uploadProgress !== null}
              className="bg-[#3eb489] hover:bg-[#20946b] text-white px-6 py-3 rounded-xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitLoading ? "Publishing profile..." : currentDoctor ? "Save Amendments" : "Create Profile"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
