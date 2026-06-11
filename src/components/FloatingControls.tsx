import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function FloatingControls() {
  const [showScroll, setShowScroll] = useState(false);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
  const waBtnRef = useRef<HTMLAnchorElement>(null);
  const bookBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", handleScrollVisibility);
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);

  useEffect(() => {
    // Scroll-to-top button transition
    if (showScroll && scrollBtnRef.current) {
      gsap.to(scrollBtnRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.35,
        ease: "back.out(1.7)",
      });
    } else if (scrollBtnRef.current) {
      gsap.to(scrollBtnRef.current, {
        opacity: 0,
        scale: 0.5,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [showScroll]);

  // Handle Scroll to Top click with rotating element
  const handleScrollToTopAction = () => {
    const btn = scrollBtnRef.current;
    if (btn) {
      // 360 deg spin
      gsap.fromTo(
        btn.querySelector(".arrow-icon"),
        { rotation: 0 },
        { rotation: 360, duration: 0.8, ease: "power2.inOut" }
      );
    }
    // Smooth scroll utilizing Lenis or native
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBookAppointment = () => {
    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Bottom Right Floating Controls */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4 select-none">
        
        {/* 1. Scroll to Top button */}
        <button
          ref={scrollBtnRef}
          onClick={handleScrollToTopAction}
          className="w-11 h-11 rounded-full bg-white border border-primary-mint/15 text-primary-mint flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-surface-mint scale-0 hover:scale-110 active:scale-95 group opacity-0 pointer-events-auto"
          aria-label="Scroll to top"
        >
          <span className="material-symbols-outlined text-[20px] font-bold leading-none arrow-icon group-hover:-translate-y-1 transition-transform">
            arrow_upward
          </span>
        </button>

        {/* 2. Floating Quick Book Pill */}
        <button
          ref={bookBtnRef}
          onClick={handleBookAppointment}
          className="bg-primary-mint text-white border border-primary-mint/10 h-12 px-6 rounded-full flex items-center gap-2 shadow-lg hover:bg-deep-green transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer relative"
        >
          <span className="material-symbols-outlined text-[18px] leading-none">
            calendar_month
          </span>
          <span className="font-dm text-[11px] uppercase tracking-widest font-bold">
            Book
          </span>
        </button>
      </div>

      {/* Bottom Left Floating Controls */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-4 select-none">
        {/* 3. Floating Call button */}
        <a
          href="tel:+919006490024"
          className="w-12 h-12 rounded-full bg-gold text-charcoal flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-112 active:scale-95 group relative pulse-call"
          aria-label="Call Best Dental Care"
        >
          <span className="material-symbols-outlined text-[20px] font-semibold text-charcoal leading-none">
            call
          </span>
          {/* Floating Tooltip positioned to the right */}
          <span className="absolute left-14 bg-charcoal/90 backdrop-blur text-white text-[10px] font-dm uppercase tracking-widest px-3 py-1.5 rounded-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/5 whitespace-nowrap">
            Call Clinic
          </span>
        </a>

        {/* 4. Floating WhatsApp button with tooltips */}
        <a
          ref={waBtnRef}
          href="https://wa.me/919006490024"
          target="_blank"
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-112 active:scale-95 group relative pulse-wa"
          aria-label="Contact via WhatsApp"
          onClick={() => {
            gsap.fromTo(
              waBtnRef.current,
              { scale: 1 },
              { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 }
            );
          }}
        >
          {/* Custom chat SVG icon */}
          <svg
            className="w-6 h-6 fill-white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.894 0c3.18 0 6.171 1.242 8.425 3.496C22.575 5.75 23.812 8.744 23.81 11.93c-.004 6.56-5.329 11.885-11.896 11.885-2.002-.001-3.967-.506-5.717-1.468L0 24zm6.541-3.411c1.623.963 3.226 1.468 4.793 1.468 5.485 0 9.947-4.461 9.95-9.948.002-2.658-1.034-5.158-2.92-7.045C16.535 3.178 14.041 2.14 11.385 2.14c-5.489 0-9.954 4.463-9.957 9.951-.001 1.666.444 3.291 1.288 4.708L1.69 20.91l4.908-1.288zM17.51 14.5c-.322-.162-1.905-.94-2.198-1.048-.293-.108-.507-.162-.722.162-.215.322-.832 1.048-1.019 1.264-.188.215-.375.242-.697.08-1.58-.788-2.673-1.378-3.738-3.21-.282-.484.282-.45.807-.45.323 0 .323-.162.484-.484.162-.322.08-.604-.04-.81-.12-.206-.722-1.748-.99-2.394-.26-.625-.526-.54-.722-.55-.188-.01-.403-.01-.617-.01s-.564.08-.86.403c-.296.322-1.128 1.102-1.128 2.69s1.155 3.12 1.316 3.322c.162.202 2.274 3.473 5.51 4.873.77.332 1.372.531 1.84.679.774.246 1.478.21 2.036.128.621-.092 1.905-.78 2.174-1.53.27-.75.27-1.396.188-1.53-.082-.136-.296-.217-.61-.38z" />
          </svg>

          {/* Floating Tooltip positioned to the right */}
          <span className="absolute left-14 bg-charcoal/90 backdrop-blur text-white text-[10px] font-dm uppercase tracking-widest px-3 py-1.5 rounded-md opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl border border-white/5 whitespace-nowrap">
            Concierge Chat
          </span>
        </a>
      </div>

      <style>{`
        .pulse-wa {
          animation: waPulse 1.8s infinite;
        }
        .pulse-call {
          animation: callPulse 1.8s infinite;
        }
        @keyframes waPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        @keyframes callPulse {
          0% { box-shadow: 0 0 0 0 rgba(223, 186, 92, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(223, 186, 92, 0); }
          100% { box-shadow: 0 0 0 0 rgba(223, 186, 92, 0); }
        }
      `}</style>
    </>
  );
}
