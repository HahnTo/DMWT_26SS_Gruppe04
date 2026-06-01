"use client";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Plan = "ultra" | "standard" | "basis";
type ToastKind = "roach" | "confirm_cancel" | "bonus" | null;

interface DarkPatternInfo {
  name: string;
  category: string;
  description: string;
}

const DARK_PATTERNS: Record<string, DarkPatternInfo> = {
  countdown: {
    name: "Countdown Timer / False Urgency",
    category: "Dringlichkeitstrick",
    description:
      "Ein Countdown suggeriert, das Angebot laufe gleich ab – oft wird er aber einfach neu gestartet oder das Angebot ist dauerhaft verfügbar. Ziel: impulsive Kaufentscheidung provozieren.",
  },
  preselect: {
    name: "Preselection / Vorauswahl",
    category: "Täuschende Voreinstellung",
    description:
      "Der teuerste Plan ist vorausgewählt. Günstigere Alternativen erfordern aktives Umschalten – viele Nutzer:innen übernehmen die Voreinstellung unreflektiert.",
  },
  confirm_shaming: {
    name: "Confirmshaming",
    category: "Psychologische Manipulation",
    description:
      'Der Ablehnungslink ist beschämend formuliert: „Nein danke, ich verzichte auf unbegrenztes Streaming" erzeugt Scham und soll von der Ablehnung abhalten.',
  },
  roach_motel: {
    name: "Roach Motel",
    category: "Erschwerter Ausstieg",
    description:
      "Das Abo ist leicht abzuschließen, aber die Kündigung erfordert einen Brief – absichtlich bürokratisch, um Abbrüche zu verhindern.",
  },
  hidden_consent: {
    name: "Hidden Consent / Versteckte Einwilligung",
    category: "Verschleierte Zustimmung",
    description:
      "Zwei Checkboxen sind vorausgewählt (Werbe-E-Mails & Datenweitergabe an Partner). Die Opt-out-Box dagegen ist deaktiviert und kaum lesbar gesetzt.",
  },
  trick_question: {
    name: "Trick Question",
    category: "Verwirrende Formulierung",
    description:
      "Die Opt-out-Box 'Ich möchte keine Marketingkommunikation erhalten' ist doppelt negativ. Wer sie ankreuzt, denkt er lehnt ab – wählt aber tatsächlich aus, keine Abmeldung zu wünschen.",
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
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const TOP10 = [
  { title: "Dark Horizons", genre: "Thriller", seasons: 4, match: 98, badge: "" },
  { title: "Nachtschatten", genre: "Krimi", seasons: 2, match: 95, badge: "NEU" },
  { title: "Deep Signal", genre: "Sci-Fi", seasons: 1, match: 91, badge: "" },
  { title: "Schlüsselzeuge", genre: "Drama", seasons: 3, match: 89, badge: "" },
  { title: "Zero Hour", genre: "Action", seasons: 2, match: 86, badge: "" },
  { title: "Codex", genre: "Mystery", seasons: 2, match: 84, badge: "ORIGINAL" },
];

const TRENDING = [
  { title: "Stadtlicht", genre: "Drama", year: 2024, badge: "" },
  { title: "Voltage", genre: "Thriller", year: 2023, badge: "EXKLUSIV" },
  { title: "Spektakel", genre: "Komödie", year: 2024, badge: "" },
  { title: "Orakel", genre: "Fantasy", year: 2024, badge: "" },
  { title: "Oberhalb", genre: "Sci-Fi", year: 2023, badge: "" },
  { title: "Grüne Stille", genre: "Drama", year: 2024, badge: "" },
];

const CARD_COLORS = [
  "from-purple-900 to-indigo-900",
  "from-slate-800 to-blue-900",
  "from-teal-900 to-cyan-900",
  "from-rose-900 to-pink-900",
  "from-gray-800 to-slate-700",
  "from-green-900 to-emerald-800",
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function Tooltip({
  id,
  active,
  onClose,
}: {
  id: string;
  active: boolean;
  onClose: () => void;
}) {
  const info = DARK_PATTERNS[id];
  if (!info || !active) return null;
  return (
    <div
      style={{ zIndex: 999 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-red-500 rounded-xl max-w-md w-full p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
              ⚠ Dark Pattern erkannt
            </span>
            <h3 className="text-white font-bold text-lg mt-1">{info.name}</h3>
            <span className="text-gray-400 text-xs">{info.category}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none mt-1"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{info.description}</p>
      </div>
    </div>
  );
}

function DPBadge({ id, onShow }: { id: string; onShow: (id: string) => void }) {
  return (
    <button
      onClick={() => onShow(id)}
      title="Dark Pattern anzeigen"
      className="inline-flex items-center gap-1 bg-red-900/70 border border-red-500 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full hover:bg-red-800 transition-colors ml-2 cursor-pointer"
    >
      ⚠ DP
    </button>
  );
}

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
      <div
        className={`bg-gradient-to-br ${colorClass} h-24 flex items-center justify-center`}
      >
        <span className="text-white/40 text-3xl font-black">{rank ?? "▶"}</span>
      </div>
      {badge && (
        <span
          className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded ${
            badge === "ORIGINAL"
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
        {match && (
          <p className="text-green-400 text-[10px] font-semibold">{match}% Treffer</p>
        )}
        <p className="text-white text-xs font-semibold truncate">{title}</p>
        <p className="text-gray-500 text-[10px]">{genre}</p>
      </div>
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
  const [activeDP, setActiveDP] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<ToastKind>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [cancelStep, setCancelStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  function showDP(id: string) {
    setActiveDP(id);
  }

  function handleCancel() {
    if (cancelStep === 0) {
      setCancelStep(1);
      setToastKind("roach");
    }
  }

  function handleSubscribe() {
    setToastKind("confirm_cancel");
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* ── Tooltip overlay ────────────────────────────── */}
      <Tooltip id={activeDP ?? ""} active={!!activeDP} onClose={() => setActiveDP(null)} />

      {/* ── Roach Motel Toast ──────────────────────────── */}
      {toastKind === "roach" && (
        <div
          style={{ zIndex: 998 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-white font-bold text-lg mb-2">Abo kündigen</h3>
            <p className="text-gray-400 text-sm mb-4">
              Eine Kündigung ist ausschließlich{" "}
              <strong className="text-white">schriftlich per Brief</strong> möglich an:
              <br />
              <br />
              <span className="text-gray-300 text-xs leading-relaxed">
                Streamly GmbH, Postfach 4711, 20095 Hamburg
                <br />
                Bitte 8 Wochen Kündigungsfrist einhalten.
                <br />
                Kündigungen per E-Mail oder App werden nicht akzeptiert.
              </span>
            </p>
            <div className="flex items-center gap-1 mb-4">
              <DPBadge id="roach_motel" onShow={showDP} />
              <span className="text-red-300 text-[10px]">Roach Motel</span>
            </div>
            <button
              onClick={() => { setCancelStep(0); setToastKind(null); }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* ── Success Toast ──────────────────────────────── */}
      {toastKind === "confirm_cancel" && (
        <div
          style={{ zIndex: 998 }}
          className="fixed inset-0 flex items-center justify-center bg-black/70 p-4"
        >
          <div className="bg-gray-900 border border-green-700 rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-white font-bold text-lg mb-2">Willkommen bei Streamly!</h3>
            <p className="text-gray-400 text-sm mb-1">
              Du hast <strong className="text-white">{planDetails[plan].label}</strong> abonniert.
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Nach dem 1. Monat (€2,99) wird automatisch{" "}
              <strong className="text-white">{planDetails[plan].price}</strong> abgerechnet.
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              <DPBadge id="hidden_costs" onShow={showDP} />
              <span className="text-red-300 text-[10px]">Hidden Costs</span>
            </div>
            <button
              onClick={() => setToastKind(null)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* ── Flash Banner ───────────────────────────────── */}
      {bannerVisible && (
        <div className="relative bg-red-700 flex items-center justify-center gap-4 px-4 py-2.5 text-sm font-medium">
          <span className="flex items-center gap-2">
            ⚡ <strong>Blitzangebot endet in</strong>
          </span>
          <span
            className="bg-black text-white font-mono font-bold px-3 py-0.5 rounded cursor-pointer"
            onClick={() => showDP("countdown")}
          >
            {mm}:{ss}
          </span>
          <span>— Premium für nur <strong>€2,99</strong> im ersten Monat</span>
          <DPBadge id="countdown" onShow={showDP} />
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-3 text-white/60 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="flex items-center gap-6 px-8 py-4 border-b border-white/10">
        <span className="text-red-500 font-black text-xl tracking-widest">STREAMLY</span>
        <div className="flex gap-5 text-sm text-gray-300 ml-4">
          {["Startseite", "Serien", "Filme", "Neu & Beliebt", "Meine Liste"].map((l) => (
            <span key={l} className="hover:text-white cursor-pointer transition-colors">
              {l}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Suchen"
            className="bg-black/60 border border-white/20 text-white text-sm px-3 py-1.5 rounded outline-none w-36 focus:w-48 transition-all placeholder:text-gray-500"
          />
          <span className="text-gray-400 text-lg cursor-pointer hover:text-white">🔔</span>
          <div className="w-8 h-8 bg-red-600 rounded font-bold text-sm flex items-center justify-center cursor-pointer">
            M
          </div>
        </div>
      </nav>

      <div className="flex gap-0">
        {/* ── Main Content ─────────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="relative px-8 py-10 bg-gradient-to-br from-gray-900 via-black to-black overflow-hidden">
            {/* Fake movie poster bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-br from-purple-950 to-indigo-950 opacity-40" />

            <div className="relative z-20">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  ▶ #1 IN DEUTSCHLAND HEUTE
                </span>
                <DPBadge id="social_proof" onShow={showDP} />
              </div>

              <h1 className="text-7xl font-black leading-none tracking-tight">
                DARK
                <br />
                <span className="text-red-500">HORIZONS</span>
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
                  <span
                    key={t}
                    className="border border-gray-600 text-gray-400 text-xs px-2.5 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Top 10 Row */}
          <section className="px-8 py-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base">Top 10 in Deutschland heute</h2>
              <span className="text-red-400 text-sm cursor-pointer hover:text-red-300">
                Alle ansehen ›
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
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

          {/* Trending Row */}
          <section className="px-8 py-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base">Trending diese Woche</h2>
              <span className="text-red-400 text-sm cursor-pointer hover:text-red-300">
                Alle ansehen ›
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {TRENDING.map((item, i) => (
                <ContentCard
                  key={item.title}
                  title={item.title}
                  genre={`${item.genre} · ${item.year}`}
                  badge={item.badge}
                  colorClass={CARD_COLORS[(i + 2) % 6]}
                />
              ))}
            </div>
          </section>
        </main>

        {/* ── Signup Sidebar ───────────────────────────── */}
        <aside className="w-80 flex-shrink-0 bg-gradient-to-b from-gray-950 to-black border-l border-white/10 p-5 flex flex-col gap-4 sticky top-0 h-screen overflow-y-auto">
          <div>
            <p className="text-red-400 text-xs font-bold tracking-widest uppercase">
              STREAMLY
            </p>
            <h2 className="text-2xl font-black mt-1">Mitglied werden</h2>
            <p className="text-gray-400 text-xs mt-1">Unbegrenzt streamen. Jederzeit kündbar.*</p>
          </div>

          {/* Plan Selector */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Wähle deinen Plan
              </p>
              <DPBadge id="preselect" onShow={showDP} />
            </div>

            {(["ultra", "standard", "basis"] as Plan[]).map((p) => {
              const d = planDetails[p];
              const selected = plan === p;
              return (
                <div
                  key={p}
                  onClick={() => setPlan(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer mb-2 transition-colors ${
                    selected
                      ? "border-red-500 bg-gray-800"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      selected ? "border-red-500 bg-red-500" : "border-gray-600"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p className="text-white text-sm font-semibold truncate">{d.label}</p>
                      {p === "ultra" && (
                        <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                          EMPFOHLEN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-[10px]">{d.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-bold">{d.price}</p>
                    {d.strikethrough && (
                      <p className="text-gray-600 text-[10px] line-through">{d.strikethrough}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consents */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                Einstellungen
              </p>
              <DPBadge id="hidden_consent" onShow={showDP} />
            </div>

            <label className="flex items-start gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent1}
                onChange={(e) => setConsent1(e.target.checked)}
                className="mt-0.5 accent-red-500"
              />
              <span className="text-gray-300 text-xs leading-snug">
                Ja, ich möchte personalisierte Angebote und den wöchentlichen Streamly-Newsletter
                per E-Mail erhalten.
              </span>
            </label>

            <label className="flex items-start gap-2 mb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={consent2}
                onChange={(e) => setConsent2(e.target.checked)}
                className="mt-0.5 accent-red-500"
              />
              <span className="text-gray-300 text-xs leading-snug">
                Ich stimme zu, dass meine Nutzungsdaten für personalisierte Werbung an Partner
                weitergegeben werden dürfen.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer" onClick={() => showDP("trick_question")}>
              <input
                type="checkbox"
                checked={consent3}
                onChange={(e) => setConsent3(e.target.checked)}
                className="mt-0.5 accent-red-500"
              />
              <div>
                <span className="text-gray-600 text-[10px] leading-snug">
                  Ich möchte keine Marketingkommunikation erhalten (Opt-out)
                </span>
                <DPBadge id="trick_question" onShow={showDP} />
              </div>
            </label>
          </div>

          {/* Fine print */}
          <div className="bg-gray-900 rounded-lg p-3">
            <p className="text-gray-600 text-[9px] leading-relaxed">
              *Nach dem Aktionszeitraum von 30 Tagen (€2,99) verlängert sich das Abonnement
              automatisch zum gewählten Vollpreis (derzeit{" "}
              <strong className="text-gray-500">{planDetails[plan].price}</strong>
              ). Eine Kündigung ist ausschließlich schriftlich per Einschreiben an Streamly GmbH,
              Postfach 4711, 20095 Hamburg möglich, unter Einhaltung einer Kündigungsfrist von 8
              Wochen zum Monatsende. Preisänderungen vorbehalten.{" "}
              <span className="text-red-800">AGB</span> und{" "}
              <span className="text-red-800">Datenschutz</span>.
              <DPBadge id="hidden_costs" onShow={showDP} />
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleSubscribe}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            Jetzt starten — nur €2,99 im 1. Monat
          </button>

          {/* Confirm shaming */}
          <div className="text-center">
            <button
              onClick={handleCancel}
              className="text-gray-600 text-[10px] hover:text-gray-400 transition-colors underline underline-offset-2"
            >
              Nein danke, ich verzichte auf unbegrenztes Streaming
            </button>
            <div className="flex items-center justify-center gap-1 mt-1">
              <DPBadge id="confirm_shaming" onShow={showDP} />
              <span className="text-red-300 text-[9px]">Confirmshaming</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Legend Bar ───────────────────────────────────── */}
      <div className="bg-gray-950 border-t border-white/10 px-8 py-4">
        <p className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wider">
          ⚠ Erkannte Dark Patterns – klicke auf ein Badge zum Erklären
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(DARK_PATTERNS).map(([id, info]) => (
            <button
              key={id}
              onClick={() => showDP(id)}
              className="flex items-center gap-1.5 bg-gray-900 border border-red-900 hover:border-red-500 text-gray-300 text-xs px-3 py-1.5 rounded-full transition-colors"
            >
              <span className="text-red-400">⚠</span>
              <span>{info.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}