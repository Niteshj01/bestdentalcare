import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface IndividualStatProps {
  value: number;
  suffix: string;
  label: string;
}

function IndividualStat({ value, suffix, label }: IndividualStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      setDisplayValue(value);
      return;
    }

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2.0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: elementRef.current,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        setDisplayValue(Math.floor(obj.val));
      },
    });
  }, [value]);

  return (
    <div
      ref={elementRef}
      className="text-center space-y-3 p-6 flex flex-col justify-center select-none"
    >
      <div className="font-cormorant text-5xl md:text-6xl font-light text-[#ffe08f] tracking-tight">
        {displayValue}
        <span className="text-white ml-0.5">{suffix}</span>
      </div>
      <div className="w-8 h-[1px] bg-primary-mint mx-auto" />
      <p className="font-dm text-[11px] font-semibold text-surface-mint uppercase tracking-widest leading-relaxed">
        {label}
      </p>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      const lines = linesRef.current?.querySelectorAll(".dec-line");
      if (lines && lines.length > 0) {
        gsap.set(lines, { scaleY: 1 });
      }
      return;
    }

    // Scale decorative background lines on Scroll
    const lines = linesRef.current?.querySelectorAll(".dec-line");
    if (lines && lines.length > 0) {
      gsap.fromTo(
        lines,
        { scaleY: 0 },
        {
          scaleY: 1,
          stagger: 0.2,
          duration: 1.5,
          ease: "power3.out",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // Slowly shift dark radial highlight gradient position on mouse move
    const section = sectionRef.current;
    if (section) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        gsap.to(section, {
          backgroundImage: `radial-gradient(circle at ${px}% ${py}%, #074754 0%, #011d24 100%)`,
          duration: 1,
          ease: "power1.out",
        });
      };
      section.addEventListener("mousemove", handleMouseMove);
      return () => section.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden transition-all duration-300"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, #074754 0%, #011d24 100%)",
      }}
    >
      {/* Structural Decorative Vertical Lines */}
      <div
        ref={linesRef}
        className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-10"
      >
        <div className="dec-line border-r border-[#ffe08f] h-full scale-y-0 origin-top" />
        <div className="dec-line border-r border-[#ffe08f] h-full scale-y-0 origin-top" />
        <div className="dec-line border-r border-[#ffe08f] h-full scale-y-0 origin-top" />
        <div className="dec-line pin-none h-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
        <IndividualStat value={2} suffix="k+" label="Happy Patients" />
        <IndividualStat value={11} suffix="y+" label="Expert Experience" />
        <IndividualStat value={100} suffix="%" label="Sterilized Hygiene" />
        <IndividualStat value={5} suffix="★" label="Google Stars Rating" />
      </div>
    </section>
  );
}
