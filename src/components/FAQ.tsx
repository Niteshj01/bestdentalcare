import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Why choose BEST Dental Care?",
      answer: "BEST Dental Care is the premier multi-speciality dental clinic located in Sector 14, Hisar (Near Community Centre). Led by Dr. Sanya Makkar Alawadhi, we are dedicated to providing top-notch dental care and oral health solutions with a perfect blend of high-end clinical expertise, deep compassion, and advanced digital technology."
    },
    {
      question: "What services does the clinic offer?",
      answer: "With a sincere commitment to clinical excellence and a patient-centric approach, we offer a wide range of premium services, including: Dental Laminates, comfortable Sedation Dentistry, protective Inlays & Onlays, comprehensive Oral Rehabilitation, Ceramic Crowns & Bridges fixing, and full-mouth hygiene cures."
    },
    {
      question: "What are dental laminates?",
      answer: "Dental laminates require a highly conservative amount of tooth preparation. They can dramatically enhance your smile by correcting stained or discolored teeth, repairing chipped or broken teeth, closing spaces or gaps, and aligning minor crooked teeth with outstanding bio-compatible porcelain."
    },
    {
      question: "Is sedation dentistry safe?",
      answer: "Absolutely. We offer stress-free and exceptionally comfortable sedation techniques tailored for patients who experience high dental anxiety, nervousness, or fear. This ensures a completely relaxed, comfortable experience under highly guarded, expert clinical supervision."
    },
    {
      question: "What are dental inlays and onlays?",
      answer: "These are custom-fabricated dental restorations designed to fit exactly onto decayed or structurally compromised teeth. Unlike standard fillings, inlays and onlays conserve maximum healthy tooth structure, provide superior edge sealing, and offer lifetime durability."
    },
    {
      question: "What is oral rehabilitation?",
      answer: "Oral Rehabilitation refers to a comprehensive, multi-phase treatment plan to restore complex oral functions, bite mechanics, jaw joint comfort, and absolute dental hygiene. It is ideal for patients with full-mouth clinical wear, tooth loss, or overall dentition restructuring."
    },
    {
      question: "Are ceramic crowns and bridges long-lasting?",
      answer: "Yes, we utilize top-quality metal-free ceramic materials that exhibit exceptional strength, outstanding bio-compatibility, and natural light translucency to guarantee long-lasting functionality and a realistic, premium grin."
    }
  ];

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) return;

    // Heading wipe animation
    gsap.fromTo(
      headingRef.current,
      { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          once: true,
        }
      }
    );

    // Stagger items entry on scroll
    const items = containerRef.current?.querySelectorAll(".faq-item-row");
    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true
          }
        }
      );
    }
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      ref={containerRef}
      className="py-24 md:py-36 bg-surface-mint px-6 md:px-12 relative overflow-hidden border-t border-primary-mint/5"
    >
      <div className="w-full max-w-4xl mx-auto space-y-16 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
            PATIENT EDUCATION
          </span>
          <div ref={headingRef} className="inline-block" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
            <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="w-16 h-[1.5px] bg-primary-mint mx-auto" />
          <p className="font-sans text-sage text-xs md:text-sm max-w-md mx-auto">
            Discover how BEST Dental Care combines safe biological techniques with specialized, comfortable client protocols.
          </p>
        </div>

        {/* Accordions List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="faq-item-row bg-white border border-primary-mint/10 hover:border-primary-mint/30 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full py-6 px-6 md:px-8 flex items-center justify-between text-left hover:bg-[#00afb9]/5 focus:outline-none group select-none"
                >
                  <span className="font-cormorant text-xl md:text-2xl text-charcoal font-semibold tracking-tight transition-colors group-hover:text-primary-mint">
                    {faq.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-surface-mint flex items-center justify-center text-primary-mint flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 bg-primary-mint text-white" : ""
                  }`}>
                    <span className="material-symbols-outlined text-lg leading-none font-light">
                      keyboard_arrow_down
                    </span>
                  </span>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-96 border-t border-primary-mint/5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-6 md:p-8 bg-[#fcfeff]/82 text-[#3D4943] font-sans text-sm md:text-base leading-relaxed text-left">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
