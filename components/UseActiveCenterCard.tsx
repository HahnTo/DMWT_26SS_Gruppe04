import { useEffect, useState, useRef } from "react";

export default function UseActiveCenterCard(
  refs: React.RefObject<(HTMLElement | null)[]>
) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Debounce-Timer, damit kurze Layout-Schwankungen keinen Flip auslösen
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let rafId: number;

    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // containerRef ist der flex-div in HorizontalScrollSection
        const container = refs.current[0]?.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closest = 0;
        let minDist = Infinity;

        refs.current.forEach((el, i) => {
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const elCenter = rect.left + rect.width / 2;
          const dist = Math.abs(containerCenter - elCenter);
          if (dist < minDist) {
            minDist = dist;
            closest = i;
          }
        });

        // Nur updaten wenn sich der Index wirklich ändert
        setActiveIndex((prev) => (prev !== closest ? closest : prev));
      });
    };

    // window-scroll weil HorizontalScrollSection container.scrollLeft per JS setzt
    // (kein nativer scroll-event auf dem container)
    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(rafId);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [refs]);

  return activeIndex;
}