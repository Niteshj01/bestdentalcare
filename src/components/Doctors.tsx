import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DoctorProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
// @ts-ignore
import doctorImg from "../assets/images/regenerated_image_1781715483180.png";

gsap.registerPlugin(ScrollTrigger);

export default function Doctors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLeftRef = useRef<HTMLDivElement>(null);
  const cardRightRef = useRef<HTMLDivElement>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [clickedDocId, setClickedDocId] = useState<string | null>(null);

  const clinicians: DoctorProfile[] = [
    {
      id: "gagandeep-s-gauba",
      name: "Dr. Gagandeep S Gauba",
      role: "BDS, MDS - Senior Dentist & Dental Implants Specialist",
      bio: "Dr. Gagandeep S Gauba is a highly distinguished dental implants provider and senior clinician with over 14 years of clinical experience. Specializing in advanced painless implantology, dental aesthetics, single-visit root canals, and precision orthodontics, Dr. Gauba is dedicated to transforming smiles using the latest advancements like digital radiovisiography, endomotors, and state-of-the-art restorative techniques.",
      image: doctorImg,
      badge: "Lead Implantologist",
      qualifications: ["B.D.S. & M.D.S. Specialist", "Advanced Implantology", "14+ Years Clinical Excellence"]
    }
  ];

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      if (cardLeftRef.current) {
        gsap.set(cardLeftRef.current, { x: 0, opacity: 1 });
        gsap.set(cardLeftRef.current.querySelector(".doctor-frame"), { scale: 1, rotation: 0, opacity: 1 });
        const pills = cardLeftRef.current.querySelectorAll(".qual-pill");
        if (pills.length > 0) gsap.set(pills, { scale: 1, opacity: 1 });
      }
      if (cardRightRef.current) {
        gsap.set(cardRightRef.current, { x: 0, opacity: 1 });
        gsap.set(cardRightRef.current.querySelector(".doctor-frame"), { scale: 1, rotation: 0, opacity: 1 });
        const pills = cardRightRef.current.querySelectorAll(".qual-pill");
        if (pills.length > 0) gsap.set(pills, { scale: 1, opacity: 1 });
      }
      return;
    }

    const leftCard = cardLeftRef.current;
    const rightCard = cardRightRef.current;

    if (leftCard) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: leftCard,
          start: "top 80%",
          once: true
        }
      });

      // Dr. Sanya slides from left
      tl.fromTo(
        leftCard,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
      );

      // Frame inside slides scale / rotate
      tl.fromTo(
        leftCard.querySelector(".doctor-frame"),
        { scale: 0.8, rotation: -8, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: "back.out(1.5)" },
        "-=0.7"
      );

      // Pills stagger
      const pills = leftCard.querySelectorAll(".qual-pill");
      if (pills.length > 0) {
        tl.fromTo(
          pills,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: "back.out(1.8)" },
          "-=0.4"
        );
      }
    }

    if (rightCard) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rightCard,
          start: "top 80%",
          once: true
        }
      });

      // Dr. Julian slides from right
      tl.fromTo(
        rightCard,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
      );

      // Frame inside slides scale / rotate
      tl.fromTo(
        rightCard.querySelector(".doctor-frame"),
        { scale: 0.8, rotation: 8, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: "back.out(1.5)" },
        "-=0.7"
      );

      // Pills stagger
      const pills = rightCard.querySelectorAll(".qual-pill");
      if (pills.length > 0) {
        tl.fromTo(
          pills,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.08, duration: 0.5, ease: "back.out(1.8)" },
          "-=0.4"
        );
      }
    }

    // Magnetic effect on Doctor cards
    const cards = [leftCard, rightCard];
    cards.forEach((card) => {
      if (!card) return;
      const xTo = gsap.quickTo(card, "x", { duration: 0.4, ease: "power2.out" });
      const yTo = gsap.quickTo(card, "y", { duration: 0.4, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 150) {
          xTo((e.clientX - centerX) * 0.12);
          yTo((e.clientY - centerY) * 0.12);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("mousemove", onMouseMove);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    });
  }, []);

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
        <div className="flex justify-center">
          
          {/* Doctor 1 Card (Left slide) */}
          <div
            ref={cardLeftRef}
            className="doctor-card-wrapper max-w-2xl relative bg-white border border-primary-mint/10 rounded-2xl p-8 md:p-12 shadow-xl hover:shadow-[0_24px_50px_rgba(62,180,137,0.12)] transition-shadow duration-500 flex flex-col md:flex-row gap-8 items-center md:items-start text-left select-none animate-gpu"
          >
            {/* Visual Frame Block with morph hover and tap-to-popout */}
            <div
              onClick={() => {
                setClickedDocId(clinicians[0].id);
                setSelectedDoctor(clinicians[0]);
              }}
              className="relative flex-shrink-0 w-44 h-44 rounded-full overflow-hidden doctor-frame border border-primary-mint/20 shadow-md cursor-pointer group active:scale-95 transition-transform duration-200"
            >
              <img
                alt={clinicians[0].name}
                className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-115 group-hover:grayscale-0 ${
                  clickedDocId === clinicians[0].id ? "grayscale-0 scale-110" : "grayscale"
                }`}
                referrerPolicy="no-referrer"
                src={clinicians[0].image}
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=640&auto=format&fit=crop";
                }}
              />
              <div className="absolute top-2 right-2 bg-gradient-to-br from-gold to-gold-light text-charcoal font-dm text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow z-10">
                {clinicians[0].badge}
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div>
                <h3 className="font-cormorant text-2xl font-semibold text-charcoal hover:text-primary-mint transition-colors">
                  {clinicians[0].name}
                </h3>
                <span className="font-accent italic text-sage text-sm block mt-1">
                  {clinicians[0].role}
                </span>
              </div>
              <p className="font-sans text-xs md:text-sm text-[#3D4943] leading-relaxed">
                {clinicians[0].bio}
              </p>

              {/* Qualification Pills list */}
              <div className="flex flex-wrap gap-2 pt-2">
                {clinicians[0].qualifications.map((qual, index) => (
                  <span
                    key={index}
                    className="qual-pill bg-surface-mint border border-primary-mint/10 text-primary-mint font-dm text-[9px] uppercase tracking-wider px-3 py-1 rounded-full"
                  >
                    {qual}
                  </span>
                ))}
              </div>
            </div>
          </div>

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
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden border border-primary-mint/20 shadow-2xl z-10 flex flex-col items-center text-center p-8 md:p-10 space-y-6"
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
                <img
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover object-center grayscale-0 scale-105"
                  referrerPolicy="no-referrer"
                  src={selectedDoctor.image}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=640&auto=format&fit=crop";
                  }}
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
                <span className="font-accent italic text-primary-mint text-sm md:text-base block font-medium">
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
                  {selectedDoctor.qualifications.map((qual, index) => (
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
