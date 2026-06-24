"use client";

import { raleway } from "@/app/fonts"

type CardProps = {
  title: string;
  children: React.ReactNode;
  img: string;
  isActive?: boolean; // injected by HorizontalScrollSection
};

export default function Card({ title, children, img, isActive = false }: CardProps) {
  return (
    <div
      className={`
        flex-none flex flex-col bg-[#536E91] border-3 border-[#525F80] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out
        ${isActive
          ? 'w-[65vh] h-[75vh]'
          : 'w-[40vh] h-[40vh]'
        }
      `}
    >
      {/* Image — grows to fill all available space above the content */}
      <div className="flex-1 min-h-0 overflow-hidden transition-all duration-500">
        <img
          src={img}
          className={"w-full h-full object-contain transition-transform duration-500"}
          alt={title}
        />
      </div>

      {/* Content — pinned to bottom, never compressed */}
      <div
        className={`shrink-0 flex flex-col px-5 transition-all duration-500 ${isActive ? 'py-5 opacity-100' : 'py-3 opacity-60'}`}
      >
        <p className={`${raleway.className} text-white font-semibold transition-all duration-500 ${isActive ? 'text-[2.5vh]' : 'text-[2vh]'}`}>
          {title}
        </p>

        {/* Text only visible on active card — collapsed (no height) on inactive */}
        <div
          className={`transition-all duration-500 text-[1.5vh] leading-relaxed overflow-hidden ${isActive ? 'max-h-[600px] opacity-100 translate-y-0 mt-2' : 'max-h-0 opacity-0 translate-y-4 pointer-events-none'}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
