import React, { useState } from "react";
import { useServices } from "../../hooks/useServices";
import { ServiceItem } from "../../types";
import Modal from "../components/Modal";

interface ServicesProps {
  showToast: (message: string, type: "success" | "error") => void;
}

export default function Services({ showToast }: ServicesProps) {
  const { services, loading, add, edit, remove } = useServices();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceItem | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("healing");
  const [bulletsText, setBulletsText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleOpenAddModal = () => {
    setCurrentService(null);
    setTitle("");
    setDescription("");
    setIcon("healing");
    setBulletsText("");
    setModalOpen(true);
  };

  const handleOpenEditModal = (service: ServiceItem) => {
    setCurrentService(service);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon || "healing");
    setBulletsText(service.bullets ? service.bullets.join("\n") : "");
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to remove the clinical service: "${name}"?`)) {
      return;
    }

    try {
      await remove(id);
      showToast(`clinical service "${name}" deleted successfully.`, "success");
    } catch (err) {
      showToast("Failed to delete clinical service.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    const parsedBullets = bulletsText
      .split("\n")
      .map(b => b.trim())
      .filter(b => b !== "");

    const payload = {
      title,
      description,
      icon,
      bullets: parsedBullets.length > 0 ? parsedBullets : ["Painless professional care"]
    };

    try {
      if (currentService) {
        await edit(currentService.id, payload);
        showToast(`Clinical Service "${title}" updated successfully!`, "success");
      } else {
        await add(payload);
        showToast(`New Clinical Service "${title}" registered successfully!`, "success");
      }
      setModalOpen(false);
    } catch (err) {
      showToast("Failed to process clinical service transaction.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Standard elegant healthcare material icons for selection
  const iconOptions = [
    { value: "healing", label: "Root Canal Treatment / Preserving" },
    { value: "grid_view", label: "Orthodontic Alignments" },
    { value: "precision_manufacturing", label: "Implants / Structural" },
    { value: "layers", label: "Crowns & Bridges" },
    { value: "brush", label: "Tooth Colour Fillings" },
    { value: "medical_services", label: "Extractions / Surgery" },
    { value: "diversity_1", label: "Dentures & Prosthetics" },
    { value: "magic_button", label: "Teeth Whitening" },
    { value: "flare", label: "Laser Surgery" },
    { value: "child_care", label: "Pediatric Care" },
    { value: "visibility", label: "Digital X-Ray / View" },
    { value: "clean_hands", label: "Scaling / Cleaning" },
    { value: "align_items_stretch", label: "Aligners / Invisible" },
    { value: "spa", label: "General aesthetics" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-0.5 text-left">
          <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-widest">
            Clinical Catalog Manager
          </h3>
          <p className="font-sans text-[10px] text-gray-450 uppercase tracking-wider font-semibold">
            Define dental treatments dynamically appearing on the homepage
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#3eb489] hover:bg-[#2fb181] text-white px-5 py-3 rounded-2xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 hover:shadow-primary-mint/30 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">add</span>
          <span>Register Service</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-50 flex flex-col items-center justify-center gap-2.5">
          <div className="w-8 h-8 border-3 border-primary-mint border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs text-gray-400 font-semibold uppercase tracking-wider">Syncing workspace definitions...</span>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center font-sans space-y-3">
          <span className="material-symbols-outlined text-4xl text-gray-300">receipt_long</span>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">No clinical catalog terms registered.</p>
          <p className="text-[10px] text-gray-400">Click the green button above to define treatments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Icon</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Treatment Title</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54] max-w-sm">Description</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-[#4A5E54]">Highlights</th>
                  <th className="p-4.5 text-[10px] uppercase font-bold tracking-widest text-right text-[#4A5E54]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-sans text-xs">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/25 transition-all">
                    <td className="p-4.5">
                      <div className="w-9 h-9 rounded-xl bg-primary-mint/10 border border-primary-mint/20 text-primary-mint flex items-center justify-center">
                        <span className="material-symbols-outlined text-base leading-none">{service.icon}</span>
                      </div>
                    </td>
                    <td className="p-4.5 font-bold text-gray-900">{service.title}</td>
                    <td className="p-4.5 text-gray-500 leading-relaxed max-w-sm truncate">{service.description}</td>
                    <td className="p-4.5">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {service.bullets && service.bullets.map((b, bIdx) => (
                          <span key={bIdx} className="bg-emerald-50 text-emerald-700 text-[9.5px] px-2 py-0.5 rounded-full font-medium border border-emerald-100/50">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4.5 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(service)}
                        className="w-8 h-8 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-600 hover:text-primary-mint flex items-center justify-center inline-flex transition-all cursor-pointer shadow-sm"
                        title="Edit clinical record"
                      >
                        <span className="material-symbols-outlined text-xs leading-none">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(service.id, service.title)}
                        className="w-8 h-8 rounded-lg border border-rose-100 bg-rose-50/50 hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center inline-flex transition-all cursor-pointer shadow-sm"
                        title="Revoke treatment"
                      >
                        <span className="material-symbols-outlined text-xs leading-none">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Register/Edit Modal element */}
      <Modal
        isOpen={modalOpen}
        title={currentService ? "Amend Treatment Definition" : "Register Treatment Term"}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Treatment Title</label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Ceramic Veneers & Crowns"
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Treatment Icon Style</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full px-4 py-3 border border-gray-150 bg-white rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium"
            >
              {iconOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Treatment Details Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief professional service description outlining techniques, clinical advantages, and scope..."
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex justify-between">
              <span>Aesthetic bullets highlight / benefits</span>
              <span className="text-[8.5px] text-gray-400 lowercase font-medium">one per line</span>
            </label>
            <textarea
              rows={3}
              value={bulletsText}
              onChange={(e) => setBulletsText(e.target.value)}
              placeholder="e.g.&#10;Custom-shaded tooth enamel&#10;Preserves native jaw structures&#10;10+ Years structural warranty"
              className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-2 focus:ring-primary-mint/5 text-xs text-gray-800 transition-all font-medium leading-relaxed font-sans"
            />
          </div>

          {/* Buttons Area */}
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
              disabled={submitLoading}
              className="bg-[#3eb489] hover:bg-[#229269] text-white px-6 py-3 rounded-xl font-sans text-[10.5px] uppercase tracking-widest font-bold shadow-md shadow-primary-mint/15 transition-all cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitLoading ? "Saving details..." : currentService ? "Save Amendments" : "Create Record"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
