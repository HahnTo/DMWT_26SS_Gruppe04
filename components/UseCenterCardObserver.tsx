import { useEffect, useState } from "react";

export default function UseActiveCenterCard(
  refs: React.RefObject<(HTMLElement | null)[]>
) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const container = refs.current[0]?.parentElement;
        if (!container) {
          ticking = false;
          return;
        }

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

        setActiveIndex((prev) => (prev !== closest ? closest : prev));
        ticking = false;
      });
    };

    // HorizontalScrollSection scrollt per window.scrollY → hier window abhören
    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, [refs]);

  return activeIndex;
}