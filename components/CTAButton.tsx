"use client";
import { useRef } from "react";

type HeroCtaButtonProps = {
  targetId?: string;
  label?: string;
}

export default function CTAButton({ targetId = "interactive", label = "Demo ausprobieren" }: HeroCtaButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleClick() {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="group relative mt-20 px-15 py-3.5 rounded-full border-2 border-[#C9A84C] text-[#C9A84C] text-xl font-bold tracking-widest uppercase overflow-hidden transition-colors duration-300 hover:text-[#1a2235]"
    >
      {/* Fill sweep on hover */}
      <span
        className="absolute inset-0 bg-[#C9A84C] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out"
        aria-hidden="true"
      />
      {/* Label */}
      <span className="relative flex items-center gap-2">
        {label}
      </span>
    </button>
  );
}