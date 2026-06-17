import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import BDLogo from "./BDLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Shrink/Glass navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle drawer animations for internal items when menu opens
  useEffect(() => {
    if (menuOpen) {
      // Stagger nav links
      const links = drawerRef.current?.querySelectorAll(".drawer-link");
      if (links) {
        gsap.fromTo(
          links,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.15 }
        );
      }
    }
  }, [menuOpen]);

  // Magnetic effect for the main logo & CTA button (using GSAP quickTo)
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;

    const el = ctaBtnRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 80) {
        // Magnetic pull
        xTo(deltaX * 0.25);
        yTo(deltaY * 0.25);
      } else {
        // Return to center
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleLinkClick = (id: string) => {
    setMenuOpen(false);
    const targetId = id === "clinician" ? "clinicians" : id;
    const element = document.getElementById(targetId);
    if (element) {
      // Wait for drawer to close before smooth scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed left-1/2 -translate-x-1/2 w-[92%] max-w-5xl rounded-full z-50 border transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          scrolled
            ? "top-4 bg-white/92 backdrop-blur-2xl shadow-[0_8px_32px_rgba(62,180,137,0.12)] border-primary-mint/20 py-2.5 px-6"
            : "top-8 bg-white/40 backdrop-blur-md border-white/20 py-4 px-8"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <BDLogo className="w-9 h-9 md:w-11 md:h-11" showText={true} />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {["Services", "Philosophy", "Clinician", "Gallery"].map((link) => {
              return (
                <a
                  key={link}
                  href={`#${link === "Clinician" ? "clinicians" : link.toLowerCase()}`}
                  className="relative font-dm text-[11.5px] uppercase tracking-widest text-[#4A5E54] hover:text-primary-mint font-medium py-1 transition-colors duration-250 hover:-translate-y-[1px] block group"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary-mint scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              );
            })}
          </div>

          {/* Book Appointment CTA */}
          <div className="flex items-center gap-4">
            <button
              ref={ctaBtnRef}
              onClick={() => {
                document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-primary-mint hover:bg-deep-green text-white font-dm text-[11px] uppercase tracking-wider font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_12px_24px_rgba(62,180,137,0.35)] hover:scale-104 active:scale-95 text-center hidden sm:block cursor-pointer"
            >
              Book Appointment
            </button>

            {/* Mobile Burger Open button */}
            <button
              ref={menuBtnRef}
              onClick={() => setMenuOpen(true)}
              className="p-1 md:hidden text-deep-green focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 hover:scale-110 active:scale-90 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-15.75 5.25h15.75" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Dimmed Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[9990] backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[400px] bg-surface-mint z-[9991] shadow-2xl p-10 flex flex-col justify-between border-l border-primary-mint/10 transition-transform duration-500 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Close Header */}
          <div className="flex items-center justify-between mb-16">
            <BDLogo className="w-8 h-8" showText={true} />
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 text-deep-green focus:outline-none hover:rotate-90 transition-transform duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links list */}
          <div className="flex flex-col gap-5">
            {["Services", "Philosophy", "Clinician", "Gallery"].map((link) => {
              return (
                <button
                  key={link}
                  onClick={() => handleLinkClick(link.toLowerCase())}
                  className="drawer-link text-left font-cormorant text-3.5xl font-medium text-deep-green hover:text-primary-mint transition-colors duration-200"
                >
                  {link}
                </button>
              );
            })}
          </div>
        </div>

        {/* Foot of drawer */}
        <div className="drawer-link mt-auto flex flex-col gap-3">
          <button
            onClick={() => handleLinkClick("appointment")}
            className="w-full bg-primary-mint text-white text-center py-3.5 rounded-full font-dm text-[12px] uppercase tracking-widest font-semibold hover:bg-deep-green transition-colors cursor-pointer"
          >
            Request Consult
          </button>
          <p className="text-center text-[10px] font-dm text-sage mt-4 tracking-widest uppercase">
            Shastri Nagar • Jalandhar
          </p>
        </div>
      </div>
    </>
  );
}
