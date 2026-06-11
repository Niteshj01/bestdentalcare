import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches;
      setIsTouchDevice(isTouch);
      if (!isTouch) {
        document.body.classList.add("custom-cursor-enabled");
      }
    };

    checkTouch();

    if (isTouchDevice) return;

    // Fade in cursor after loading
    const showTimeout = setTimeout(() => {
      setIsVisible(true);
      gsap.to([dotRef.current, ringRef.current], {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }, 2800); // Wait for preloader to animate out

    // Position setup using quickTo for buttery smooth 60fps+ tracking
    const xDotTo = gsap.quickTo(dotRef.current, "x", { duration: 0.05, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dotRef.current, "y", { duration: 0.05, ease: "power3.out" });

    const xRingTo = gsap.quickTo(ringRef.current, "x", { duration: 0.25, ease: "power2.out" });
    const yRingTo = gsap.quickTo(ringRef.current, "y", { duration: 0.25, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      // Offset values so cursor is centered at coords
      xDotTo(e.clientX - 5);
      yDotTo(e.clientY - 5);

      xRingTo(e.clientX - 20);
      yRingTo(e.clientY - 20);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Click Animations
    const onMouseDown = () => {
      gsap.to(dotRef.current, {
        scale: 2,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
      });
      gsap.to(ringRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.4,
        ease: "power1.out",
        onComplete: () => {
          gsap.set(ringRef.current, { scale: 1, opacity: 1 });
        },
      });
    };

    window.addEventListener("mousedown", onMouseDown);

    // Hover interactions using event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Clickable elements (links, buttons, inputs)
      const isClickable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("select") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest('[role="button"]') ||
        target.classList.contains("clickable-element");

      // Headings and textual elements
      const isHeadingText =
        target.tagName === "H1" ||
        target.tagName === "H2" ||
        target.tagName === "H3" ||
        target.tagName === "H4" ||
        target.tagName === "H5" ||
        target.tagName === "SPAN" ||
        target.tagName === "P" ||
        target.closest(".hover-stretch-text");

      if (isClickable) {
        // Hide dot, expand ring, fill ring with primary mint background and border-dashed
        gsap.to(dotRef.current, { scale: 0, duration: 0.2 });
        gsap.to(ringRef.current, {
          scale: 1.8,
          backgroundColor: "rgba(62, 180, 137, 0.15)",
          borderColor: "#3EB489",
          borderStyle: "dashed",
          duration: 0.3,
        });
      } else if (isHeadingText) {
        // Flatten the ring like a text cursor overlay
        gsap.to(ringRef.current, {
          scaleX: 2.2,
          scaleY: 0.4,
          borderRadius: "8px",
          borderWidth: "1.5px",
          borderColor: "#3EB489",
          duration: 0.35,
        });
        gsap.to(dotRef.current, { scale: 0.5, duration: 0.35 });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Reverse transformations when mouse leaves
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
      gsap.to(ringRef.current, {
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        borderRadius: "9999px",
        backgroundColor: "transparent",
        borderColor: "#3EB489",
        borderStyle: "solid",
        borderWidth: "2px",
        duration: 0.3,
      });
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      clearTimeout(showTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 10px solid mint dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-primary-mint pointer-events-none z-[999999] opacity-0"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
        }}
      />
      {/* 40px hollow mint ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-primary-mint pointer-events-none z-[999998] opacity-0"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform",
        }}
      />
    </>
  );
}
