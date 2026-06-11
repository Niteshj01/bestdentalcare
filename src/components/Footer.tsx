import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BDLogo from "./BDLogo";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const goldStarRef = useRef<HTMLDivElement>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [emailText, setEmailText] = useState("");

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      if (markRef.current) gsap.set(markRef.current, { xPercent: 0 });
      const columns = containerRef.current?.querySelectorAll(".footer-column");
      if (columns && columns.length > 0) gsap.set(columns, { opacity: 1, y: 0 });
      return;
    }

    // Horizontal scroll layout watermark sliding on scroll
    gsap.fromTo(
      markRef.current,
      { xPercent: -15 },
      {
        xPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.0
        }
      }
    );

    // Stagger column entries
    const columns = containerRef.current?.querySelectorAll(".footer-column");
    if (columns && columns.length > 0) {
      gsap.fromTo(
        columns,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true
          }
        }
      );
    }

    // Slow rotate star
    gsap.to(goldStarRef.current, {
      rotation: 360,
      duration: 15,
      ease: "none",
      repeat: -1
    });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText) return;
    setSubscribed(true);
    setEmailText("");
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={containerRef}
      className="bg-[#002113] text-white pt-24 pb-12 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Huge watermarked text sliding horizontally under columns */}
      <div
        ref={markRef}
        className="absolute bottom-16 left-0 right-0 font-cormorant text-[11vw] md:text-[8vw] font-bold text-white/[0.02] uppercase tracking-[0.2em] whitespace-nowrap pointer-events-none select-none text-center"
      >
        BEST DENTAL CARE
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/5 pb-16">
          
          {/* Column 1: Clinic Overview */}
          <div className="footer-column space-y-6 text-left">
            <div
              onClick={handleScrollToTop}
              className="cursor-pointer"
            >
              <BDLogo className="w-10 h-10 inline-block mr-2" />
              <span className="font-cormorant text-xl font-bold tracking-[0.05em] align-middle">
                BEST DENTAL CARE
              </span>
            </div>
            <p className="font-sans text-xs text-surface-mint/70 leading-relaxed max-w-xs">
              Providing top-notch multi-specialty dental care and advanced oral health solutions with safe, comfortable, and reliable procedures.
            </p>
            <p className="font-dm text-xs text-primary-mint font-semibold tracking-wide">
              Sector 14 • Hissar • Haryana
            </p>
          </div>

          {/* Column 2: Offerings Links */}
          <div className="footer-column space-y-4 text-left">
            <h5 className="font-dm text-[10px] font-bold tracking-[0.2em] uppercase text-[#ffe08f]">
              OUR CLINICAL SERVICES
            </h5>
            <ul className="space-y-2.5 font-dm text-xs text-white/60">
              {["Dental Laminates", "Sedation Dentistry", "Inlays & Onlays", "Oral Rehabilitation", "Ceramic Crowns & Bridges"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a
                      href="#services"
                      className="hover:text-primary-mint transition-colors duration-200 block hover:translate-x-1"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Contact & Atelier Details */}
          <div className="footer-column space-y-4 text-left">
            <h5 className="font-dm text-[10px] font-bold tracking-[0.2em] uppercase text-[#ffe08f]">
              CLINIC HOURS
            </h5>
            <ul className="space-y-2 font-sans text-xs text-white/60">
              <li>Mon — Sat: 9:00 AM — 7:00 PM</li>
              <li>Sunday: By Appointment Only</li>
              <li className="pt-2 text-primary-mint font-medium font-dm">
                Contact: +91 98962 46544
              </li>
              <li className="text-white/40">
                Sector 14, Near Community Centre, Hisar
              </li>
            </ul>
          </div>

          {/* Column 4: News Subscription & Pulse badge */}
          <div className="footer-column space-y-4 text-left">
            <h5 className="font-dm text-[10px] font-bold tracking-[0.2em] uppercase text-[#ffe08f]">
              THE TRANSFORMATION JOURNAL
            </h5>
            <p className="font-sans text-xs text-white/50 leading-relaxed">
              Subscribe to receive private surgical releases, smile styling portfolios, and special atelier updates.
            </p>

            {subscribed ? (
              <div className="bg-primary-mint/10 border border-primary-mint/30 rounded-xl p-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-mint text-sm">
                  done_all
                </span>
                <span className="font-dm text-[11px] text-[#b1efd8] font-bold uppercase tracking-widest">
                  Thank you for subscribing
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  required
                  type="email"
                  placeholder="Atelier Email Address"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2.5 outline-none text-xs text-white placeholder-white/30 focus:border-primary-mint/50 focus:bg-white/10 transition-all flex-grow font-sans"
                />
                <button
                  type="submit"
                  className="bg-primary-mint hover:bg-deep-green text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow hover:scale-105"
                  aria-label="Subscribe"
                >
                  <span className="material-symbols-outlined text-sm font-bold">
                    arrow_forward
                  </span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Lower copyright row with secondary legal links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 font-dm text-[11px] text-white/30">
          <div className="flex items-center gap-2">
            {/* Rotating Star icon */}
            <div ref={goldStarRef} className="w-5 h-5 flex items-center justify-center text-primary-mint">
              <span className="material-symbols-outlined text-[16px] leading-none select-none">
                star
              </span>
            </div>
            <p>© 2026 BEST Dental Care Hisar. All rights reserved.</p>
          </div>

          <div className="flex gap-6 uppercase tracking-widest font-semibold">
            <a href="#services" className="hover:text-primary-mint transition-colors">Services</a>
            <a href="#philosophy" className="hover:text-primary-mint transition-colors">Story</a>
            <a href="#appointment" className="hover:text-primary-mint transition-colors">Reserve</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
