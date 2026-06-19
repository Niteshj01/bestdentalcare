import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceItem } from "../types";
import { useServices } from "../hooks/useServices";

gsap.registerPlugin(ScrollTrigger);

const dentalServices: ServiceItem[] = [
  {
    id: "root-canal",
    icon: "healing",
    title: "Root Canal Treatment",
    description: "Precise endodontic therapy designed to eliminate bacterial infection, preserve the natural tooth structure, and eliminate acute dental pain permanently or temporarily.",
    bullets: ["Virtually painless therapy", "Prevents extraction of damaged teeth", "Rebuilds structural tooth health"]
  },
  {
    id: "orthodontic",
    icon: "grid_view",
    title: "Orthodontic Treatment",
    description: "Expert dental alignment systems customized to correct malocclusions, crowded arches, overbites, and restore beautiful structural facial harmony.",
    bullets: ["Improvised long-term bite function", "Solves alignment & bite problems", "Custom metal or ceramic bracket solutions"]
  },
  {
    id: "dental-implants",
    icon: "precision_manufacturing",
    title: "Dental Implants",
    description: "Multi-stage biocompatible titanium implant roots coupled with custom-designed porcelain crowns that match your natural teeth with absolute stability.",
    bullets: ["Lifelike dental feel and look", "Preserves adjacent jaw bone structures", "Restores original biting force"]
  },
  {
    id: "crowns-bridges-veneers",
    icon: "layers",
    title: "Crown & Bridges & Veneers",
    description: "Premium prosthodontic ceramic solutions crafted to rebuild, seal, protect, or artistically design the visible exterior of your teeth.",
    bullets: ["Custom-shaded natural aesthetics", "Reinforces weak or fractured teeth", "Seamless gaps closure and restoration"]
  },
  {
    id: "tooth-fillings",
    icon: "brush",
    title: "Tooth Colour fillings",
    description: "Advanced multi-shade resin bonding to restore decayed, cracked, or worn teeth with composite textures completely indistinguishable from real enamel.",
    bullets: ["Mercury-free composite materials", "Preserves more tooth structure", "Polished natural enamel luster"]
  },
  {
    id: "extractions-impactions",
    icon: "medical_services",
    title: "Extractions & Impactions",
    description: "Gentle surgical management of compromised static teeth, including highly complex impacted Wisdom Teeth, prioritizing prompt healing.",
    bullets: ["At-ease painless dental procedures", "Minimally invasive extraction tech", "Guided safe post-surgery protocols"]
  },
  {
    id: "dentures",
    icon: "diversity_1",
    title: "Partial & Complete Dentures",
    description: "Artistic, comfortable, and natural-looking removable prosthetic frameworks designed to replace multiple missing teeth and restore biological chewing functions.",
    bullets: ["Ultra-lightweight acrylic bases", "High stability chewing retention", "Custom matching to natural face lines"]
  },
  {
    id: "teeth-whitening",
    icon: "magic_button",
    title: "Teeth Whitening",
    description: "High-grade laser and chemical whitening therapies engineered to lift deep cellular intrinsic enamel stains for a fast, glowing smile rejuvenation.",
    bullets: ["Uplifts 5-8 shades in one session", "Soothes sensitive enamel barriers", "Long-term bright white results"]
  },
  {
    id: "laser-surgery",
    icon: "flare",
    title: "Laser Gum Surgery",
    description: "Next-gen gentle laser therapies designed to treat gum infections, eliminate pocket bacteria, and contour gums without scalpel sutures.",
    bullets: ["Rapid healing with zero sutures", "Extremely precise target correction", "Restores healthy margins quickly"]
  },
  {
    id: "kids-dentistry",
    icon: "child_care",
    title: "Pediatric Dentistry (Kids)",
    description: "Gentle, comfortable, and positive oral clinical care for growing babies and children, emphasizing lifetime positive dental habits.",
    bullets: ["Compassionate soft communication", "Protective dental sealants and fluoride", "Fun clinical environment for kids"]
  },
  {
    id: "digital-xray",
    icon: "visibility",
    title: "Digital X-Ray",
    description: "High-definition diagnostic radiography exposing patients to 90% less radiation while producing crystal-clear instant clinical anatomy views.",
    bullets: ["Instant high-resolution imaging", "Extremely low radiation emission", "Pinpoint pre-treatment diagnostics"]
  },
  {
    id: "scaling-polishing",
    icon: "clean_hands",
    title: "Scaling & Polishing",
    description: "Comprehensive ultrasonic scale scraping to safely clear calcareous plaque buildup and gently polish away stubborn external stains.",
    bullets: ["Eliminates bad breath and plaque", "Supports strong healthy gum bonds", "Perfect glossy stain-free clean feel"]
  },
  {
    id: "aligners",
    icon: "align_items_stretch",
    title: "Invisible Braces & Aligners",
    description: "Sleek, transparent, medical-grade polyurethane aligners to shift teeth comfortably into perfect form without noticeable wires.",
    bullets: ["Completely removable for eating", "Virtually invisible visual design", "Includes custom interactive 3D mapping"]
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const { services: liveServices, loading } = useServices();
  const services = liveServices && liveServices.length > 0 ? liveServices : dentalServices;

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      gsap.set(headerRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 });
      gsap.set(underlineRef.current, { scaleX: 1 });
      const cards = cardsRef.current?.querySelectorAll(".service-card-item");
      if (cards && cards.length > 0) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      }
      return;
    }

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

    // Initial Cards batch entrance
    const cards = cardsRef.current?.querySelectorAll(".service-card-item");
    if (cards && cards.length > 0) {
      ScrollTrigger.batch(cards, {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: "power2.out",
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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, cardId: string) => {
    setActiveCard(activeCard === cardId ? null : cardId);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now() + Math.random(),
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
            Our luxury catalog synthesizes biological health standards with pain-free, state-of-the-art dental treatments and smile design.
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
                <div className="w-14 h-14 rounded-full bg-surface-mint flex items-center justify-center border border-primary-mint/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                  <span className="material-symbols-outlined text-2xl text-primary-mint font-light">
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
