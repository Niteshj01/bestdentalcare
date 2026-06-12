import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore
import heroClinicImg from "../assets/images/regenerated_image_1781202656255.jpg";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  startAnimation: boolean;
}

export default function Hero({ startAnimation }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const italicLineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const primaryBtnRef = useRef<HTMLButtonElement>(null);
  const secondaryBtnRef = useRef<HTMLButtonElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const visualContainerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLImageElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const toothPatternRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startAnimation) return;

    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      // Set properties immediately if reduced motion is requested
      gsap.set(containerRef.current, { backgroundColor: "rgba(232, 255, 239, 1)", opacity: 1 });
      gsap.set(badgeRef.current, { opacity: 1, y: 0 });
      gsap.set(headlineRef.current, { opacity: 1 });
      gsap.set(italicLineRef.current, { opacity: 1, y: 0 });
      gsap.set(descRef.current, { opacity: 1, y: 0 });
      gsap.set(primaryBtnRef.current, { opacity: 1, scale: 1 });
      gsap.set(secondaryBtnRef.current, { opacity: 1, scale: 1 });
      gsap.set(trustRef.current, { opacity: 1, y: 0 });
      gsap.set(visualContainerRef.current, { opacity: 1, scale: 1, rotation: 0 });
      gsap.set(card1Ref.current, { opacity: 1, scale: 1 });
      gsap.set(card2Ref.current, { opacity: 1, scale: 1 });
      gsap.set(toothPatternRef.current, { opacity: 0.05 });
      return;
    }

    // Split headline words to animate word by word
    const hEl = headlineRef.current;
    if (hEl) {
      const words = hEl.textContent?.trim().split(" ") || [];
      hEl.innerHTML = words
        .map(
          (word) =>
            `<span class="inline-block overflow-hidden mr-3"><span class="inline-block transform translate-y-20 opacity-0 font-cormorant">${word}</span></span>`
        )
        .join("");
    }

    const wordSpans = headlineRef.current?.querySelectorAll("span > span");

    const mt = gsap.timeline();

    // t=0.0s Background gradient breathes in
    mt.fromTo(
      containerRef.current,
      { backgroundColor: "rgba(232, 255, 239, 0)", opacity: 0 },
      { backgroundColor: "rgba(232, 255, 239, 1)", opacity: 1, duration: 1.0, ease: "power1.inOut" }
    );

    // t=0.1s Tooth outline illustration drifts in
    mt.fromTo(
      toothPatternRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 0.05, duration: 1.5, ease: "power2.out" },
      "0.1"
    );

    // t=0.4s Hero pill badge slides down
    mt.fromTo(
      badgeRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "0.4"
    );

    // t=0.6s Words fly up
    if (wordSpans && wordSpans.length > 0) {
      mt.to(
        wordSpans,
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.8,
          ease: "power4.out",
        },
        "0.6"
      );
    }

    // t=1.1s Italic line fades in
    mt.fromTo(
      italicLineRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "1.1"
    );

    // t=1.3s Description paragraph fades in
    mt.fromTo(
      descRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "1.3"
    );

    // t=1.5s Primary CTA scales in
    mt.fromTo(
      primaryBtnRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "1.5"
    );

    // t=1.65s Secondary CTA scales in
    mt.fromTo(
      secondaryBtnRef.current,
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      "1.65"
    );

    // t=1.8s Doctor Trust Row slides up
    mt.fromTo(
      trustRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "1.8"
    );

    // t=2.0s Grand entrance for visual container
    mt.fromTo(
      visualContainerRef.current,
      { scale: 0.75, rotation: -8, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" },
      "2.0"
    );

    // t=2.3s Floating mini cards populate in staggered fashion
    mt.fromTo(
      [card1Ref.current, card2Ref.current],
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.2, duration: 0.6, ease: "back.out(1.9)" },
      "2.3"
    );

    // Set up infinite floating animations once entering timeline ends
    mt.eventCallback("onComplete", () => {
      // 1. Right Blob bounces up and down slowly
      gsap.to(visualContainerRef.current, {
        y: -15,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 2. Floating mini card 1 floats slightly offsets
      gsap.to(card1Ref.current, {
        y: -8,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 3. Floating mini card 2 floats with offset
      gsap.to(card2Ref.current, {
        y: -6,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // 4. Background tooth pattern drift
      gsap.to(toothPatternRef.current, {
        x: 15,
        duration: 12,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    // Parallax on Scroll triggered elements
    // Parallax Background Tooth Scroll
    gsap.to(toothPatternRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Parallax Blob image scroll
    gsap.to(visualRef.current, {
      yPercent: 12,
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });

    // Magnetic effect configuration for CTAs
    const bounceElements = [primaryBtnRef.current, secondaryBtnRef.current];
    const cleanups: (() => void)[] = [];

    bounceElements.forEach((btn) => {
      if (!btn) return;
      const xTo = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power2.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power2.out" });

      const onMouseMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 80) {
          xTo((e.clientX - centerX) * 0.25);
          yTo((e.clientY - centerY) * 0.25);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener("mousemove", onMouseMove);
      btn.addEventListener("mouseleave", onMouseLeave);

      cleanups.push(() => {
        window.removeEventListener("mousemove", onMouseMove);
        btn.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => {
      cleanups.forEach((c) => c());
    };
  }, [startAnimation]);

  const scrollToConsultation = () => {
    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPhilosophy = () => {
    document.getElementById("philosophy")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      id="hero-section"
      ref={containerRef}
      className="relative min-h-screen py-24 md:py-36 px-6 md:px-12 bg-surface-mint flex items-center overflow-hidden"
    >
      {/* Dynamic Background Tooth Pattern */}
      <div
        ref={toothPatternRef}
        className="absolute inset-0 tooth-pattern pointer-events-none"
        style={{ opacity: 0 }}
      />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 pt-10">
        
        {/* Left Editorial Text block */}
        <div className="lg:col-span-6 space-y-8 text-left">
          {/* Aesthetic Badge Pill */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur px-4 py-1.5 rounded-full border border-primary-mint/10 opacity-0"
          >
            <span className="w-2 h-2 rounded-full bg-primary-mint relative">
              <span className="absolute inset-0 bg-primary-mint rounded-full animate-ping opacity-75" />
            </span>
            <span className="font-dm text-[11px] font-semibold uppercase tracking-widest text-deep-green">
              PREMIER CLINIC • SECTOR 14 HISSAR
            </span>
          </div>

          {/* Main Title Heading */}
          <div className="space-y-4">
            <h1
              ref={headlineRef}
              className="text-5xl md:text-7xl font-cormorant font-light text-charcoal tracking-tight leading-[1.05]"
            >
              Expertise. Compassion. Precision.
            </h1>
            <div
              ref={italicLineRef}
              className="text-lg md:text-2xl font-accent italic text-sage opacity-0"
            >
              Advanced dental laminates, oral rehabilitation &amp; sedation care
            </div>
          </div>

          {/* Description Body Paragraph */}
          <p
            ref={descRef}
            className="text-base md:text-lg text-[#3D4943] max-w-lg leading-relaxed font-sans opacity-0"
          >
            Led by Dr. Sanya Makkar Alawadhi, BEST Dental Care is dedicated to providing top-notch oral health solutions. We deliver a premier patient-centric dental experience that combines advanced technology with comfortable, reliable care.
          </p>

          {/* Button CTA Group */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              ref={primaryBtnRef}
              id="hero-cta-primary"
              onClick={scrollToConsultation}
              className="bg-primary-mint hover:bg-deep-green text-white font-dm text-[12px] uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-lg shadow-primary-mint/20 hover:shadow-primary-mint/30 transition-all duration-300 opacity-0 relative overflow-hidden group"
            >
              <span className="relative z-10">Explore Services</span>
              <span className="absolute inset-0 bg-white/10 origin-right scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:origin-left" />
            </button>
            <button
              ref={secondaryBtnRef}
              id="hero-cta-secondary"
              onClick={scrollToPhilosophy}
              className="border border-deep-green/30 hover:border-primary-mint text-deep-green hover:text-primary-mint font-dm text-[12px] uppercase tracking-widest font-semibold px-8 py-4 rounded-full hover:bg-primary-mint/5 transition-all duration-300 opacity-0"
            >
              Our Story
            </button>
          </div>

          {/* Star Trust Ratings */}
          <div
            ref={trustRef}
            className="flex items-center gap-6 pt-4 border-t border-primary-mint/10 opacity-0"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-gold fill-gold"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-xs md:text-sm font-dm uppercase tracking-wider text-deep-green font-medium">
              ★ 4.9 on Google Reviews • 1,200+ Satisfied Patients
            </p>
          </div>
        </div>

        {/* Right Fluid Organic Frame block */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div
            ref={visualContainerRef}
            className="relative w-full max-w-[500px] aspect-[4/5] opacity-0"
          >
            {/* Morphing Blob Frame wrapping the premium clinic visual */}
            <div
              className="w-full h-full overflow-hidden shadow-2xl border border-white/20 transition-all duration-1000 bg-teal-900/10"
              style={{
                borderRadius: "44% 56% 51% 49% / 57% 41% 59% 43%",
                animation: "morphBlob 10s ease-in-out infinite",
              }}
            >
              <img
                ref={visualRef}
                alt="Editorial clinic suite"
                className="w-full h-[115%] object-cover object-center translate-y-[-5%] rendering-crisp"
                style={{ imageRendering: "-webkit-optimize-contrast" }}
                referrerPolicy="no-referrer"
                src={heroClinicImg}
              />
            </div>

            {/* Floating Glass mini-card 1: Upper Left */}
            <div
              ref={card1Ref}
              className="absolute -top-6 -left-6 glass-panel px-6 py-4 rounded-2xl border border-white/40 shadow-xl max-w-[210px] space-y-2 select-none"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-mint text-xl font-light">
                  auto_awesome
                </span>
                <span className="font-dm text-[9.5px] font-bold tracking-widest text-[#00afb9] uppercase">
                  Aesthetic Excellence
                </span>
              </div>
              <p className="font-cormorant text-base text-charcoal leading-tight">
                99.8% Patient Confidence Rating
              </p>
            </div>

            {/* Floating Glass mini-card 2: Bottom Right */}
            <div
              ref={card2Ref}
              className="absolute -bottom-6 -right-6 glass-panel px-6 py-4 rounded-2xl border border-white/40 shadow-xl max-w-[200px] space-y-2 select-none"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DFBA5C] text-xl font-light">
                  verified
                </span>
                <span className="font-dm text-[9px] font-bold tracking-widest text-gold uppercase">
                  Highly Certified Care
                </span>
              </div>
              <p className="font-cormorant text-sm text-[rgb(7,71,84)]">
                Expertise, Compassion &amp; Advanced Technology
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Decorative styling for morph blob in document */}
      <style>{`
        @keyframes morphBlob {
          0% { border-radius: 44% 56% 51% 49% / 57% 41% 59% 43%; }
          50% { border-radius: 54% 46% 61% 39% / 47% 53% 47% 53%; }
          100% { border-radius: 44% 56% 51% 49% / 57% 41% 59% 43%; }
        }
      `}</style>
    </header>
  );
}
