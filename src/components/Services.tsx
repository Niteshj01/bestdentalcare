import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceItem } from "../types";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const services: ServiceItem[] = [
    {
      id: "dental-laminates",
      icon: "diamond",
      title: "Dental Laminates",
      description: "Meticulously designed thin porcelain layers fitted onto front teeth to correct structural discoloration, chipping, gaps, and teeth alignment issues seamlessly.",
      bullets: [
        "Ultra-conservative enamel bonding",
        "High stain resistant properties",
        "Custom smiles shape personalization"
      ]
    },
    {
      id: "sedation-dentistry",
      icon: "spa",
      title: "Sedation Dentistry",
      description: "Completely stress-free, painless, and anxiety-free clinical experiences utilizing state-of-the-art gentle dental sedation techniques.",
      bullets: [
        "Painless procedural navigation",
        "Expertly monitored safety standards",
        "Perfect comfort for dental anxiety"
      ]
    },
    {
      id: "inlays-onlays",
      icon: "healing",
      title: "Inlays & Onlays",
      description: "Custom biomechanical tooth restorations fabricated with high-strength ceramics to repair back teeth with decay, chipping, or metal restoration wear.",
      bullets: [
        "Conserves natural healthy structure",
        "Superior alternative to large fillings",
        "Perfect edge sealing against decay"
      ]
    },
    {
      id: "oral-rehabilitation",
      icon: "health_and_safety",
      title: "Oral Rehabilitation",
      description: "An integrated, multidisciplinary approach to completely reconstruct bite mechanics, joint comfort, muscle harmony, and smile aesthetics.",
      bullets: [
        "Custom computer-guided joint mapping",
        "Recreates perfect bite functionality",
        "Corrects advanced clinical tooth wear"
      ]
    },
    {
      id: "crowns-bridges",
      icon: "layers",
      title: "Ceramic Crowns & Bridges",
      description: "Long-lasting, high-durability metal-free ceramic cap restorations fitted to correct severely damaged teeth or replace missing teeth gracefully.",
      bullets: [
        "High-durability metal-free material",
        "Natural translucency and shading",
        "Re-establishes perfect structural longevity"
      ]
    }
  ];

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;

    // Header wipe animation
    gsap.fromTo(
      headerRef.current,
      { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        }
      }
    );

    // Gold underline drawer
    gsap.fromTo(
      underlineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          once: true,
        }
      }
    );

    // Cards batch entrance
    const cards = cardsRef.current?.querySelectorAll(".service-card-item");
    if (cards && cards.length > 0) {
      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 60, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.15,
              duration: 0.85,
              ease: "back.out(1.4)",
              overwrite: "auto"
            }
          );
        },
        once: true
      });
    }
  }, []);

  // Soft Ripple effect on click
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; cardId: string }[]>([]);
  let rippleId = 0;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    setActiveCard(activeCard === cardId ? null : cardId);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: ++rippleId,
      x,
      y,
      cardId
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 md:py-36 bg-[#f2fff6] px-6 md:px-12 relative overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Heading with animation nodes */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            THE CURATED SUITE
          </span>
          <div ref={headerRef} className="inline-block" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
              Clinical Artistry
            </h2>
          </div>
          {/* Gold Underline */}
          <div
            ref={underlineRef}
            className="w-24 h-[2px] bg-gradient-to-r from-gold to-[#DFBA5C] mx-auto origin-left"
            style={{ transform: "scaleX(0)" }}
          />
          <p className="font-sans text-[#4A5E54] text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Our luxury catalog synthesizes biological health standards with high-fashion smile makeovers.
          </p>
        </div>

        {/* Carousel Grid Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6 justify-center"
        >
          {services.map((item) => (
            <div
              key={item.id}
              onClick={(e) => handleCardClick(e, item.id)}
              className="service-card-item relative group bg-white border border-primary-mint/10 rounded-2xl p-8 md:p-10 shadow-lg shadow-black/2 hover:shadow-[0_20px_50px_rgba(62,180,137,0.15)] hover:-translate-y-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden flex flex-col justify-between h-full select-none animate-gpu"
            >
              {/* Card click ripples */}
              {ripples
                .filter((r) => r.cardId === item.id)
                .map((ripple) => (
                  <span
                    key={ripple.id}
                    className="absolute rounded-full bg-primary-mint/15 pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none animate-[ripple_0.6s_ease-out_forwards]"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: "150px",
                      height: "150px"
                    }}
                  />
                ))}

              {/* Shimmer sweep beam */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[150%] rotate-20 skew-x-12 group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

              <div className="space-y-6">
                {/* Icon wrapper & rotate scale effect */}
                <div className="w-16 h-16 rounded-full bg-surface-mint flex items-center justify-center border border-primary-mint/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <span className="material-symbols-outlined text-3xl text-primary-mint font-light">
                    {item.icon}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-cormorant text-2xl font-normal text-charcoal">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-[#3D4943] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Expandable and hover features: dynamic bullet dropdown lists */}
              <div className="mt-8 pt-6 border-t border-primary-mint/10 flex flex-col gap-3">
                <div
                  className={`space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${
                    activeCard === item.id || activeCard === null
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  {item.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-dm text-sage">
                      <span className="text-primary-mint text-xs">✦</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-dm text-[10px] font-bold tracking-widest text-primary-mint uppercase">
                    {activeCard === item.id ? "Minimize" : "Explore Detail"}
                  </span>
                  <span className={`material-symbols-outlined text-primary-mint font-light transition-transform duration-300 ${
                    activeCard === item.id ? "rotate-180" : "group-hover:translate-x-1"
                  }`}>
                    keyboard_arrow_right
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
