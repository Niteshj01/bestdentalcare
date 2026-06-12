import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ServiceItem } from "../types";

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

const cosmeticsServices: ServiceItem[] = [
  {
    id: "prp",
    icon: "water_drop",
    title: "PRP",
    description: "Advanced autologous platelet enrichment therapy designed to inject direct nutrient healing blocks to hair follicles and skin layers.",
    bullets: ["100% natural biometric solution", "Fosters intense cellular health", "Superb for deep hair root restoration"]
  },
  {
    id: "gfc",
    icon: "opacity",
    title: "GFC",
    description: "Growth Factor Concentrate clinical therapy harnessing pure plate-derived proteins to rejuvenate facial volume and scalp vitality safely.",
    bullets: ["Highly concentrated premium formula", "Accelerated collagen density rebuild", "Dramatically controls dermal aging speed"]
  },
  {
    id: "botox",
    icon: "spa",
    title: "Botox",
    description: "Targeted, hyper-precise cosmetic relaxation injectables formulated to effortlessly smooth out frown lines and dynamic facial folds.",
    bullets: ["Virtually zero recovery time", "Extremely natural soft finish", "Fades forehead lines in 3-7 days"]
  },
  {
    id: "threads",
    icon: "gesture",
    title: "Threads",
    description: "Sophisticated surgical PDO thread suspension designed to lift saggy lower cheeks, double chins, and trigger structural skin scaffolding.",
    bullets: ["Instant physical vectors elevation", "Absorbable micro-structural fiber bonds", "Ongoing continuous collagen induction"]
  },
  {
    id: "hydrafacial",
    icon: "air",
    title: "Hydrafacial",
    description: "Luxury multi-step vacuum-assisted epidermal deep-cleanse, acid peel correction, sebum extraction, and pure antioxidant serum locking.",
    bullets: ["Sucks out persistent blackheads", "Intense hydration quench protection", "Incredible skin luminosity in minutes"]
  },
  {
    id: "vit-c-facial",
    icon: "wb_sunny",
    title: "Vitamin C facial",
    description: "Antioxidant dermal conditioning designed to eliminate free radicals, diminish pigmentation, and deliver an intense glowing luster.",
    bullets: ["Soothes cellular sun damage lines", "Blocks sudden melanin overproduction", "Locks in natural bright cell health"]
  },
  {
    id: "brightening-drips",
    icon: "vaccines",
    title: "Skin brightening drips",
    description: "Targeted intravenous hydration rich in Glutathione and high-dose Vitamin C to cleanse toxins and brighten complexions globally.",
    bullets: ["Direct cellular system infusion", "Fades persistent hyperpigmentation", "Aesthetic and hepatic cellular detox"]
  },
  {
    id: "vampire-facial",
    icon: "blur_on",
    title: "Vampire facial",
    description: "Precision medical micro-needling coupled directly with platelet-derived growth signaling to refine deep texture, scars, and pores.",
    bullets: ["Collapses old acne scars", "Refines stretched dermal pores", "Rebuilds elastic skin tension values"]
  },
  {
    id: "bb-glow",
    icon: "palette",
    title: "BB Glow facial",
    description: "Innovative micro-infusion of safe, tinted botanical ampoules to neutralize redness, dark circles, and establish a long-term makeup glow.",
    bullets: ["Locks in soft semi-permanent tinting", "Provides continuous deep face skin blending", "Deeply hydrates the epidermal layer"]
  },
  {
    id: "party-peel",
    icon: "celebration",
    title: "Party Peel facial",
    description: "Lightweight, express chemical peel customized to lift away dull, dry skin cells and instantly deliver perfect brightness for any big event.",
    bullets: ["Absolutely no post-peel dryness downtime", "Flawless smooth canvas for makeup", "Noticeable luminous glow in one hour"]
  },
  {
    id: "lip-lightening",
    icon: "face",
    title: "Lip lightening Treatment",
    description: "Laser correction or soft chemical pinking peel targeting dark cellular melanin deposits to reveal soft, rosy hydrated lip layers.",
    bullets: ["Clears smoking or genetics darkening", "Restores rich pink organic lip borders", "Includes custom moisture-lock hydrators"]
  },
  {
    id: "dark-circle",
    icon: "remove_red_eye",
    title: "Dark Circle Treatment",
    description: "Advanced cosmetic therapy fusing soothing hydration peptides and target circulation lasers to brighten lower eye bags.",
    bullets: ["Boosts capillary oxygen pathways", "Significantly fades under-eye shadowing", "Replumps tired and sunken eye frames"]
  },
  {
    id: "derma-planning",
    icon: "cleaning_services",
    title: "Derma planning",
    description: "Expert manual exfoliating procedure to shave away dead epidermal builds and soft vellus peach fuzz hairs perfectly.",
    bullets: ["Dramatically boosts skin cream absorption", "Leaves skin velvety smooth instantly", "Ensures zero clumpy patchiness in makeup"]
  },
  {
    id: "mole-warts",
    icon: "lens",
    title: "Mole & Warts Removal",
    description: "Advanced clinical radiofrequency ablation to quickly and painlessly clear unsightly warts, mole tags, and epidermal growths.",
    bullets: ["Completed in minutes with minor healing", "Zero stitches or painful scalpels needed", "Includes antiseptic medical cover packs"]
  },
  {
    id: "stretch-marks",
    icon: "stacked_line_chart",
    title: "Stretch mark Removal",
    description: "High-grade fractional skin-needling and dynamic resurfacing focused on restoring torn collagen fibers in old stretch lines.",
    bullets: ["Smooths physical skin indent textures", "Restores original elastic skin colors", "Highly effective for postpartum stretch marks"]
  },
  {
    id: "laser-hair-removal",
    icon: "flash_on",
    title: "Laser Hair Removal",
    description: "Painless high-frequency diode laser technology focused on destroying hair growth follicles with maximum cooling tip defense.",
    bullets: ["Permanent hair reduction across sessions", "Frictionless sapphire cooling tip tech", "Perfect for all aesthetic body areas"]
  },
  {
    id: "facial-hair-laser",
    icon: "person",
    title: "Facial Hair Removal",
    description: "Precision diode laser sessions specifically calibrated for feminine facial zones (upper lip, chin, sideburns) for flawless smoothness.",
    bullets: ["Extremely gentle on facial skin", "Halts irritating hormonal hair growth", "Smooth, touchable face without razor burn"]
  },
  {
    id: "full-body-hair",
    icon: "accessibility_new",
    title: "Full Body Hair Removal",
    description: "The ultimate aesthetic grooming experience covering all body sections with clinical-grade laser systems for total, uniform silkiness.",
    bullets: ["Saves countless hours of painful waxing", "Improves overall skin hygiene feel", "Includes post-laser cooling moisturizers"]
  },
  {
    id: "double-chin-removal",
    icon: "self_improvement",
    title: "Double chin Removal",
    description: "Non-surgical therapeutic lipolysis or high-intensity therapeutic waves dedicated to dissolving localized submental fat pads.",
    bullets: ["Tightens loose jaw and chin outlines", "Melts down heavy genetic chin double fold", "Highly precise localized dermal lift"]
  },
  {
    id: "hair-fall-treatment",
    icon: "grain",
    title: "Hair fall Treatment",
    description: "Multi-layered medical scalp therapy utilizing growth factors, vitamins, and clinical peptide serums to halt active thinning.",
    bullets: ["Reinforces hair root anchoring strength", "Stimulates sleeping follicles back to life", "Thickens thin hair shafts dramatically"]
  },
  {
    id: "melasma",
    icon: "filter_tilt_shift",
    title: "Melasma Treatment",
    description: "Multi-pronged depigmentation protocol combining clinical melasma chemical peels, barrier healers, and cooling spot laser lasers.",
    bullets: ["Breaks down concentrated cheek melasma", "Builds up dermal skin barrier resilience", "Reduces risk of sudden dark cell rebound"]
  },
  {
    id: "chemical-peels",
    icon: "dry_cleaning",
    title: "Chemical Peels",
    description: "Clinically customized chemical peels designed to gently lift away damaged, hyperpigmented surfaces and reveal fresh, radiant skin.",
    bullets: ["Fades persistent spots & acne marks", "Controls overactive oily sebaceous glands", "Triggers fresh, hydrated baby-skin renewal"]
  },
  {
    id: "acne-treatment",
    icon: "radio_button_checked",
    title: "Acne Treatment",
    description: "Professional medical-grade acne program targeting active pustules, regulating oil production, and healing post-acne marks.",
    bullets: ["Soothes red, irritated acne flareups", "Purges deep clogged follicular sebum", "Minimizes risks of permanent indent scars"]
  }
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"dental" | "cosmetics">("dental");
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const services = activeTab === "dental" ? dentalServices : cosmeticsServices;

  // React to external tab switching (from Navbar dropdown links)
  useEffect(() => {
    const handleSetCategory = (e: Event) => {
      const customEvent = e as CustomEvent<"dental" | "cosmetics">;
      if (customEvent.detail === "dental" || customEvent.detail === "cosmetics") {
        setActiveTab(customEvent.detail);
        setActiveCard(null); // Reset active cards on tab switch
        
        // Stagger in the new cards beautifully
        setTimeout(() => {
          const cards = cardsRef.current?.querySelectorAll(".service-card-item");
          if (cards && cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 30, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power2.out" }
            );
          }
        }, 50);
      }
    };

    window.addEventListener("set-service-category", handleSetCategory);
    return () => window.removeEventListener("set-service-category", handleSetCategory);
  }, []);

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
  }, [activeTab]);

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

  const handleTabChange = (tab: "dental" | "cosmetics") => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    setActiveCard(null);

    // Fade and stagger animate cards of new tab
    setTimeout(() => {
      const cards = cardsRef.current?.querySelectorAll(".service-card-item");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }
        );
      }
    }, 50);
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
            Our luxury catalog synthesizes biological health standards with high-fashion cosmetic facial and dental makeovers.
          </p>
        </div>

        {/* Tab Switcher Selector */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md border border-primary-mint/10 p-1.5 rounded-full flex gap-1 shadow-sm">
            <button
              onClick={() => handleTabChange("dental")}
              className={`px-8 py-3 rounded-full font-dm text-[11px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "dental"
                  ? "bg-primary-mint text-white shadow-md shadow-primary-mint/15 scale-102"
                  : "text-[#4A5E54] hover:text-primary-mint hover:bg-primary-mint/5"
              }`}
            >
              Dental Care
            </button>
            <button
              onClick={() => handleTabChange("cosmetics")}
              className={`px-8 py-3 rounded-full font-dm text-[11px] md:text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "cosmetics"
                  ? "bg-primary-mint text-white shadow-md shadow-primary-mint/15 scale-102"
                  : "text-[#4A5E54] hover:text-primary-mint hover:bg-primary-mint/5"
              }`}
            >
              Aesthetic Cosmetics
            </button>
          </div>
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
