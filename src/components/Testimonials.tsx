import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialItem } from "../types";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_ROW1: TestimonialItem[] = [
  {
    id: "quote-1",
    quote: "It was way smooth and comfortable didn't feel the pain at all. It was really a good experience, I will definitely recommend them to everyone.",
    author: "Modita Vora",
    role: "Verified Patient • Wisdom Tooth Extraction",
    avatarBg: "bg-teal-700"
  },
  {
    id: "quote-2",
    quote: "I had been looking for a good dentist until I found Dr Aashu. She was excellent, I am satisfied with the treatment done in a single visit.",
    author: "Anip",
    role: "Verified Patient • Restorative Dentist",
    avatarBg: "bg-emerald-800"
  },
  {
    id: "quote-3",
    quote: "I had severe pain in my tooth, got my root canal and crown from Dr Aashu, very much satisfied with treatment and absolutely painless.",
    author: "Tarun Thakran",
    role: "Verified Patient • Endodontic Treatment",
    avatarBg: "bg-amber-800"
  }
];

const INITIAL_ROW2: TestimonialItem[] = [
  {
    id: "quote-4",
    quote: "Dr Aashu Thakran is very genuine and professional. I can say she is the best dentist in old Gurgaon. She explains the root cause of the problem and gives the best advice in each case.",
    author: "Mahir",
    role: "Verified Patient • Old Gurgaon",
    avatarBg: "bg-blue-900"
  },
  {
    id: "quote-5",
    quote: "Excellent smile designing with zirconia crowns. The root canal procedure was exceptionally quick and completely comfortable.",
    author: "Pooja S.",
    role: "Verified Patient • Zirconia Smile design",
    avatarBg: "bg-indigo-900"
  },
  {
    id: "quote-6",
    quote: "Very reasonable costs for high-class dental implants and ceramic rehabilitation. Dr. Aashu and clinical team are so reassuring and warm.",
    author: "Amit K.",
    role: "Verified Patient • Restorative Implants",
    avatarBg: "bg-cyan-900"
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quotesIconRef = useRef<HTMLSpanElement>(null);

  const [row1, setRow1] = useState<TestimonialItem[]>(INITIAL_ROW1);
  const [row2, setRow2] = useState<TestimonialItem[]>(INITIAL_ROW2);

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("bd_custom_reviews");
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as TestimonialItem[];
          const c1 = parsed.filter((_, idx) => idx % 2 === 0);
          const c2 = parsed.filter((_, idx) => idx % 2 !== 0);
          setRow1([...c1, ...INITIAL_ROW1]);
          setRow2([...c2, ...INITIAL_ROW2]);
        } catch (err) {
          console.error("Failed to parse custom reviews", err);
        }
      }
    };

    handleSync();
    window.addEventListener("new-review-submitted", handleSync);
    return () => window.removeEventListener("new-review-submitted", handleSync);
  }, []);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      if (quotesIconRef.current) gsap.set(quotesIconRef.current, { scale: 1, rotation: 0, opacity: 0.04 });
      const stars = containerRef.current?.querySelectorAll(".testimonial-star");
      if (stars && stars.length > 0) gsap.set(stars, { scale: 1, opacity: 1 });
      return;
    }

    // Slide-in large quote ornament and rotate
    gsap.fromTo(
      quotesIconRef.current,
      { scale: 0.6, rotation: -45, opacity: 0 },
      {
        scale: 1,
        rotation: 0,
        opacity: 0.04,
        duration: 1.4,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true
        }
      }
    );

    // Staggered star scaling animations inside cards
    const stars = containerRef.current?.querySelectorAll(".testimonial-star");
    if (stars && stars.length > 0) {
      ScrollTrigger.batch(stars, {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, stagger: 0.05, duration: 0.4, ease: "back.out(2)" }
          );
        },
        once: true
      });
    }
  }, []);

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="py-24 md:py-36 bg-surface-mint px-6 md:px-12 relative overflow-hidden"
    >
      {/* Absolute Large Aesthetic quotes mark */}
      <span
        ref={quotesIconRef}
        className="material-symbols-outlined text-[360px] md:text-[500px] text-primary-mint/5 absolute left-10 top-[-50px] pointer-events-none select-none"
        style={{ opacity: 0 }}
      >
        format_quote
      </span>

      <div className="w-full max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            VOICES OF CONFIDENCE
          </span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
            Curated Testimonials
          </h2>
          <div className="w-16 h-[1.5px] bg-primary-mint mx-auto" />
          <p className="font-sans text-sage text-xs md:text-sm max-w-sm mx-auto">
            Discover the genuine, heartfelt stories of wellness and painless smile design from our verified patients in Gurgaon.
          </p>
        </div>

        {/* Double row scrolling track container */}
        <div className="space-y-10 pt-6 overflow-hidden relative">
          
          {/* Row 1 Track (Scroll Left) */}
          <div className="flex w-full overflow-hidden select-none">
            <div className="flex gap-8 whitespace-nowrap animate-scroll-left hover:[animation-play-state:paused] cursor-grab">
              
              {/* Combine twice for infinite scroll alignment */}
              {[...row1, ...row1].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-block w-80 md:w-96 whitespace-normal bg-white border border-primary-mint/10 rounded-2xl p-8 shadow-md hover:shadow-xl hover:border-primary-mint/20 hover:-translate-y-1.5 transition-transform duration-300 pointer-events-auto select-none"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-base testimonial-star select-none">
                          star
                        </span>
                      ))}
                    </div>
                    <p className="font-cormorant text-base text-charcoal leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-dm font-semibold text-xs`}>
                        {item.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-dm text-xs font-semibold text-charcoal block">
                          {item.author}
                        </span>
                        <span className="font-dm text-[10px] text-sage block tracking-wide font-normal">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Row 2 Track (Scroll Right) */}
          <div className="flex w-full overflow-hidden select-none">
            <div className="flex gap-8 whitespace-nowrap animate-scroll-right hover:[animation-play-state:paused] cursor-grab">
              
              {/* Combine twice for infinite scroll alignment */}
              {[...row2, ...row2].map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-block w-80 md:w-96 whitespace-normal bg-white border border-primary-mint/10 rounded-2xl p-8 shadow-md hover:shadow-xl hover:border-primary-mint/20 hover:-translate-y-1.5 transition-transform duration-300 pointer-events-auto select-none"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-base testimonial-star select-none">
                          star
                        </span>
                      ))}
                    </div>
                    <p className="font-cormorant text-base text-charcoal leading-relaxed italic">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className={`w-8 h-8 rounded-full ${item.avatarBg} text-white flex items-center justify-center font-dm font-semibold text-xs`}>
                        {item.author.charAt(0)}
                      </div>
                      <div>
                        <span className="font-dm text-xs font-semibold text-charcoal block">
                          {item.author}
                        </span>
                        <span className="font-dm text-[10px] text-sage block tracking-wide font-normal">
                          {item.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>

      {/* Styled Infinite CSS keyframe animation for carousel tracks */}
      <style>{`
        .animate-scroll-left {
          animation: scrollLeftItem 35s linear infinite;
        }
        .animate-scroll-right {
          animation: scrollRightItem 35s linear infinite;
        }
        @keyframes scrollLeftItem {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRightItem {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
