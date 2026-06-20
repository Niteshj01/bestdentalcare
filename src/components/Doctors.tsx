import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DoctorProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useDoctors } from "../hooks/useDoctors";
import SafeImage from "./SafeImage";

gsap.registerPlugin(ScrollTrigger);

export default function Doctors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [clickedDocId, setClickedDocId] = useState<string | null>(null);

  const { doctors: liveDoctors, loading } = useDoctors();

  const staticClinicians: DoctorProfile[] = [
    {
      id: "gagandeep-s-gauba",
      name: "Dr. Gagandeep S Gauba",
      role: "BDS, MDS - Senior Dentist & Dental Implants Specialist",
      bio: "Dr. Gagandeep S Gauba is a highly distinguished dental implants provider and senior clinician with over 14 years of clinical experience. Specializing in advanced painless implantology, dental aesthetics, single-visit root canals, and precision orthodontics, Dr. Gauba is dedicated to transforming smiles using the latest advancements like digital radiovisiography, endomotors, and state-of-the-art restorative techniques.",
      image: "/888.jpg",
      badge: "Lead Implantologist",
      qualifications: ["B.D.S. & M.D.S. Specialist", "Advanced Implantology", "14+ Years Clinical Excellence"]
    }
  ];

  const clinicians = liveDoctors && liveDoctors.length > 0 ? liveDoctors : staticClinicians;

  return (
    <section
      id="clinicians"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#e8ffef] px-6 md:px-12 relative overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            THE ARTISANS
          </span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
            Clinical Expertise
          </h2>
          <div className="w-16 h-[1.5px] bg-primary-mint mx-auto" />
          <p className="font-sans text-[#4A5E54] text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
            Meet the world-renowned practitioners blending advanced biological diagnostics with high-beauty restorative standards.
          </p>
        </div>

        {/* Centered Premium Doctor Card layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-center max-w-5xl mx-auto">
          {clinicians.map((doc, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              key={doc.id || idx}
              className="doctor-card-wrapper w-full relative bg-white border border-primary-mint/10 rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-[0_24px_50px_rgba(62,180,137,0.12)] transition-shadow duration-500 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left select-none animate-gpu"
            >
              {/* Visual Frame Block with morph hover and tap-to-popout */}
              <div
                onClick={() => {
                  setClickedDocId(doc.id);
                  setSelectedDoctor(doc);
                }}
                className="relative flex-shrink-0 w-36 h-36 rounded-full overflow-hidden border border-primary-mint/20 shadow-md cursor-pointer group active:scale-95 transition-transform duration-200"
              >
                <SafeImage
                  alt={doc.name}
                  className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-115 group-hover:grayscale-0 ${
                    clickedDocId === doc.id ? "grayscale-0 scale-110" : "grayscale"
                  }`}
                  referrerPolicy="no-referrer"
                  src={doc.image}
                  placeholderType="doctor"
                />
                <div className="absolute top-2 right-2 bg-gradient-to-br from-gold to-gold-light text-[#001D11] font-dm text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full shadow z-10">
                  {doc.badge || "Specialist"}
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                <div>
                  <h3 className="font-cormorant text-xl font-semibold text-charcoal hover:text-primary-mint transition-colors">
                    {doc.name}
                  </h3>
                  <span className="font-sans font-medium text-sage text-xs block mt-1">
                    {doc.role}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#3D4943] leading-relaxed line-clamp-4">
                  {doc.bio}
                </p>

                {/* Qualification Pills list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.qualifications && doc.qualifications.map((qual, index) => (
                    <span
                      key={index}
                      className="qual-pill bg-surface-mint border border-primary-mint/10 text-primary-mint font-dm text-[8.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold"
                    >
                      {qual}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Pop-out Box Lightbox Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            {/* Backdrop Area to Tap and Close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctor(null)}
              className="absolute inset-0 cursor-zoom-out"
            />
            
            {/* Premium, centered, spring-animated modal */}
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border border-primary-mint/20 shadow-2xl z-10 flex flex-col items-center text-center p-8 md:p-10 space-y-6 animate-gpu"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 text-charcoal/60 hover:text-charcoal w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-all duration-300 pointer-events-auto"
                aria-label="Close"
              >
                <span className="material-symbols-outlined font-light text-2xl select-none">close</span>
              </button>

              {/* Large, colorful popped-out image container */}
              <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-gold shadow-lg">
                <SafeImage
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover object-center grayscale-0 scale-105"
                  referrerPolicy="no-referrer"
                  src={selectedDoctor.image}
                  placeholderType="doctor"
                />
                <div className="absolute top-2 right-1/2 translate-x-1/2 bg-gradient-to-br from-gold to-gold-light text-[#1F2C24] font-dm text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow">
                  {selectedDoctor.badge}
                </div>
              </div>

              {/* Profile Bio Details */}
              <div className="space-y-3">
                <h3 className="font-cormorant text-2xl md:text-3xl font-bold text-charcoal leading-tight">
                  {selectedDoctor.name}
                </h3>
                <span className="font-sans text-primary-mint text-sm md:text-base block font-medium">
                  {selectedDoctor.role}
                </span>
                <p className="font-sans text-xs md:text-sm text-[#4A5E54] leading-relaxed max-w-sm mx-auto">
                  {selectedDoctor.bio}
                </p>
              </div>

              {/* Professional Credentials tags */}
              <div className="w-full pt-4 border-t border-primary-mint/10">
                <h4 className="font-dm text-[9px] font-bold tracking-[0.2em] text-[#C9A84C] uppercase mb-3">
                  Pristine Credentials
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedDoctor.qualifications && selectedDoctor.qualifications.map((qual, index) => (
                    <span
                      key={index}
                      className="bg-surface-mint border border-primary-mint/10 text-primary-mint font-dm text-[9px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm"
                    >
                      {qual}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
