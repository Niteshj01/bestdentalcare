import React, { useState, forwardRef } from "react";
import { Sparkles, Activity, ShieldCheck, HeartPulse, User } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderType?: "logo" | "doctor" | "clinic" | "service" | "instagram" | "before-after";
  iconName?: string; // Material symbol or Lucide icon description
  fallbackBg?: string; // Tailwind class
}

const SafeImage = forwardRef<HTMLImageElement, SafeImageProps>(({
  src,
  alt,
  className = "",
  placeholderType = "service",
  iconName,
  fallbackBg,
  style,
  ...props
}, ref) => {
  const [hasError, setHasError] = useState(!src);

  // Return elegant custom designed placeholders with corresponding typography and color pallets
  const renderPlaceholder = () => {
    switch (placeholderType) {
      case "logo":
        return (
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-[#01252d] to-[#001D24] border border-[#00afb9]/10 rounded-xl ${className}`}
            style={style}
            id="placeholder-logo"
          >
            <span className="font-cormorant text-xl font-bold tracking-widest text-[#00afb9] animate-pulse">SD</span>
          </div>
        );

      case "doctor":
        return (
          <img
            src="/888.jpg"
            alt={alt || "Doctor"}
            className={className}
            style={style}
            {...props}
          />
        );

      case "clinic":
        return (
          <img
            src="/19.jpg"
            alt={alt || "Clinic"}
            className={className}
            style={style}
            {...props}
          />
        );

      case "instagram":
        return (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-[#12161a] to-[#04080b] border border-white/5 relative ${className}`}
            style={style}
            id="placeholder-instagram"
          >
            <div className="absolute top-3 left-3 bg-white/10 backdrop-blur px-2 py-0.5 rounded text-[8px] font-mono text-gray-400 uppercase tracking-widest">
              Live Showcase
            </div>
            <div className="w-9 h-9 rounded-full bg-[#dfba5c]/10 border border-[#dfba5c]/20 flex items-center justify-center text-[#dfba5c] mb-3">
              <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
            </div>
            <p className="font-cormorant text-sm italic text-gray-300 px-4 leading-normal">{alt || "#DrSkyDentistry"}</p>
          </div>
        );

      case "before-after":
        const isBefore = (alt || "").toLowerCase().includes("before");
        return (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-center ${
              isBefore 
                ? "bg-gradient-to-br from-[#1b2621] to-[#0c1310] border-r border-[#dfba5c]/20" 
                : "bg-gradient-to-br from-[#121a16] via-[#1f3c2e] to-[#121a16]"
            } relative ${className}`}
            style={style}
            id="placeholder-before-after"
          >
            <div className="absolute inset-0 bg-[#3eb489]/2 pointer-events-none" />
            <div className={`w-11 h-11 rounded-full ${isBefore ? "bg-[#cf9e42]/10" : "bg-[#3eb489]/10"} flex items-center justify-center mb-3`}>
              <Activity className={`w-5 h-5 ${isBefore ? "text-[#cf9e42]" : "text-primary-mint"}`} />
            </div>
            <span className={`font-dm text-[9.5px] uppercase tracking-widest font-bold ${isBefore ? "text-[#cf9e42]" : "text-primary-mint"}`}>
              {isBefore ? "Aesthetic Case Study • BEFORE" : "RECONSTRUCTED ARTISTRY • AFTER"}
            </span>
            <p className="text-[11px] text-gray-400 font-sans mt-2 max-w-[260px] mx-auto leading-relaxed">
              {isBefore ? "Initial presentation of dentition before restoration" : "Final high-precision digital porcelain alignment results"}
            </p>
          </div>
        );

      case "service":
      default:
        return (
          <img
            src="/19.jpg"
            alt={alt || "Service Treatment Room"}
            className={className}
            style={style}
            {...props}
          />
        );
    }
  };

  if (hasError) {
    return renderPlaceholder();
  }

  return (
    <img
      ref={ref}
      src={src}
      className={className}
      alt={alt}
      style={style}
      onError={() => setHasError(true)}
      {...props}
    />
  );
});

SafeImage.displayName = "SafeImage";
export default SafeImage;
