"use client";

import { useRef, useEffect } from "react";
import CtaButton from "./CTAButton";

// 5 images × 3 copies = 15 elements
// Copies share the same keyframe but start at different y-tracks and staggered delays
const CONFIGS = [
  // FalseSocialProof — left → right (hf0)
  { src: "/images/FalseSocialProof_background.png", x:  -2, y: 14,  size: 20, dur: 28, delay: 0,    anim: 0 },
  { src: "/images/FalseSocialProof_background.png", x: -22, y: 38,  size: 17, dur: 24, delay: 9,  anim: 0 },
  { src: "/images/FalseSocialProof_background.png", x:  -50, y: 70,  size: 22, dur: 34, delay: 6, anim: 0 },

  // HiddenCosts — right → left (hf1)
  { src: "/images/HiddenCosts_background.png",      x: 50, y: 48,  size: 17, dur: 35, delay: 0,    anim: 1 },
  { src: "/images/HiddenCosts_background.png",      x: 10, y: 18,  size: 14, dur: 30, delay: 0, anim: 1 },
  { src: "/images/HiddenCosts_background.png",      x: 110, y: 72,  size: 19, dur: 40, delay: 3, anim: 1 },

  // Nagging — top → bottom-right (hf2)
  { src: "/images/Nagging_background.png",          x: 15,  y: -22, size: 22, dur: 33, delay: 6,    anim: 2 },
  { src: "/images/Nagging_background.png",          x: 42,  y: -22, size: 18, dur: 30, delay: 12,   anim: 2 },
  { src: "/images/Nagging_background.png",          x: 68,  y: -22, size: 24, dur: 26, delay: 4,   anim: 2 },

  // RoachMotel — bottom → top-left (hf3)
  { src: "/images/RoachMotel_background.png",       x: 70,  y: -10, size: 18, dur: 33, delay: 12,   anim: 3 },
  { src: "/images/RoachMotel_background.png",       x: 30,  y: 100, size: 14, dur: 30, delay: 5,   anim: 3 },
  { src: "/images/RoachMotel_background.png",       x: 54,  y:  80, size: 21, dur: 28, delay: 0,   anim: 3 },

  // TrickQuestions — left → right (hf4)
  { src: "/images/TrickQuestions_background.png",   x: 100, y: 60,  size: 16, dur: 22, delay: 6,    anim: 4 },
  { src: "/images/TrickQuestions_background.png",   x: -100, y: 25,  size: 13, dur: 28, delay: 4, anim: 4 },
  { src: "/images/TrickQuestions_background.png",   x: -18, y: 82,  size: 18, dur: 34, delay: 2, anim: 4 },
];

const KEYFRAMES = `
  @keyframes hf0 {
    0%   { transform: translate(0,0) rotate(-2deg); }
    30%  { transform: translate(38vw, 6vh) rotate(1deg); }
    70%  { transform: translate(88vw, -5vh) rotate(3deg); }
    100% { transform: translate(135vw, 10vh) rotate(4deg); }
  }
  @keyframes hf1 {
    0%   { transform: translate(0,0) rotate(3deg); }
    25%  { transform: translate(-32vw, -9vh) rotate(1deg); }
    65%  { transform: translate(-82vw, 14vh) rotate(-2deg); }
    100% { transform: translate(-135vw, -6vh) rotate(-4deg); }
  }
  @keyframes hf2 {
    0%   { transform: translate(0,0) rotate(-1deg); }
    40%  { transform: translate(22vw, 42vh) rotate(2deg); }
    80%  { transform: translate(48vw, 90vh) rotate(3deg); }
    100% { transform: translate(58vw, 135vh) rotate(4deg); }
  }
  @keyframes hf3 {
    0%   { transform: translate(0,0) rotate(4deg); }
    35%  { transform: translate(-28vw, -36vh) rotate(2deg); }
    75%  { transform: translate(-52vw, -82vh) rotate(-1deg); }
    100% { transform: translate(-62vw, -135vh) rotate(-3deg); }
  }
  @keyframes hf4 {
    0%   { transform: translate(0,0) rotate(1deg); }
    30%  { transform: translate(38vw, -6vh) rotate(-1deg); }
    70%  { transform: translate(90vw, 9vh) rotate(-3deg); }
    100% { transform: translate(135vw, -14vh) rotate(-4deg); }
  }
`;

export default function Hero() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs  = useRef<(HTMLImageElement | null)[]>([]);
  const offsets  = useRef(CONFIGS.map(() => ({ x: 0, y: 0 })));
  const targets  = useRef(CONFIGS.map(() => ({ x: 0, y: 0 })));
  const rafId    = useRef<number | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      imgRefs.current.forEach((imgEl, i) => {
        if (!imgEl) return;
        const r  = imgEl.getBoundingClientRect();
        const cx = r.left + r.width  / 2 - rect.left;
        const cy = r.top  + r.height / 2 - rect.top;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 200;

        if (dist < radius && dist > 0) {
          const force = (1 - dist / radius) * 55;
          targets.current[i] = { x: -(dx / dist) * force, y: -(dy / dist) * force };
        } else {
          targets.current[i] = { x: 0, y: 0 };
        }
      });
    };

    const onLeave = () => {
      targets.current = CONFIGS.map(() => ({ x: 0, y: 0 }));
    };

    const tick = () => {
      wrapRefs.current.forEach((el, i) => {
        if (!el) return;
        const cur = offsets.current[i];
        const tgt = targets.current[i];
        const nx  = cur.x + (tgt.x - cur.x) * 0.08;
        const ny  = cur.y + (tgt.y - cur.y) * 0.08;
        offsets.current[i] = { x: nx, y: ny };
        el.style.transform = `translate(${nx}px,${ny}px)`;
      });
      rafId.current = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden">
      <style>{KEYFRAMES}</style>

      {CONFIGS.map((cfg, i) => (
        <div
          key={i}
          ref={el => { wrapRefs.current[i] = el; }}
          className="absolute pointer-events-none"
          style={{
            left:   `${cfg.x}%`,
            top:    `${cfg.y}%`,
            width:  `${cfg.size}vh`,
            height: `${cfg.size}vh`,
          }}
        >
          <img
            ref={el => { imgRefs.current[i] = el; }}
            src={cfg.src}
            alt=""
            draggable={false}
            className="w-full h-full object-contain select-none"
            style={{
              opacity: 0.35,
              animation: `hf${cfg.anim} ${cfg.dur}s linear ${cfg.delay}s infinite`,
            }}
          />
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-[50] md:text-[100px]">
          Dark Patterns
        </h1>
        <h2 className="text-[30px] md:text-[40px] pt-[20px]">
          Wie sie manipulieren
        </h2>
        <CtaButton
          label="Erfahre mehr"
          targetId="intro"
        />
      </div>
    </div>
  );
}
