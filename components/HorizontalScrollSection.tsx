"use client";

import { useRef, useEffect, useState, Children, cloneElement, isValidElement } from 'react';
import { ArrowDown } from 'lucide-react';

type HorizontalScrollSectionProps = {
  children: React.ReactNode;
}

const scrollSpeed = 2;

export default function HorizontalScrollSection({ children }: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const childArray = Children.toArray(children);

  // After each render, make sure cardRefs has the right length
  cardRefs.current = cardRefs.current.slice(0, childArray.length);

  function updateActiveCard() {
    const container = containerRef.current;
    if (!container) return;

    // Viewport center in container-scroll space
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let closestDist = Infinity;

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      // Card center relative to the container's scroll origin
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = i;
      }
    });

    setActiveIndex(closestIndex);
  }

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const handleScroll = () => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;

      const progress = Math.max(
        0,
        Math.min(1, (scrollY - sectionTop) / (sectionHeight - window.innerHeight))
      );

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = progress * maxScrollLeft;

      updateActiveCard();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const scrollDistance = container.scrollWidth - container.clientWidth;
      if (sectionRef.current) {
        sectionRef.current.style.height = `${scrollDistance * scrollSpeed + window.innerHeight}px`;
      }
    };

    const t = setTimeout(updateHeight, 50);
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    updateActiveCard();
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Pfeil nach unten + CTA erscheint bei der letzten Card */}
        <div className={`absolute right-[10%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 transition-all duration-500 ${activeIndex === childArray.length - 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ArrowDown className="w-18 h-18 text-white animate-bounce" />
          <button
            onClick={() => document.getElementById('interactive')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#B79864] text-white font-semibold text-xl hover:bg-[#c9aa74] transition-colors duration-200"
          >
            Teste dich jetzt
          </button>
        </div>

        <div
          ref={containerRef}
          className="flex flex-row gap-6 px-[33%] h-full items-center overflow-hidden"
        >
          <div className="w-[100px] shrink-0" />

          {childArray.map((child, i) => {
            if (!isValidElement(child)) return child;
            return (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                // Transition on scale + height so the layout shift is smooth
                className={`
                  flex-none transition-all duration-200 ease-in-out
                  ${activeIndex === i
                    ? 'scale-100 z-10'
                    : 'scale-90 opacity-80'}
                `}
              >
                {cloneElement(child as React.ReactElement<{ isActive?: boolean }>, {
                  isActive: activeIndex === i,
                })}
              </div>
            );
          })}

          <div className="w-[100px] shrink-0" />
        </div>
      </div>
    </div>
  );
}