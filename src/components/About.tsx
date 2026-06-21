import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resolveAsset } from "../utils/resolveAsset";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      gsap.set(imageContainerRef.current, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
      gsap.set(imgRef.current, { scale: 1 });
      gsap.set(badgeRef.current, { scale: 1, rotation: 0 });
      const elements = textColRef.current?.children;
      if (elements) {
        gsap.set(elements, { opacity: 1, x: 0 });
      }
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
    });

    // Curtain reveal from bottom: clip-path inset(0 0 100% 0) -> inset(0 0 0% 0)
    timeline.fromTo(
      imageContainerRef.current,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power3.inOut" }
    );

    // Dr. founders slight scale inside image on load
    timeline.fromTo(
      imgRef.current,
      { scale: 1.15 },
      { scale: 1.0, duration: 1.4, ease: "power2.out" },
      "<"
    );

    // Gold Est. 2015 badge scale & rotation pop
    timeline.fromTo(
      badgeRef.current,
      { scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4"
    );

    // Right content element translations
    const elements = textColRef.current?.children;
    if (elements && elements.length > 0) {
      timeline.fromTo(
        elements,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.8, ease: "power3.out" },
        "-=0.7"
      );
    }

    // Parallax scrolling on background botanical leaf icon
    gsap.to(leafRef.current, {
      yPercent: -45,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Magnetic effect for Est 2015 badge
    const badge = badgeRef.current;
    if (badge) {
      const bx = gsap.quickTo(badge, "x", { duration: 0.3, ease: "power2.out" });
      const by = gsap.quickTo(badge, "y", { duration: 0.3, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = badge.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        if (dist < 80) {
          bx((e.clientX - cx) * 0.22);
          by((e.clientY - cy) * 0.22);
        } else {
          bx(0);
          by(0);
        }
      };

      const onMouseLeave = () => {
        bx(0);
        by(0);
      };

      window.addEventListener("mousemove", onMouseMove);
      badge.addEventListener("mouseleave", onMouseLeave);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        badge.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="py-24 md:py-36 bg-surface-mint px-6 md:px-12 relative overflow-hidden"
    >
      {/* Parallax Botanical background ornament */}
      <span
        ref={leafRef}
        className="material-symbols-outlined text-[320px] md:text-[450px] text-primary-mint/5 absolute right-[-40px] top-[10%] pointer-events-none select-none"
        style={{ fontVariationSettings: "'FILL' 0" }}
      >
        spa
      </span>

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24 relative z-10">
        
        {/* Left Side: Photo with Curtain Clip Reveal */}
        <div className="w-full lg:w-1/2 relative flex justify-center">
          <div className="absolute -inset-10 bg-primary-mint/5 rounded-full blur-3xl pointer-events-none" />
          
          <div
            ref={imageContainerRef}
            className="relative z-10 w-full aspect-[4/5] max-w-[480px] rounded-2xl overflow-hidden shadow-2xl bg-teal-950/15"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
          >
            <img
              ref={imgRef}
              alt="Dr. Gagandeep S Gauba"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700 select-none animate-gpu"
              referrerPolicy="no-referrer"
              src={resolveAsset("/88899.jpg")}
            />
          </div>

          {/* Gold Badge */}
          <div
            ref={badgeRef}
            className="absolute -bottom-6 -right-2 bg-gradient-to-br from-gold to-gold-light text-charcoal font-dm font-bold text-[11px] uppercase tracking-widest px-8 py-4 rounded-full shadow-xl z-20 select-none"
          >
            ESTD. 2012
          </div>
        </div>

        {/* Right Side: Philosophy Text Content */}
        <div ref={textColRef} className="w-full lg:w-1/2 space-y-6 text-left">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
            Excellence in Care. Trust in Results.
          </h2>
          
          <p className="font-sans text-base md:text-lg text-[#3D4943] leading-relaxed">
            Led by Dr. Gagandeep S Gauba, DR. SKY DENTISTRY is Jalandhar's premier dental clinic dedicated to providing team-based, comprehensive, and painless oral care. We provide advanced dental implants, smile design makeovers, single-visit root canals, restorative dentistry, premium ceramic crowns, orthodontic braces, and specialized wellness treatments in a advanced and warm medical environment.
          </p>
          
          <p className="font-accent text-xl italic text-deep-green leading-relaxed border-l-2 border-primary-mint pl-6 py-2">
            "Your oral health and complete peace of mind are our ultimate commitment. We don't just treat teeth; we preserve the natural beauty of your smile with precision and care."
          </p>

          <div className="pt-4 block">
            <button
              onClick={() => {
                document.getElementById("clinicians")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-3 font-dm text-[11px] uppercase tracking-widest font-semibold text-primary-mint hover:text-deep-green transition-colors focus:outline-none"
            >
              Read Our Full Story
              <span className="material-symbols-outlined text-lg font-light transition-transform duration-300 group-hover:translate-x-2">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
