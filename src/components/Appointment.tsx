import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { addAppointment } from "../firebase/firestore";
import { useServices } from "../hooks/useServices";

gsap.registerPlugin(ScrollTrigger);

export default function Appointment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const { services, loading: servicesLoading } = useServices();

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        once: true
      }
    });

    const leftElements = leftColRef.current?.children;
    if (leftElements) {
      timeline.fromTo(
        leftElements,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
      );
    }

    timeline.fromTo(
      rightColRef.current,
      { opacity: 0, scale: 0.9, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "back.out(1.4)" },
      "-=0.6"
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await addAppointment({
        name,
        phone,
        service: selectedService || (services[0]?.title || "General Consultation"),
        date: date || new Date().toISOString().split("T")[0]
      });

      setSuccess(true);
      setName("");
      setPhone("");
      setSelectedService("");
      setDate("");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Submission encountered a transient failure. Please check details and try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const treatmentOptions = [
    ...(services && services.length > 0
      ? services.map(s => ({ id: s.id, name: s.title }))
      : [
          { id: "root-canal", name: "Root Canal Treatment" },
          { id: "orthodontic", name: "Orthodontic Treatment" },
          { id: "implants", name: "Dental Implants" },
          { id: "crowns", name: "Crowns, Bridges & Veneers" },
          { id: "fillings", name: "Tooth Colour Fillings" },
          { id: "whitening", name: "Teeth Whitening" }
        ]),
    { id: "other", name: "Other / General Consultation" }
  ];

  return (
    <section
      id="appointment"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#ffeaf2]/10 bg-surface-mint px-6 md:px-12 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-mint/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Editorial details Column */}
        <div ref={leftColRef} className="lg:col-span-5 space-y-8 text-left">
          <div className="space-y-4">
            <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
              BEGIN YOUR TRANSFORMATION
            </span>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
              Request A Private Consultation
            </h2>
            <div className="w-16 h-[1.5px] bg-primary-mint" />
          </div>

          <p className="font-sans text-sm md:text-base text-[#46544D] leading-relaxed">
            Reserve an exclusive diagnostic appointment with Dr. Sky Dentistry. Together, we will custom-formulate a treatment blueprint that celebrates your oral wellbeing and pristine smile.
          </p>

          {/* Premium features checklist */}
          <div className="space-y-4 pt-2">
            {[
              "Expert diagnostic consultation rooms access",
              "Advanced digital oral & diagnostic scanning session",
              "Comprehensive custom biological tooth planning",
              "Careful, patient-centric hygiene reception"
            ].map((perk, idx) => (
              <div key={idx} className="flex items-start gap-3 text-left">
                <span className="material-symbols-outlined text-primary-mint text-xl font-light mt-0.5">
                  check_circle
                </span>
                <span className="font-dm text-xs md:text-sm text-charcoal font-medium text-left">
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form column (Direct Appointment Scheduler) */}
        <div ref={rightColRef} className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white border border-primary-mint/10 p-8 md:p-12 rounded-3xl shadow-2xl relative flex flex-col justify-center space-y-6">
            
            {success ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-5 animate-gpu">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center animate-bounce">
                  <span className="material-symbols-outlined text-3xl font-bold leading-none select-none">check</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-cormorant text-2xl font-bold text-gray-900 leading-tight">
                    Appointment Registered!
                  </h3>
                  <p className="font-sans text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                    Thank you. Your diagnostic request was written securely. Dr. Sky's desk coordinator will call you shortly to finalize details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="font-sans text-[11px] font-semibold text-primary-mint border border-primary-mint/20 px-5 py-2.5 rounded-full hover:bg-primary-mint/5 uppercase tracking-widest transition-all cursor-pointer"
                >
                  Book another session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left font-sans text-xs text-gray-700">
                <div className="space-y-1">
                  <span className="font-dm text-[9px] font-bold tracking-[0.25em] text-primary-mint uppercase block text-center mb-1">
                    SECURE REGISTRATION GATEWAY
                  </span>
                  <h3 className="font-cormorant text-2xl font-medium text-charcoal leading-tight text-center">
                    Clinical Booking Request
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Patient Name</label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-1 focus:ring-primary-mint/5 font-medium"
                    />
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Mobile Phone</label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 99999 12345"
                      className="w-full px-4 py-3 border border-gray-150 rounded-xl outline-none focus:border-primary-mint/55 focus:ring-1 focus:ring-primary-mint/5 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service selection menu */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Select Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-150 bg-white rounded-xl outline-none focus:border-[#42b68d]/60 text-xs text-gray-800 transition-all font-medium"
                    >
                      <option value="">-- Treatment selection --</option>
                      {treatmentOptions.map((opt, idx) => (
                        <option key={`${opt.id}-${idx}`} value={opt.name}>{opt.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date selection field */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-gray-400">Target Date</label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border border-gray-150 bg-white rounded-xl outline-none focus:border-primary-mint/55 text-xs font-semibold text-gray-800 transition-all"
                    />
                  </div>
                </div>

                {/* Submit trigger button */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-[#3eb489] hover:bg-[#21956c] font-dm text-[11px] uppercase tracking-widest font-bold py-4 rounded-full text-white shadow-lg shadow-primary-mint/10 hover:shadow-primary-mint/20 hover:translate-y-[-0.5px] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Writing appointment file...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm font-bold">event_available</span>
                      <span>Book Diagnostic Appointment</span>
                    </>
                  )}
                </button>


              </form>
            )}

          </div>
        </div>

      </div>

      <style>{`
        @keyframes drawCheck {
          0% { stroke-dashoffset: 100; stroke-dasharray: 100; }
          100% { stroke-dashoffset: 0; stroke-dasharray: 100; }
        }
      `}</style>
    </section>
  );
}
