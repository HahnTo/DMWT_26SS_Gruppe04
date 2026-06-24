
import { ChevronDown } from "lucide-react";

export default function IntroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="text-center mb-8">

        <h2 className="text-5xl font-bold mt-4 mb-6">
          Was sind Dark Patterns?
        </h2>

        <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
          Dark Patterns sind gezielte Designtricks, die Nutzer zu Handlungen
          bewegen sollen, die sie eigentlich nicht geplant hatten.
          Sie begegnen uns täglich - beim Online-Shopping,
          in Apps und auf Social-Media-Plattformen.
        </p>
      </div>

      <div className="grid text-center md:grid-cols-3 gap-20 mb-8">

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white/10">
          <h3 className="font-semibold text-xl mb-3">
            Manipulation
          </h3>
          <p className="text-gray-300">
            Nutzer werden gezielt in eine bestimmte Richtung gelenkt.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white/10">
          <h3 className="font-semibold text-xl mb-3">
            Oft unsichtbar
          </h3>
          <p className="text-gray-300">
            Viele Muster wirken auf den ersten Blick harmlos.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur transition-all duration-300 hover:scale-110 hover:bg-white/10">
          <h3 className="font-semibold text-xl mb-3">
            Überall vorhanden
          </h3>
          <p className="text-gray-300">
            Von Cookie-Bannern bis zu Streaming-Abos.
          </p>
        </div>

      </div>

      {/* Scroll animation, dass man weiß das es weiter geht*/}
      <div className="flex flex-col items-center gap-2 mt-20 text-white/50">
        <span className="text-xl tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-10 h-10 animate-bounce" />
      </div>
    </section>
  );
}