import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TestimonialItem } from "../types";

gsap.registerPlugin(ScrollTrigger);

const INITIAL_ROW1: TestimonialItem[] = [
  {
    id: "quote-1",
    quote: "Best at his work, staff is also well at service!",
    author: "smily mahajan",
    role: "Verified Google Review • 5.0 Rating",
    avatarBg: "bg-teal-700"
  },
  {
    id: "quote-2",
    quote: "Highly recommend this place for anyone looking for quality dental care!",
    author: "pranav gupta",
    role: "Verified Google Review • 5.0 Rating",
    avatarBg: "bg-emerald-800"
  },
  {
    id: "quote-3",
    quote: "Very reasonable costs for high-class dental implants and single-visit root canal treatments. Dr. Gagandeep S Gauba is excellent.",
    author: "Gurdip Singh",
    role: "Verified Patient • Implant Treatment",
    avatarBg: "bg-amber-800"
  }
];

const INITIAL_ROW2: TestimonialItem[] = [
  {
    id: "quote-4",
    quote: "The clinic environment was spotless, and the equipment looked brand new.",
    author: "Gurdip Singh",
    role: "Verified Google Review",
    avatarBg: "bg-blue-900"
  },
  {
    id: "quote-5",
    quote: "Dr Gagandeep S Gauba is very genuine and professional. I can say he is the best dentist in Jalandhar. He explains the root cause of the problem and gives the best advice.",
    author: "Harpreet Singh",
    role: "Verified Patient • Jalandhar",
    avatarBg: "bg-indigo-900"
  },
  {
    id: "quote-6",
    quote: "Got my crown and pain-free cavity restorations. Superb hand skill, extremely courteous staff, and outstanding clean clinic.",
    author: "Amandeep Kaur",
    role: "Verified Patient • Aesthetic crown",
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
          <p className="font-sans text-sage text-xs md:text-sm max-w-md mx-auto">
            Discover genuine, heartfelt stories of wellness and painless smile design from our verified patients in Jalandhar.
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

        {/* Google Reviews CTA & Local Review Portal Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 relative z-20">
          <a
            href="https://share.google/uC0l8cNq78xL2o3Ot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-charcoal hover:bg-black text-white font-dm text-[11px] uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer decoration-none"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>See More Reviews on Google</span>
          </a>

          <a
            href="https://share.google/uC0l8cNq78xL2o3Ot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 border border-primary-mint/35 bg-white text-primary-mint hover:bg-primary-mint/5 font-dm text-[11px] uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer decoration-none"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">rate_review</span>
            <span>Write Guest Review</span>
          </a>
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
