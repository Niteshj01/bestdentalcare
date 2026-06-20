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
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#e8ffef] to-white border border-primary-mint/10 relative ${className}`}
            style={style}
            id="placeholder-doctor"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,180,137,0.05),transparent_60%)] pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-[#3eb489]/10 flex items-center justify-center text-[#3eb489] mb-4 border border-[#3eb489]/20 shadow-inner">
              <User className="w-8 h-8 stroke-[1.25]" />
            </div>
            <p className="font-cormorant text-2xl font-semibold text-charcoal tracking-tight">{alt || "Senior Dentist"}</p>
            <span className="font-dm text-[9px] uppercase tracking-[0.2em] text-[#3eb489] mt-2 block font-bold">DR. SKY CLINICAL STAFF</span>
          </div>
        );

      case "clinic":
        return (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-tr from-[#001d11] via-[#002f1d] to-[#001d11] border border-primary-mint/15 relative overflow-hidden ${className}`}
            style={style}
            id="placeholder-clinic"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(223,186,92,0.08),transparent_60%)] pointer-events-none" />
            
            {/* Elegant vector mock geometry */}
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dfba5c]/20 to-[#dfba5c]/5 border border-[#dfba5c]/35 flex items-center justify-center text-[#dfba5c] mx-auto shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-cormorant text-xl font-medium text-white max-w-[280px] mx-auto tracking-normal">DR. SKY CLINIC SUITE</h4>
                <p className="text-[10px] text-gray-400 font-sans tracking-wide leading-relaxed max-w-[200px] mx-auto">
                  Premium biological diagnostics & therapeutic dental suite
                </p>
              </div>
            </div>
          </div>
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
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#f2fff6] to-white border border-primary-mint/10 relative overflow-hidden ${className}`}
            style={style}
            id="placeholder-service"
          >
            <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-[#dfba5c] to-[#3eb489]" />
            <div className="w-10 h-10 rounded-full bg-primary-mint/10 border border-primary-mint/15 flex items-center justify-center text-primary-mint mb-3 animate-pulse">
              <HeartPulse className="w-5 h-5 stroke-[1.25]" />
            </div>
            <p className="font-cormorant text-lg font-medium text-charcoal tracking-tight px-4">{alt || "Treatment Room"}</p>
          </div>
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
