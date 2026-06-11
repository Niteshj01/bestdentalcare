import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      onComplete();
      if (containerRef.current) containerRef.current.style.display = "none";
      return;
    }

    const textEl = textRef.current;
    if (!textEl) return;

    // Split text into individual letters wrapped in spans for staggered animation
    const text = textEl.textContent || "BEST DENTAL CARE";
    textEl.innerHTML = text
      .split("")
      .map((char) => `<span class="inline-block transition-transform opacity-0 translate-y-[30px] font-cormorant text-2xl md:text-4xl text-white tracking-[0.2em] font-light">${char === " " ? "&nbsp;" : char}</span>`)
      .join("");

    const letters = textEl.querySelectorAll("span");

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Animate letters in staggered fashion
    tl.to(letters, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.8,
      ease: "power2.out",
    });

    // Grow scaleX progress line simultaneously
    tl.to(
      lineRef.current,
      {
        scaleX: 1,
        duration: 1.8,
        ease: "power1.inOut",
      },
      "-=0.6"
    );

    // Fade out text and progress bar before split
    tl.to([textEl, lineRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: "power2.inOut",
    }, "-=0.2");

    // Split the overlay
    tl.to(
      topHalfRef.current,
      {
        yPercent: -100,
        duration: 0.7,
        ease: "power3.inOut",
      },
      "-=0.1"
    );

    tl.to(
      bottomHalfRef.current,
      {
        yPercent: 100,
        duration: 0.7,
        ease: "power3.inOut",
      },
      "<"
    );

    // Hide entire preloader element
    tl.to(containerRef.current, {
      display: "none",
      duration: 0,
    });
  }, [onComplete]);

  return (
    <div
      id="custom-preloader"
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex flex-col justify-between overflow-hidden pointer-events-none"
    >
      {/* Top half split panel */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-[51vh] bg-primary-mint pointer-events-auto shadow-lg shadow-black/5"
      />

      {/* Bottom half split panel */}
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-[51vh] bg-primary-mint pointer-events-auto shadow-lg shadow-black/5"
      />

      {/* Center text and progress bar */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1
          ref={textRef}
          className="font-cormorant font-light text-white text-center uppercase mb-4"
        >
          BEST DENTAL CARE
        </h1>
        <div className="w-56 md:w-72 h-[1.5px] bg-white/20 rounded-full overflow-hidden">
          <div
            ref={lineRef}
            className="w-full h-full bg-white origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
