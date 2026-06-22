export default function ConcludingSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mt-4 mb-6">
          Jetzt bist du dran
        </h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
          Dark Patterns sind kein Randphänomen – sie prägen täglich unsere digitalen Erfahrungen.
          Wer sie kennt, kann bewusster entscheiden und sich besser schützen.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur">
          <div>
            <h3 className="font-semibold text-xl mb-2">Bewusst surfen</h3>
            <p className="text-gray-300">
              Erkenne Muster im Alltag und hinterfrage, was dich zu einer Entscheidung drängt.
              Dein nächstes Cookie-Banner, dein nächster Checkout – schau genau hin.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur">
          <div>
            <h3 className="font-semibold text-xl mb-2">Weitersagen</h3>
            <p className="text-gray-300">
              Aufklärung schützt – sprich mit anderen über manipulative Designpraktiken.
              Je mehr Menschen Dark Patterns erkennen, desto weniger wirksam werden sie.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur">
          <div>
            <h3 className="font-semibold text-xl mb-2">Mitmachen</h3>
            <p className="text-gray-300">
              Nutze das Forum und teile eigene Beispiele aus deinem digitalen Alltag.
              Gemeinsam bauen wir eine Sammlung, die anderen hilft, wachsam zu bleiben.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
