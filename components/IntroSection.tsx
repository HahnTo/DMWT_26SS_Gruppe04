

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

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur">
          <h3 className="font-semibold text-xl mb-3">
            Manipulation
          </h3>
          <p className="text-gray-300">
            Nutzer werden gezielt in eine bestimmte Richtung gelenkt.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur">
          <h3 className="font-semibold text-xl mb-3">
            Oft unsichtbar
          </h3>
          <p className="text-gray-300">
            Viele Muster wirken auf den ersten Blick harmlos.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur">
          <h3 className="font-semibold text-xl mb-3">
            Überall vorhanden
          </h3>
          <p className="text-gray-300">
            Von Cookie-Bannern bis zu Streaming-Abos.
          </p>
        </div>

      </div>
    </section>
  );
}