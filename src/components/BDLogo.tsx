import React from "react";

interface BDLogoProps {
  className?: string;
  showText?: boolean;
}

export default function BDLogo({ className = "w-10 h-10", showText = false }: BDLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <svg
        className={`${className} overflow-visible`}
        viewBox="72 100 250 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Side: 'B' shape in bright cyan/teal */}
        <path
          d="M205,115 C175,100 142,105 123,124 C116,131 123,138 132,136 C149,132 174,133 189,149 C197,157 202,170 188,187 C178,198 162,201 146,201 C133,201 140,215 148,225 C164,244 163,267 151,291 C139,313 147,330 159,343 C166,350 171,343 173,335 C178,312 186,281 198,247 C204,233 213,195 190,178 C206,163 214,142 205,115 Z"
          fill="#00afb9"
        />
        {/* Leftmost outer accent curve of 'B' */}
        <path
          d="M142,135 C122,151 113,178 113,206 C113,245 127,276 147,302 C151,307 153,303 151,298 C141,272 129,241 129,206 C129,176 137,150 147,138 C149,135 145,132 142,135 Z"
          fill="#00afb9"
        />
        {/* Right Side: 'D' shape / tooth outline in deep steel-teal */}
        <path
          d="M197,115 C215,115 233,129 253,121 C268,114 280,123 277,135 C270,172 254,213 234,251 C223,272 216,295 217,318 C217,325 214,328 211,324 C203,313 194,295 193,272 C191,248 200,230 209,215 C216,204 220,195 210,191 C200,187 193,195 186,204 C184,207 179,204 180,200 C187,178 190,162 181,146 C177,139 180,131 189,129 C191,128 194,124 197,115 Z"
          fill="#074754"
        />
      </svg>
      {showText && (
        <div className="flex flex-col text-left select-none">
          <span className="font-cormorant font-bold text-[#011d24] tracking-[0.06em] text-[17px] md:text-[21px] leading-tight">
            BEST DENTAL CARE
          </span>
          <span className="font-dm text-[8.5px] font-bold tracking-[0.25em] text-[#00afb9] uppercase mt-0.5 leading-none">
            DR. SANYA MAKKAR ALAWADHI
          </span>
        </div>
      )}
    </div>
  );
}
