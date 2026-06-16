import React from "react";
// @ts-ignore
import logoImg from "../assets/images/regenerated_image_1781201019400.png";

interface BDLogoProps {
  className?: string;
  showText?: boolean;
}

export default function BDLogo({ className = "w-10 h-10", showText = false }: BDLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-[#dce1e7] rounded-xl overflow-hidden shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.6),_0_2.5px_5px_rgba(0,0,0,0.08)] flex items-center justify-center transition-transform duration-300 hover:scale-[1.03]">
        <img
          src={logoImg}
          className={`${className} object-cover`}
          alt="The Dental Elegance Logo"
          referrerPolicy="no-referrer"
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left select-none">
          <span className="font-cormorant font-bold text-[#011d24] tracking-[0.06em] text-[17px] md:text-[21px] leading-tight">
            THE DENTAL ELEGANCE
          </span>
          <span className="font-dm text-[8.5px] font-bold tracking-[0.25em] text-[#00afb9] uppercase mt-0.5 leading-none">
            DR. AASHU THAKRAN
          </span>
        </div>
      )}
    </div>
  );
}
