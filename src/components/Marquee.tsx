import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;

    // Create a seamless loop timeline for the sliding track
    const loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 25,
      repeat: -1,
    });

    // Slow down on overall PAGE hover (body/window mouseover/leave as specified)
    const handlePageHover = () => {
      gsap.to(loop, {
        timeScale: 25 / 42, // Reducer ratio: makes it take 42s total loop time
        duration: 1.5,
        ease: "power2.out",
      });
    };

    const handlePageLeave = () => {
      gsap.to(loop, {
        timeScale: 1, // Full speed (25s track loop)
        duration: 1.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mouseenter", handlePageHover);
    window.addEventListener("mouseleave", handlePageLeave);
    
    // Fallback listeners for cursor entering and quitting Document Body
    document.body.addEventListener("mouseenter", handlePageHover);
    document.body.addEventListener("mouseleave", handlePageLeave);

    // Subtle scale pulses on stars / diamond symbols
    const diamonds = track.querySelectorAll(".diamond-separator");
    if (diamonds.length > 0) {
      gsap.fromTo(
        diamonds,
        { scale: 0.8 },
        {
          scale: 1.25,
          color: "#ffe08f",
          stagger: {
            each: 0.15,
            repeat: -1,
            yoyo: true,
          },
          duration: 1.2,
          ease: "sine.inOut",
        }
      );
    }

    return () => {
      loop.kill();
      window.removeEventListener("mouseenter", handlePageHover);
      window.removeEventListener("mouseleave", handlePageLeave);
      document.body.removeEventListener("mouseenter", handlePageHover);
      document.body.removeEventListener("mouseleave", handlePageLeave);
    };
  }, []);

  const list = [
    "TEETH WHITENING",
    "DENTAL IMPLANTS",
    "INVISALIGN®",
    "SMILE MAKEOVERS",
    "PORCELAIN VENEERS",
  ];

  return (
    <section
      id="marquee-strip"
      ref={containerRef}
      className="bg-secondary bg-[#b1efd8] py-5 overflow-hidden border-y border-primary-mint/15 select-none relative z-20"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap w-fit gap-16"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* Set 1 */}
        <div className="flex items-center gap-16">
          {list.map((item, index) => (
            <div key={`set1-${index}`} className="flex items-center gap-16 font-gpu">
              <span className="font-dm text-xs md:text-sm font-semibold tracking-[0.2em] text-[#00402d]">
                {item}
              </span>
              <span className="diamond-separator inline-block text-primary-mint">
                ✦
              </span>
            </div>
          ))}
        </div>

        {/* Duplicate Set 2 for seamless loop alignment */}
        <div className="flex items-center gap-16" aria-hidden="true">
          {list.map((item, index) => (
            <div key={`set2-${index}`} className="flex items-center gap-16 font-gpu">
              <span className="font-dm text-xs md:text-sm font-semibold tracking-[0.2em] text-[#00402d]">
                {item}
              </span>
              <span className="diamond-separator inline-block text-primary-mint">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
