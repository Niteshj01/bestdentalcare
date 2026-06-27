import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Phone, Clock, Compass, PhoneCall } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function LocationMap() {
  const containerRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      if (leftColRef.current) gsap.set(leftColRef.current, { opacity: 1, x: 0 });
      if (rightColRef.current) gsap.set(rightColRef.current, { opacity: 1, x: 0 });
      return;
    }

    if (leftColRef.current) {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }

    if (rightColRef.current) {
      gsap.fromTo(
        rightColRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }
  }, []);

  const mapsUrl = "https://maps.app.goo.gl/KB8PQnFLFm2zJBu86";
  const embedUrl = `https://maps.google.com/maps?q=Dr.%20Sky%20Dentistry,%20320,%20Shastri%20Nagar,%20Lajpat%20Nagar,%20Near%20Nakodar%20Chowk,%20Jalandhar,%20Punjab%20144001&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      id="location"
      ref={containerRef}
      className="py-24 md:py-32 bg-[#FAF7F2] border-t border-primary-mint/10 relative overflow-hidden"
    >
      {/* Decorative luxury circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-mint/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Details and info */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="font-dm text-xs md:text-sm font-semibold text-primary-mint tracking-[0.2em] uppercase block">
                OUR ATELIER LOCATION
              </span>
              <h2 className="font-cormorant text-4xl md:text-5xl font-light text-charcoal leading-tight">
                Pristine Care In The Heart of Jalandhar
              </h2>
              <div className="w-16 h-[1.5px] bg-primary-mint" />
            </div>

            <p className="font-sans text-sm md:text-base text-[#46544D] leading-relaxed">
              Dr. Sky Dentistry is strategically located in the boutique Shastri Nagar district. Designed to offer a soothing, high-end environment from the moment you step in, our clinic guarantees absolute precision in diagnostic, surgical, and cosmetic dental treatments.
            </p>

            {/* Structured details */}
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-mint/10 border border-primary-mint/20 flex items-center justify-center text-primary-mint shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-dm text-xs font-bold uppercase tracking-wider text-charcoal">
                    Atelier Address
                  </h4>
                  <p className="font-sans text-sm text-[#46544D] leading-relaxed">
                    320, Shastri Nagar, Lajpat Nagar,<br />
                    Near Nakodar Chowk, Jalandhar, Punjab 144001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-mint/10 border border-primary-mint/20 flex items-center justify-center text-primary-mint shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-dm text-xs font-bold uppercase tracking-wider text-charcoal">
                    Operating Hours
                  </h4>
                  <p className="font-sans text-sm text-[#46544D]">
                    Open 24 Hours • Monday — Sunday
                  </p>
                  <p className="font-sans text-[11px] text-[#3EB489] font-medium italic">
                    Emergency & Trauma services always active
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-mint/10 border border-primary-mint/20 flex items-center justify-center text-primary-mint shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-dm text-xs font-bold uppercase tracking-wider text-charcoal">
                    Direct Contact
                  </h4>
                  <p className="font-sans text-sm font-semibold text-charcoal">
                    +91 77176 42334
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#002113] hover:bg-black text-white font-dm text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center decoration-none shrink-0"
              >
                <Compass className="w-4 h-4 text-primary-mint" />
                <span>Get Driving Directions</span>
              </a>

              <a
                href="tel:+917717642334"
                className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-charcoal border border-gray-200 font-dm text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer text-center decoration-none shrink-0"
              >
                <PhoneCall className="w-4 h-4 text-primary-mint" />
                <span>Call Concierge</span>
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Responsive Map */}
          <div ref={rightColRef} className="lg:col-span-7">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-primary-mint/15 bg-white p-3 md:p-4">
              
              {/* Premium browser-like top rail */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-gray-100 mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                </div>
                <div className="px-4 py-1 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-mono text-gray-400 select-none max-w-xs truncate">
                  maps.google.com/drskydentistry
                </div>
                <div className="w-10" />
              </div>

              {/* Map Iframe */}
              <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden bg-gray-100">
                <iframe
                  title="Dr. Sky Dentistry Jalandhar Google Map"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[15%] contrast-[105%] group-hover:grayscale-0 transition-all duration-700"
                />
              </div>

              {/* Gold/mint luxury footer accent */}
              <div className="absolute bottom-6 right-6 bg-[#002113] border border-primary-mint/20 px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 select-none">
                <div className="w-2 h-2 rounded-full bg-primary-mint animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#b1efd8] font-bold">
                  Live Clinic Status: Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
