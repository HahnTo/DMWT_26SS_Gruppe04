"use client";

import { useRef, useEffect } from 'react';

type HorizontalScrollSectionProps = {
  children: React.ReactNode;
}

const scrollSpeed = 1;

export default function HorizontalScrollSection({ children }: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const handleScroll = () => {
      // Werte können durch den ref von der aktuellen section ausgelesen werden
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollY = window.scrollY;
      
      // Berechnet wie weit man in der Section gescrollt hat (0 bis 1)
      const scrollProgress = Math.max( 
        0,

        Math.min( 1, (scrollY - sectionTop) / (sectionHeight - window.innerHeight))
      );

      // Berechne maximale horizontale Scroll-Distanz
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      
      // Mappe vertikalen Progress auf horizontale Position
      container.scrollLeft = scrollProgress * maxScrollLeft;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    // Listener löschen, wenn er nicht mehrgebraucht wird
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Berechne die Höhe basierend auf der Breite des Inhalts
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      const scrollDistance = container.scrollWidth - container.clientWidth;
      
      // Setze die Section-Höhe so, dass genug Platz zum Scrollen ist
      // Scrollspeed kann oben eingestellt werden, eventuell bauen wir es noch als probs ein, falls wir die Komponente öfters verwenden müssen
      if (sectionRef.current) {
        sectionRef.current.style.height = `${(scrollDistance * scrollSpeed) + window.innerHeight}px`;
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      {/* Durch das sticky "bleibt die Website stehen" und scrollt nur horizontal */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={containerRef}
          className="flex flex-row gap-6 px-8 h-full items-center overflow-hidden"
        >
          {children}
        </div>
      </div>
    </div>
  );
}


// In page.tsx wird es dann so verwendet (Hier um Merge Konflikte zu verhindern)

{/* <section>
        <HorizontalScrollSection>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
            <Card
              title="Card1 Titel"
              img="/images/CardPlaceholder.png"
            >
              Card text
            </Card>
        </HorizontalScrollSection>
      </section> */}