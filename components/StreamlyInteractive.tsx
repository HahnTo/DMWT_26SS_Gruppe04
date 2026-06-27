"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "ultra" | "standard" | "basis";
type ToastKind = "roach" | "confirm_cancel" | "bonus" | null;
type DropZoneId = "preselect" | "hidden_costs" | "countdown" | "trick_question" | "social_proof" | "roach_motel";

interface DarkPatternInfo {
  name: string;
  category: string;
  description: string;
}

const DARK_PATTERNS: Record<DropZoneId, DarkPatternInfo> = {
  countdown: {
    name: "Countdown Timer / False Urgency",
    category: "Dringlichkeitstrick",
    description:
      "Ein Countdown suggeriert, das Angebot laufe gleich ab. Oft wird er aber einfach neu gestartet oder das Angebot ist dauerhaft verfügbar. Ziel: impulsive Kaufentscheidung provozieren.",
  },
  preselect: {
    name: "Preselection / Vorauswahl",
    category: "Täuschende Voreinstellung",
    description:
      "Der teuerste Plan ist vorausgewählt. Günstigere Alternativen erfordern aktives Umschalten. Viele Nutzer:innen übernehmen die Voreinstellung unreflektiert.",
  },
  trick_question: {
    name: "Trick Question",
    category: "Verwirrende Formulierung",
    description:
      "Die Opt-out-Box 'Ich möchte nicht, dass ich keine Marketingkommunikation erhalte.' ist doppelt negativ. Wer sie ankreuzt, denkt er lehnt ab, wählt aber tatsächlich aus, keine Abmeldung zu wünschen.",
  },
  hidden_costs: {
    name: "Hidden Costs / Versteckte Kosten",
    category: "Preisverschleierung",
    description:
      "Der Aktionspreis (€2,99) wird groß hervorgehoben; der Folgepreis (€17,99/Mo.) ist im Kleingedruckten versteckt und nur nach aktivem Lesen erkennbar.",
  },
  social_proof: {
    name: "False Social Proof",
    category: "Gefälschte Glaubwürdigkeit",
    description:
      '„#1 in Deutschland heute" ist ein nicht verifizierbarer Marketing-Claim ohne Quelle. Er erzeugt Konformitätsdruck: Wenn alle das schauen, muss es gut sein.',
  },
  roach_motel: {
    name: "Roach Motel",
    category: "Erschwerter Ausstieg",
    description:
      "Das Abo ist leicht abzuschließen, aber die Kündigung erfordert einen Brief, absichtlich bürokratisch, um Abbrüche zu verhindern.",
  },
};

const DROP_ZONE_ORDER: DropZoneId[] = [
  "social_proof",
  "countdown",
  "preselect",
  "trick_question",
  "hidden_costs",
  "roach_motel",
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOP10 = [
  { title: "Dark Horizons", genre: "Thriller", seasons: 4, match: 98, badge: "" },
  { title: "Nachtschatten", genre: "Krimi", seasons: 2, match: 95, badge: "NEU" },
  { title: "Deep Signal", genre: "Sci-Fi", seasons: 1, match: 91, badge: "" },
  { title: "Schlüsselzeuge", genre: "Drama", seasons: 3, match: 89, badge: "" },
  { title: "Zero Hour", genre: "Action", seasons: 2, match: 86, badge: "" },
  { title: "Codex", genre: "Mystery", seasons: 2, match: 84, badge: "ORIGINAL" },
  { title: "Glasstadt", genre: "Drama", seasons: 1, match: 82, badge: "" },
  { title: "Schattenkartell", genre: "Krimi", seasons: 3, match: 80, badge: "" },
  { title: "Echo Protokoll", genre: "Sci-Fi", seasons: 2, match: 78, badge: "NEU" },
  { title: "Letzte Spur", genre: "Thriller", seasons: 1, match: 76, badge: "" },
];

const CARD_COLORS = [
  "from-purple-900 to-indigo-900",
  "from-slate-800 to-blue-900",
  "from-teal-900 to-cyan-900",
  "from-rose-900 to-pink-900",
  "from-gray-800 to-slate-700",
  "from-green-900 to-emerald-800",
  "from-indigo-900 to-violet-900",
  "from-cyan-900 to-blue-950",
  "from-pink-900 to-rose-950",
  "from-emerald-900 to-teal-950",
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function ContentCard({
  title,
  genre,
  colorClass,
  badge,
  rank,
  match,
}: {
  title: string;
  genre: string;
  colorClass: string;
  badge?: string;
  rank?: number;
  match?: number;
}) {
  return (
    <div className="relative flex-shrink-0 w-36 rounded-lg overflow-hidden cursor-pointer group">
      <div className={`bg-gradient-to-br ${colorClass} h-24 flex items-center justify-center`}>
        <span className="text-white/40 text-3xl font-black">{rank ?? "▶"}</span>
      </div>
      {badge && (
        <span
          className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${badge === "ORIGINAL"
              ? "bg-orange-500 text-white"
              : badge === "EXKLUSIV"
                ? "bg-purple-600 text-white"
                : "bg-green-500 text-white"
            }`}
        >
          {badge}
        </span>
      )}
      <div className="p-2 bg-gray-900">
        {match && <p className="text-green-400 text-[10px] font-semibold">{match}% Treffer</p>}
        <p className="text-white text-xs font-semibold truncate">{title}</p>
        <p className="text-gray-500 text-[10px]">{genre}</p>
      </div>
    </div>
  );
}

function TargetZone({
  id,
  reveal,
  isHit,
  registerRef,
  className = "",
}: {
  id: DropZoneId;
  reveal: boolean;
  isHit: boolean;
  registerRef: (id: DropZoneId, el: HTMLDivElement | null) => void;
  className?: string;
}) {
  return (
    <div
      ref={(el) => registerRef(id, el)}
      className={`absolute rounded-md pointer-events-none transition-all duration-300 ${reveal
          ? isHit
            ? "ring-2 ring-emerald-400 bg-emerald-400/10"
            : "ring-2 ring-rose-400 bg-rose-400/10"
          : ""
        } ${className}`}
    />
  );
}

// Chip rendered as position:absolute inside the drag container once placed,
// or as normal flow element inside the rail when pos === null.
function DragChip({
  id,
  pos,
  isDragging,
  resultState,
  onPointerDown,
  registerRef,
}: {
  id: DropZoneId;
  pos: { x: number; y: number } | null;
  isDragging: boolean;
  resultState: "none" | "correct" | "wrong";
  onPointerDown: (id: DropZoneId, e: React.PointerEvent) => void;
  registerRef: (id: DropZoneId, el: HTMLDivElement | null) => void;
}) {
  const stateClasses =
    resultState === "correct"
      ? "border-emerald-400 bg-emerald-950/90 ring-2 ring-emerald-400"
      : resultState === "wrong"
        ? "border-rose-400 bg-rose-950/90 ring-2 ring-rose-400"
        : isDragging
          ? "border-amber-400 bg-gray-900 ring-2 ring-amber-400 scale-105"
          : "border-gray-700 bg-gray-900 hover:border-amber-400 hover:bg-gray-800";

  // When placed: position:absolute inside the relative drag-container,
  // with left/top in container-relative coords. When in the rail: normal flow.
  const style: React.CSSProperties = pos
    ? {
      position: "absolute",
      left: pos.x,
      top: pos.y,
      zIndex: isDragging ? 1000 : 500,
      touchAction: "none",
    }
    : { touchAction: "none" };

  return (
    <div
      ref={(el) => registerRef(id, el)}
      onPointerDown={(e) => onPointerDown(id, e)}
      style={style}
      className={`w-56 rounded-lg border px-4 py-3 cursor-grab active:cursor-grabbing select-none transition-colors shadow-lg ${stateClasses}`}
    >
      <div className="flex items-center gap-1.5">
        {resultState === "correct" && <span className="text-emerald-400 text-sm">✓</span>}
        {resultState === "wrong" && <span className="text-rose-400 text-sm">✗</span>}
        <p className="text-white text-sm font-semibold leading-tight">{DARK_PATTERNS[id].name}</p>
      </div>
      <p className="text-gray-500 text-[10px] mt-0.5">{DARK_PATTERNS[id].category}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StreamlyInteractive() {
  const [plan, setPlan] = useState<Plan>("ultra");
  const [consent1, setConsent1] = useState(true);
  const [consent2, setConsent2] = useState(true);
  const [consent3, setConsent3] = useState(false);
  const [seconds, setSeconds] = useState(523);
  const [toastKind, setToastKind] = useState<ToastKind>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [cancelStep, setCancelStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Chip positions in CONTAINER-RELATIVE coordinates. null = still in the rail.
  const [chipPos, setChipPos] = useState<Record<DropZoneId, { x: number; y: number } | null>>({
    countdown: null,
    preselect: null,
    trick_question: null,
    hidden_costs: null,
    roach_motel: null,
    social_proof: null,
  });
  const [draggingId, setDraggingId] = useState<DropZoneId | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<Record<DropZoneId, boolean> | null>(null);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // ── NEW: ref for the position:relative drag container ─────────────────────
  // All absolute chip positions are expressed relative to this element.
  const dragContainerRef = useRef<HTMLDivElement | null>(null);

  const targetRefs = useRef<Record<DropZoneId, HTMLDivElement | null>>({
    countdown: null,
    preselect: null,
    trick_question: null,
    hidden_costs: null,
    roach_motel: null,
    social_proof: null,
  });
  const chipRefs = useRef<Record<DropZoneId, HTMLDivElement | null>>({
    countdown: null,
    preselect: null,
    trick_question: null,
    hidden_costs: null,
    roach_motel: null,
    social_proof: null,
  });

  // dragOffset is the pointer position WITHIN the chip (in plain pixel deltas,
  // not yet container-relative). We subtract it after converting to container
  // coords in pointermove, so the chip doesn't snap to its top-left corner.
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 523 : s - 1));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const planDetails: Record<Plan, { label: string; desc: string; price: string; strikethrough?: string }> = {
    ultra: {
      label: "Premium Ultra 4K",
      desc: "4K + HDR · 6 Profile · Downloads",
      price: "€17,99/Mo.",
      strikethrough: "€22,99",
    },
    standard: { label: "Standard HD", desc: "HD · 2 Profile", price: "€9,99/Mo." },
    basis: { label: "Basis", desc: "SD · 1 Profil", price: "€4,99/Mo." },
  };

  function handleCancel() {
    if (cancelStep === 0) {
      setCancelStep(1);
      setToastKind("roach");
    }
  }

  function handleSubscribe() {
    setToastKind("confirm_cancel");
  }

  function registerTargetRef(id: DropZoneId, el: HTMLDivElement | null) {
    targetRefs.current[id] = el;
  }

  // ── Pointer move: update chip position in container-relative coords ────────
  // getBoundingClientRect() is viewport-relative and already accounts for the
  // page's current scroll offset, so subtracting containerRect.left/top gives
  // the correct container-relative position at this exact scroll moment.
  const handlePointerMove = useCallback((e: PointerEvent) => {
    setDraggingId((current) => {
      if (!current) return current;
      const container = dragContainerRef.current;
      if (!container) return current;
      const containerRect = container.getBoundingClientRect();
      setChipPos((prev) => ({
        ...prev,
        [current]: {
          x: e.clientX - containerRect.left - dragOffset.current.x,
          y: e.clientY - containerRect.top - dragOffset.current.y,
        },
      }));
      return current;
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

  useEffect(() => {
    if (draggingId) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [draggingId, handlePointerMove, handlePointerUp]);

  function handlePointerDown(id: DropZoneId, e: React.PointerEvent) {
    if (showResult) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    const chipEl = chipRefs.current[id];
    const container = dragContainerRef.current;
    const currentPos = chipPos[id];

    if (currentPos) {
      // Already placed as absolute: dragOffset = pointer minus chip's current
      // container-relative origin. Both sides in the same coordinate space,
      // so no conversion needed — we just re-derive it from the current clientX
      // and the stored container-relative position.
      const containerRect = container?.getBoundingClientRect() ?? { left: 0, top: 0 };
      dragOffset.current = {
        x: e.clientX - containerRect.left - currentPos.x,
        y: e.clientY - containerRect.top - currentPos.y,
      };
    } else if (chipEl && container) {
      // First pickup from the rail: the chip is in normal flow.
      // Convert its viewport rect to container-relative so we can place the
      // absolute chip exactly where the inline chip was visually.
      const chipRect = chipEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const initialX = chipRect.left - containerRect.left;
      const initialY = chipRect.top - containerRect.top;
      // dragOffset: where inside the chip the pointer landed (viewport-space
      // delta; containerRect will be subtracted in pointermove, so keeping
      // this as a raw pixel offset from chip origin works correctly).
      dragOffset.current = {
        x: e.clientX - chipRect.left,
        y: e.clientY - chipRect.top,
      };
      // Snap into absolute position before we switch render mode.
      setChipPos((prev) => ({ ...prev, [id]: { x: initialX, y: initialY } }));
    }

    setDraggingId(id);
  }

  function setChipRef(id: DropZoneId, el: HTMLDivElement | null) {
    chipRefs.current[id] = el;
  }

  // ── Checking / scoring ───────────────────────────────────────────────────
  // Both chip and target getBoundingClientRect() calls return viewport-relative
  // rects, so overlap detection is coordinate-space agnostic — it works the
  // same regardless of how we store the chip's position internally.
  function rectsOverlap(a: DOMRect, b: DOMRect) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }

  function handleCheck() {
    const newResults: Record<DropZoneId, boolean> = {
      countdown: false,
      preselect: false,
      trick_question: false,
      hidden_costs: false,
      social_proof: false,
      roach_motel: false,
    };

    for (const id of DROP_ZONE_ORDER) {
      const chipEl = chipRefs.current[id];
      const targetEl = targetRefs.current[id];
      if (!chipEl || !targetEl) { newResults[id] = false; continue; }
      newResults[id] = rectsOverlap(
        chipEl.getBoundingClientRect(),
        targetEl.getBoundingClientRect()
      );
    }

    setResults(newResults);
    setShowResult(true);
    setTimeout(() => {
      const el = resultRef.current;
      if (!el) return;

      const headerOffset = 80; // ggf. an deine Navbar-Höhe anpassen
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: "smooth",
      });
    }, 100);
  }

  function resetQuiz() {
    setChipPos({
      countdown: null,
      preselect: null,
      trick_question: null,
      hidden_costs: null,
      social_proof: null,
      roach_motel: null,
    });
    setResults(null);
    setShowResult(false);
    setDraggingId(null);
  }

  const allPlaced = DROP_ZONE_ORDER.every((id) => chipPos[id] !== null);

  return (
    <div className="min-h-screen text-white font-sans py-10 px-4 md:px-6 flex flex-col items-center">
      {/* Heading */}
      <div className="w-full mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="bg-amber-400 text-black text-[11px] font-black px-2 py-1 rounded uppercase tracking-widest">
            Dark Pattern Check
          </span>
          <span className="text-gray-500 text-xs">Interaktive Übung</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">
          Findest du die 6 Dark Patterns?
        </h1>
        <p className="text-gray-400 text-sm mt-1 max-w-2xl">
          Ziehe die Begriffe links auf die Stelle der Seite, an der dieses Muster
          eingesetzt wird. Wenn du fertig bist, klicke auf „Überprüfen", um die
          Auflösung zu sehen.
        </p>
      </div>

      {/*
        ── Drag container ────────────────────────────────────────────────────
        position:relative establishes the coordinate system for all placed chips.
        The left rail AND the framed infographic are both children, so an
        absolute-positioned chip can visually overlap either one correctly.
        Chips placed here use left/top in container-relative pixels.
      */}
      <div
        ref={dragContainerRef}
        className="relative w-full flex flex-col md:flex-row gap-6 items-start"
      >
        {/* ── Left rail: draggable terms ─────────────── */}
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-3 md:sticky md:top-10">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Dark Patterns ({DROP_ZONE_ORDER.filter((id) => chipPos[id] !== null).length}/{DROP_ZONE_ORDER.length})
          </p>

          {DROP_ZONE_ORDER.map((id) => {
            const hasPos = chipPos[id] !== null;
            if (hasPos) {
              // Ghost slot — keeps the rail height stable after chip is lifted.
              return (
                <div
                  key={id}
                  className="h-[58px] rounded-lg border border-dashed border-gray-800 bg-gray-950/40"
                />
              );
            }
            return (
              <DragChip
                key={id}
                id={id}
                pos={null}
                isDragging={draggingId === id}
                resultState="none"
                onPointerDown={handlePointerDown}
                registerRef={setChipRef}
              />
            );
          })}

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={!allPlaced || showResult}
            className={`mt-2 w-full font-bold py-3 rounded-lg text-sm transition-colors ${allPlaced && !showResult
                ? "bg-amber-400 text-black hover:bg-amber-300"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
          >
            {showResult ? "Überprüft" : "Überprüfen"}
          </button>
          {!allPlaced && (
            <p className="text-gray-600 text-[10px] leading-relaxed">
              Platziere alle 6 Begriffe irgendwo auf der Seite, bevor du überprüfst.
            </p>
          )}
          {showResult && (
            <button
              onClick={resetQuiz}
              className="text-xs font-semibold text-emerald-300 border border-emerald-700 rounded px-3 py-2 hover:bg-emerald-900/40 transition-colors"
            >
              Nochmal versuchen
            </button>
          )}
        </div>

        {/* ── Framed infographic ──────────────────────── */}
        <div className="relative flex-1 w-full rounded-2xl border-2 border-white/15 bg-black overflow-hidden shadow-2xl">
          <div className="relative bg-black text-white font-sans">
            {/* ── Toasts ─────────────────────────────────── */}
            {toastKind === "roach" && (
              <div
                style={{ zIndex: 998 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70 p-4"
              >
                <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-sm w-full p-6">
                  <h3 className="text-white font-bold text-lg mb-2">Abo kündigen</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Eine Kündigung ist ausschließlich{" "}
                    <strong className="text-white">schriftlich per Brief</strong> möglich an:
                    <br /><br />
                    <span className="text-gray-300 text-xs leading-relaxed">
                      Streamly GmbH, Postfach 4711, 20095 Hamburg
                      <br />
                      Bitte 8 Wochen Kündigungsfrist einhalten.
                      <br />
                      Kündigungen per E-Mail oder App werden nicht akzeptiert.
                    </span>
                  </p>
                  <button
                    onClick={() => { setCancelStep(0); setToastKind(null); }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            )}

            {toastKind === "confirm_cancel" && (
              <div
                style={{ zIndex: 998 }}
                className="absolute inset-0 flex items-center justify-center bg-black/70 p-4"
              >
                <div className="bg-gray-900 border-2 border-white/15 rounded-2xl max-w-sm w-full p-6 text-center">
                  <h3 className="text-white font-bold text-lg mb-2">Willkommen bei Streamly!</h3>
                  <p className="text-gray-400 text-sm mb-1">
                    Du hast <strong className="text-white">{planDetails[plan].label}</strong> abonniert.
                  </p>
                  <p className="text-gray-500 text-xs mb-4">
                    Nach dem 1. Monat (€2,99) wird automatisch{" "}
                    <strong className="text-white">{planDetails[plan].price}</strong> abgerechnet.
                  </p>
                  <button
                    onClick={() => setToastKind(null)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            )}

            {/* ── Flash Banner ────────────────────────────── */}
            {bannerVisible && (
              <div className="relative bg-red-700 flex items-center justify-center gap-4 px-4 py-2.5 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <strong>Blitzangebot endet in</strong>
                </span>
                <span className="bg-black text-white font-mono font-bold px-3 py-0.5 rounded">
                  {mm}:{ss}
                </span>
                <span>— Premium für nur <strong>€2,99</strong> im ersten Monat</span>
                <TargetZone
                  id="countdown"
                  reveal={showResult}
                  isHit={!!results?.countdown}
                  registerRef={registerTargetRef}
                  className="-inset-2 left-1/2 -translate-x-1/2"
                />
              </div>
            )}

            {/* ── Navbar ──────────────────────────────────── */}
            <nav className="flex items-center gap-6 px-8 py-4 border-b border-white/10">
              <span className="text-red-500 font-black text-xl tracking-widest">STREAMLY</span>
              <div className="flex gap-5 text-sm text-gray-300 ml-4">
                {["Startseite", "Serien", "Filme", "Neu & Beliebt", "Meine Liste"].map((l) => (
                  <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Suchen"
                  className="bg-black/60 border border-white/20 text-white text-sm px-3 py-1.5 rounded outline-none w-36 placeholder:text-gray-500"
                />
                <span className="text-gray-400 text-lg cursor-pointer hover:text-white">🔔</span>
                <div className="w-8 h-8 bg-red-600 rounded font-bold text-sm flex items-center justify-center cursor-pointer">M</div>
              </div>
            </nav>

            <div className="flex gap-0">
              {/* ── Main Content ─────────────────────────── */}
              <main className="flex-1 min-w-0">
                {/* Hero */}
                <div className="relative px-8 py-10 bg-gradient-to-br from-gray-900 via-black to-black overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                  <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-purple-950 to-indigo-950 opacity-40" />
                  <div className="relative z-20">
                    <div className="relative inline-block mb-3">
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        ▶ #1 IN DEUTSCHLAND HEUTE
                      </span>
                      <TargetZone
                        id="social_proof"
                        reveal={showResult}
                        isHit={!!results?.social_proof}
                        registerRef={registerTargetRef}
                        className="-inset-4"
                      />
                    </div>
                    <h1 className="text-7xl font-black leading-none tracking-tight">
                      DARK<br /><span className="text-red-500">HORIZONS</span>
                    </h1>
                    <div className="flex items-center gap-3 mt-4 text-sm">
                      <span className="text-green-400 font-semibold">97% Treffer</span>
                      <span className="text-gray-400">2024</span>
                      <span className="border border-gray-500 text-gray-400 px-1.5 py-0.5 rounded text-xs">16+</span>
                      <span className="text-gray-400">4 Staffeln</span>
                      <span className="border border-gray-500 text-gray-400 px-1.5 py-0.5 rounded text-xs">4K</span>
                    </div>
                    <p className="text-gray-300 text-sm max-w-sm mt-3 leading-relaxed">
                      Eine packende Thrillerserie über Manipulation, Täuschung und die Menschen, die
                      aufdecken was hinter glänzenden Oberflächen verborgen liegt.
                    </p>
                    <div className="flex gap-3 mt-5">
                      <button className="bg-white text-black font-semibold px-6 py-2.5 rounded text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                        ▶ Abspielen
                      </button>
                      <button className="bg-gray-700/80 text-white font-semibold px-5 py-2.5 rounded text-sm hover:bg-gray-600 transition-colors flex items-center gap-2">
                        ⓘ Mehr Infos
                      </button>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      {["Thriller", "Drama", "Psychologie", "Preisgekrönt"].map((t) => (
                        <span key={t} className="border border-gray-600 text-gray-400 text-xs px-2.5 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top 10 Row */}
                <section className="px-8 py-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-base">Top 10 in Deutschland heute</h2>
                    <span className="text-red-400 text-sm cursor-pointer hover:text-red-300">Alle ansehen ›</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
                    {TOP10.map((item, i) => (
                      <ContentCard
                        key={item.title}
                        title={item.title}
                        genre={item.genre}
                        rank={i + 1}
                        match={item.match}
                        badge={item.badge}
                        colorClass={CARD_COLORS[i]}
                      />
                    ))}
                  </div>
                </section>
              </main>

              {/* ── Signup Sidebar ───────────────────────── */}
              <aside className="w-80 flex-shrink-0 bg-gradient-to-b from-gray-950 to-black border-l border-white/10 p-5 flex flex-col gap-4">
                <div>
                  <p className="text-red-400 text-xs font-bold tracking-widest uppercase">STREAMLY</p>
                  <h2 className="text-2xl font-black mt-1">Mitglied werden</h2>
                  <p className="text-gray-400 text-xs mt-1">Unbegrenzt streamen. Jederzeit kündbar.*</p>
                </div>

                {/* Plan Selector */}
                <div className="relative">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Wähle deinen Plan</p>
                  {(["ultra", "standard", "basis"] as Plan[]).map((p) => {
                    const d = planDetails[p];
                    const selected = plan === p;
                    return (
                      <div
                        key={p}
                        onClick={() => setPlan(p)}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer mb-2 transition-colors ${selected ? "border-red-500 bg-gray-800" : "border-gray-700 hover:border-gray-500"
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selected ? "border-red-500 bg-red-500" : "border-gray-600"}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className="text-white text-sm font-semibold truncate">{d.label}</p>
                            {p === "ultra" && (
                              <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">EMPFOHLEN</span>
                            )}
                          </div>
                          <p className="text-gray-500 text-[10px]">{d.desc}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-white text-sm font-bold">{d.price}</p>
                          {d.strikethrough && <p className="text-gray-600 text-[10px] line-through">{d.strikethrough}</p>}
                        </div>
                      </div>
                    );
                  })}
                  <TargetZone
                    id="preselect"
                    reveal={showResult}
                    isHit={!!results?.preselect}
                    registerRef={registerTargetRef}
                    className="-inset-2"
                  />
                </div>
                {/* Consents */}
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Einstellungen</p>
                  <label className="flex items-start gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={consent1} onChange={(e) => setConsent1(e.target.checked)} className="mt-0.5 accent-red-500" />
                    <span className="text-gray-300 text-xs leading-snug">
                      Ja, ich möchte personalisierte Angebote und den wöchentlichen Streamly-Newsletter per E-Mail erhalten.
                    </span>
                  </label>
                  <label className="flex items-start gap-2 mb-2 cursor-pointer">
                    <input type="checkbox" checked={consent2} onChange={(e) => setConsent2(e.target.checked)} className="mt-0.5 accent-red-500" />
                    <span className="text-gray-300 text-xs leading-snug">
                      Ich stimme zu, dass meine Nutzungsdaten für personalisierte Werbung an Partner weitergegeben werden dürfen.
                    </span>
                  </label>
                  <label className="relative flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={consent3} onChange={(e) => setConsent3(e.target.checked)} className="mt-0.5 accent-red-500" />
                    <span className="text-gray-600 text-[10px] leading-snug">
                      Ich möchte nicht, dass ich keine Marketingkommunikation erhalte
                    </span>
                    <TargetZone
                      id="trick_question"
                      reveal={showResult}
                      isHit={!!results?.trick_question}
                      registerRef={registerTargetRef}
                      className="-inset-4"
                    />
                  </label>
                </div>

                {/* Fine print */}
                <div className="relative bg-gray-900 rounded-lg p-3">
                  <p className="text-gray-600 text-[9px] leading-relaxed">
                    *Nach dem Aktionszeitraum von 30 Tagen (€2,99) verlängert sich das Abonnement
                    automatisch zum gewählten Vollpreis (derzeit{" "}
                    <strong className="text-gray-500">{planDetails[plan].price}</strong>
                    ). Eine Kündigung ist ausschließlich schriftlich per Einschreiben an Streamly GmbH,
                    Postfach 4711, 20095 Hamburg möglich, unter Einhaltung einer Kündigungsfrist von 8
                    Wochen zum Monatsende. Preisänderungen vorbehalten.{" "}
                    <span className="text-red-800">AGB</span> und{" "}
                    <span className="text-red-800">Datenschutz</span>.
                  </p>
                  <TargetZone
                    id="hidden_costs"
                    reveal={showResult}
                    isHit={!!results?.hidden_costs}
                    registerRef={registerTargetRef}
                    className="-inset-1"
                  />
                </div>

                {/* CTA */}
                <button
                  onClick={handleSubscribe}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-sm"
                >
                  Jetzt starten — nur €2,99 im 1. Monat
                </button>

                {/* Confirm shaming */}
                <div className="relative text-center">
                  <button
                    onClick={handleCancel}
                    className="text-gray-600 text-[10px] hover:text-gray-400 transition-colors underline underline-offset-2"
                  >
                    Nein danke, ich verzichte auf unbegrenztes Streaming
                  </button>
                  <TargetZone
                    id="roach_motel"
                    reveal={showResult}
                    isHit={!!results?.roach_motel}
                    registerRef={registerTargetRef}
                    className="-inset-2"
                  />
                </div>
              </aside>
            </div>
          </div>
        </div>

        {/*
          ── Placed chips rendered as absolute children of the drag container ──
          position:absolute + left/top in container-relative coords means these
          chips can float over both the rail and the infographic without any
          viewport-scroll dependency.
        */}
        {DROP_ZONE_ORDER.map((id) =>
          chipPos[id] ? (
            <DragChip
              key={id}
              id={id}
              pos={chipPos[id]}
              isDragging={draggingId === id}
              resultState={showResult ? (results?.[id] ? "correct" : "wrong") : "none"}
              onPointerDown={handlePointerDown}
              registerRef={setChipRef}
            />
          ) : null
        )}
      </div>

      {/* ── Resolution ─────────────────────────────────── */}
      {showResult && (
        <div ref={resultRef} className="w-full mt-10 pt-2">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-400 text-black text-[11px] font-black px-2 py-1 rounded uppercase tracking-widest">
              Auflösung
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              So manipuliert Streamly dich
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DROP_ZONE_ORDER.map((id) => {
              const isCorrect = !!results?.[id];
              return (
                <div
                  key={id}
                  className={`rounded-xl border p-4 ${isCorrect ? "border-emerald-700 bg-emerald-950/30" : "border-rose-700 bg-rose-950/30"
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-sm ${isCorrect ? "text-emerald-400" : "text-rose-400"}`}>
                      {isCorrect ? "✓" : "✗"}
                    </span>
                    <p className="text-white font-bold text-sm">{DARK_PATTERNS[id].name}</p>
                  </div>
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2">
                    {DARK_PATTERNS[id].category}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed">{DARK_PATTERNS[id].description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6">
            <p className="text-gray-300 text-sm font-semibold mb-2">
              {DROP_ZONE_ORDER.filter((id) => results?.[id]).length} von {DROP_ZONE_ORDER.length} richtig zugeordnet
            </p>
            <button
              onClick={resetQuiz}
              className="text-xs font-semibold text-emerald-300 border border-emerald-700 rounded px-4 py-2 hover:bg-emerald-900/40 transition-colors"
            >
              Nochmal versuchen
            </button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hidden { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}