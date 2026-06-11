import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Import custom sections
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Doctors from "./components/Doctors";
import Stats from "./components/Stats";
import BeforeAfter from "./components/BeforeAfter";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Appointment from "./components/Appointment";
import Instagram from "./components/Instagram";
import Footer from "./components/Footer";
import FloatingControls from "./components/FloatingControls";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [loaderFinished, setLoaderFinished] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Top-of-script mandatory optimal parameters as specified by performance constraints
    gsap.config({ force3D: true, nullTargetWarn: false });
    gsap.ticker.lagSmoothing(0);

    if (!loaderFinished) return;

    // 1. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.4,
      infinite: false,
    });

    // 2. Synchronize GSAP ticker with Lenis scroll
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);

    // 3. Configure ScrollTrigger to refresh with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    // 4. Create top progress scrollbar slider via ScrollTrigger scrub
    const progressTween = gsap.fromTo(
      progressBarRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.1,
        },
      }
    );

    // Cleanup ticker and scroll events on destroy
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      progressTween.scrollTrigger?.kill();
      progressTween.kill();
    };
  }, [loaderFinished]);

  return (
    <>
      {/* Dynamic preloader overlay */}
      <Loader onComplete={() => setLoaderFinished(true)} />

      {/* Main website page columns */}
      <div className={`transition-opacity duration-300 ${loaderFinished ? "opacity-100" : "opacity-0"}`}>
        
        {/* Custom luxury tracking cursor */}
        <CustomCursor />

        {/* Floating golden/mint scroll progress bar */}
        <div className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] origin-left bg-gradient-to-r from-primary-mint to-gold shadow-[0_0_8px_rgba(62,180,137,0.6)]" style={{ transform: "scaleX(0)" }} ref={progressBarRef} />

        {/* Main layout tracks */}
        <Navbar />
        <Hero startAnimation={loaderFinished} />
        <Marquee />
        <About />
        <Services />
        <Doctors />
        <Stats />
        <BeforeAfter />
        <Testimonials />
        <FAQ />
        <Appointment />
        <Instagram />
        <Footer />
        <FloatingControls />

      </div>
    </>
  );
}
