import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InstagramPost } from "../types";

gsap.registerPlugin(ScrollTrigger);

export default function Instagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const posts: InstagramPost[] = [
    {
      id: "ig-1",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=400&auto=format&fit=crop",
      alt: "Pristine clinical rooms and reception"
    },
    {
      id: "ig-2",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&auto=format&fit=crop",
      alt: "Pristine technical precision tools"
    },
    {
      id: "ig-3",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=400&auto=format&fit=crop",
      alt: "Beautiful sparkling alignment results"
    },
    {
      id: "ig-4",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop",
      alt: "Boutique clinic reads and reception"
    },
    {
      id: "ig-5",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=400&auto=format&fit=crop",
      alt: "Botanical wellness components and spa feel"
    },
    {
      id: "ig-6",
      image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=400&auto=format&fit=crop",
      alt: "Cosmetic facial consulting suites"
    }
  ];

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      const items = trackRef.current?.querySelectorAll(".ig-item");
      if (items && items.length > 0) {
        gsap.set(items, { scale: 1, opacity: 1 });
      }
      return;
    }

    const items = trackRef.current?.querySelectorAll(".ig-item");
    if (items && items.length > 0) {
      ScrollTrigger.batch(items, {
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              stagger: 0.1,
              duration: 0.8,
              ease: "back.out(1.5)",
              overwrite: "auto"
            }
          );
        },
        once: true
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-16 bg-surface-mint border-t border-primary-mint/10 relative overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto space-y-10 px-6 md:px-12 relative z-10">
        
        {/* Instagram Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <span className="font-dm text-[9.5px] font-bold tracking-[0.25em] text-primary-mint uppercase">
              JOURNAL
            </span>
            <h3 className="font-cormorant text-2xl md:text-3xl font-light text-charcoal">
              Captured Moments
            </h3>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            referrerPolicy="no-referrer"
            className="font-dm text-[11px] uppercase tracking-widest font-semibold text-primary-mint hover:text-deep-green flex items-center gap-1.5 transition-colors"
          >
            Follow @DrSkyDentistry
            <span className="material-symbols-outlined text-sm font-semibold select-none">
              arrow_outward
            </span>
          </a>
        </div>

        {/* Staggered Post Layout track */}
        <div
          ref={trackRef}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-2"
        >
          {posts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="ig-item relative block aspect-square rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 opacity-0 bg-teal-950/15"
            >
              {/* Actual Image */}
              <img
                alt={post.alt}
                className="w-full h-full object-cover object-center group-hover:scale-112 transition-transform duration-700 select-none animate-gpu"
                referrerPolicy="no-referrer"
                src={post.image}
              />

              {/* Mint hover overlay with central vector symbol */}
              <div className="absolute inset-0 bg-primary-mint/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="material-symbols-outlined text-white text-xl select-none">
                    camera_indoor
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
