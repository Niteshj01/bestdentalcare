import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState(false);
  const [activeCase, setActiveCase] = useState<"whitening" | "scaling">("whitening");
  const [cardWidth, setCardWidth] = useState<number>(800);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      gsap.set(headingRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 });
      gsap.set(cardRef.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }

    // Heading wipe animation
    gsap.fromTo(
      headingRef.current,
      { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );

    // Card entrance scaling
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  // Handle dragging math boundaries
  const handleMove = (clientX: number) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // If active drag, we shift.
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="py-24 md:py-36 bg-[#f2fff6] px-6 md:px-12 relative overflow-hidden text-center animate-gpu"
    >
      <div className="w-full max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-4">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            THE ART OF CHANGE
          </span>
          <div ref={headingRef} style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
              Real Patients. Real Results.
            </h2>
          </div>
          <div className="w-16 h-[1.5px] bg-primary-mint mx-auto" style={{ transform: "scaleX(1)" }} />
          
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveCase("whitening")}
              className={`px-5 py-2.5 rounded-full font-dm text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                activeCase === "whitening"
                  ? "bg-primary-mint text-white shadow-md shadow-primary-mint/25 scale-102"
                  : "bg-white text-[#4A5E54] border border-primary-mint/20 hover:border-primary-mint/50"
              }`}
            >
              Teeth Whitening
            </button>
            <button
              onClick={() => setActiveCase("scaling")}
              className={`px-5 py-2.5 rounded-full font-dm text-xs uppercase tracking-wider font-semibold transition-all duration-300 ${
                activeCase === "scaling"
                  ? "bg-primary-mint text-white shadow-md shadow-primary-mint/25 scale-102"
                  : "bg-white text-[#4A5E54] border border-primary-mint/20 hover:border-primary-mint/50"
              }`}
            >
              Scaling & Polishing
            </button>
          </div>

          <p className="font-sans text-[#4A5E54] text-xs md:text-sm max-w-lg mx-auto min-h-[40px] pt-2 leading-relaxed">
            {activeCase === "whitening"
              ? "Case #0492: Complete removal of deep tobacco & tea stains with our premium biological whitening system."
              : "Case #0812: Heavy calculus and tartar build-up polished away, renewing gums and dynamic structural freshness."}
          </p>
        </div>

        {/* Interactive Case Slider Card */}
        <div
          ref={cardRef}
          className="relative aspect-[16/10] md:aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-primary-mint/15 select-none md:cursor-ew-resize opacity-0 animate-gpu bg-teal-950/20"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Before Case Wrapper: Underlay (shows the Left half) */}
          <div className="absolute inset-0 w-full h-full" style={{ filter: "brightness(0.9) contrast(1.02)" }}>
            <img
              src={activeCase === "whitening" ? "118.jpg" : "122.jpg"}
              alt="Before Treatment"
              className="absolute inset-y-0 left-0 h-full max-w-none pointer-events-none"
              style={{
                width: "200%",
                objectFit: "cover",
                objectPosition: "left center"
              }}
            />
            {/* Before Tag badge */}
            <div className="absolute top-6 left-6 bg-charcoal/70 backdrop-blur text-white font-dm text-[9px] uppercase tracking-widest px-4 py-2 rounded-full z-10 backdrop-filter">
              {activeCase === "whitening" ? "Case #0492" : "Case #0812"} • Before
            </div>
          </div>

          {/* After Case Wrapper: Overlay with clipped width (shows the Right half) */}
          <div
            className="absolute inset-0 h-full overflow-hidden border-r-2 border-gold/40"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-y-0 h-full" style={{ width: cardWidth }}>
              <img
                src={activeCase === "whitening" ? "118.jpg" : "122.jpg"}
                alt="After Treatment"
                className="absolute inset-y-0 h-full max-w-none pointer-events-none"
                style={{
                  width: "200%",
                  left: "-100%",
                  objectFit: "cover",
                  objectPosition: "right center"
                }}
              />
              {/* After Tag badge with glow pulse */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-gold to-gold-light text-charcoal font-dm text-[9.5px] font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg pulse-badge z-10">
                Restructured • After
              </div>
            </div>
          </div>

          {/* Draggable vertical central line */}
          <div
            className="absolute top-0 bottom-0 w-[4px] bg-gradient-to-b from-gold via-[#DFBA5C] to-gold cursor-ew-resize z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            {/* Center Slider Glow circle knob */}
            <div className="w-12 h-12 rounded-full bg-white text-primary-mint border-2 border-gold flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95">
              <span className="material-symbols-outlined text-lg leading-none font-semibold text-gold">
                unfold_more
              </span>
            </div>
          </div>
          
          {/* Card Hover white sparkle gleam */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />
        </div>

      </div>

      <style>{`
        .pulse-badge {
          animation: badgePulse 2s infinite ease-in-out;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(201,168,76,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 4px 20px rgba(201,168,76,0.5); }
        }
      `}</style>
    </section>
  );
}
