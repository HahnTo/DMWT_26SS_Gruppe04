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
        flex-none bg-[#536E91] border border-[#525F80] rounded-2xl overflow-hidden shadow-md
        transition-all duration-500 ease-in-out
        ${isActive
          // Active card: wider, taller, full shadow — text section auto-expands to fit content
          ? 'w-[480px] shadow-2xl'
          // Inactive cards: narrower, image takes all the space, text hidden
          : 'w-[300px] h-[400px] shadow-md'
        }
      `}
    >
      {/* Image */}
      <div
        className={`
          overflow-hidden transition-all duration-500
          ${isActive ? 'h-[275px]' : 'h-[200px]'}
        `}
      >
        <img
          src={img}
          className="w-full h-full object-cover transition-transform duration-500"
          alt={title}
        />
      </div>

      {/* Content — always rendered, but only fully visible on active card */}
      <div
        className={`
          flex flex-col gap-3 px-5 overflow-hidden transition-all duration-500
          ${isActive ? 'py-5 max-h-[600px] opacity-100' : 'py-3 max-h-[60px] opacity-60'}
        `}
      >
        <p className={`${raleway.className} text-white font-semibold transition-all duration-500 ${isActive ? 'text-[28px]' : 'text-[24px]'}`}>
          {title}
        </p>

        {/* Text only visible on active card — no inner scroll needed */}
        <div
          className={`
            transition-all duration-500 text-sm leading-relaxed
            ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
