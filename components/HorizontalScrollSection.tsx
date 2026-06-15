"use client";

import { useRef, useEffect, useState, Children, cloneElement, isValidElement } from 'react';

type HorizontalScrollSectionProps = {
  children: React.ReactNode;
}

const scrollSpeed = 5;

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

      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollY - sectionTop) / (sectionHeight - window.innerHeight))
      );

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = scrollProgress * maxScrollLeft;

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
        <div
          ref={containerRef}
          className="flex flex-row gap-6 px-130 h-full items-center overflow-hidden"
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