import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Appointment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

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

    // Left column cascade slide-in
    const leftElements = leftColRef.current?.children;
    if (leftElements) {
      timeline.fromTo(
        leftElements,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
      );
    }

    // Right column scale bounce-in
    timeline.fromTo(
      rightColRef.current,
      { opacity: 0, scale: 0.9, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: "back.out(1.4)" },
      "-=0.6"
    );
  }, []);

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
            Reserve an exclusive diagnostic appointment with Dr. Aashu Thakran. Together, we will custom-formulate a treatment blueprint that celebrates your oral wellbeing and pristine smile.
          </p>

          {/* Premium features checklist */}
          <div className="space-y-4 pt-2">
            {[
              "Expert diagnostic consultation rooms access",
              "Advanced digital oral & diagnostic scanning session",
              "Comprehensive custom biological tooth planning",
              "Careful, patient-centric hygiene reception"
            ].map((perk, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary-mint text-xl font-light mt-0.5">
                  check_circle
                </span>
                <span className="font-dm text-xs md:text-sm text-charcoal font-medium">
                  {perk}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form column (Google Form Portal Card) */}
        <div ref={rightColRef} className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-lg bg-white border border-primary-mint/10 p-10 md:p-14 rounded-3xl shadow-2xl relative text-center flex flex-col items-center justify-center space-y-8">
            
            {/* Elegant clinical emblem */}
            <div className="w-16 h-16 rounded-full bg-surface-mint border border-primary-mint/20 flex items-center justify-center text-primary-mint shadow-inner">
              <span className="material-symbols-outlined text-[28px] font-light select-none">
                assignment_turned_in
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-dm text-[10px] font-bold tracking-[0.25em] text-primary-mint uppercase block">
                SECURE REGISTRATION GATEWAY
              </span>
              <h3 className="font-cormorant text-3xl font-light text-charcoal leading-tight">
                Complete Clinical Booking Request
              </h3>
              <p className="font-sans text-sm text-[#46544D] leading-relaxed max-w-sm mx-auto">
                We accept patient intake surveys, treatment preferences, and appointment details securely via official Google Forms for a flawless clinical check-in experience.
              </p>
            </div>

            {/* Premium, Gilded Google Form Button */}
            <a
              href="https://forms.gle/the-dental-elegance-gurgaon"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-xs bg-primary-mint text-white font-dm text-[12px] uppercase tracking-widest font-semibold py-4 px-8 rounded-full hover:bg-deep-green hover:shadow-[0_12px_24px_rgba(62,180,137,0.3)] transition-all duration-300 flex items-center justify-center gap-3 select-none active:scale-98 cursor-pointer"
            >
              <span>Launch Google Form</span>
              <span className="material-symbols-outlined text-[16px] leading-none">
                open_in_new
              </span>
            </a>

            <div className="text-[10px] font-dm text-[#8A9C91] uppercase tracking-wider">
              Takes less than 2 minutes to fill out
            </div>
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
