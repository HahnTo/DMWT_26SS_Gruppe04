"use client";

import { Eye, Share2, Users, ArrowRight } from "lucide-react";

export default function ConcludingSection() {

  const scrollToForum = () => {
    document.getElementById("forum")?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mt-4 mb-6">
          Jetzt bist du dran
        </h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
          Dark Patterns sind kein Randphänomen, sie prägen täglich unsere digitalen Erfahrungen.
          Wer sie kennt, kann bewusster entscheiden und sich besser schützen.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        <div className="group flex items-center gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20">
          <Eye className="shrink-0 w-10 h-10 text-[#B79864] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Bewusst surfen</h3>
            <p className="text-gray-300">
              Erkenne Muster im Alltag und hinterfrage, was dich zu einer Entscheidung drängt.
              Dein nächstes Cookie-Banner, dein nächster Checkout. Schau genau hin!
            </p>
          </div>
        </div>

        <div className="group flex items-center gap-5 p-6 rounded-2xl bg-white/5 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-white/20">
          <Share2 className="shrink-0 w-10 h-10 text-[#B79864] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div>
            <h3 className="font-semibold text-xl mb-2">Weiterleiten</h3>
            <p className="text-gray-300">
              Aufklärung schützt. Sprich mit anderen über manipulative Designpraktiken.
              Je mehr Menschen Dark Patterns erkennen, desto weniger wirksam werden sie.
            </p>
          </div>
        </div>

        <div
          onClick={scrollToForum}
          className="group flex items-center gap-5 p-6 rounded-2xl bg-[#B79864]/5 backdrop-blur border border-[#B79864]/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-[#B79864]/15 hover:border-[#B79864]"
        >
          <Users className="shrink-0 w-10 h-10 text-[#B79864] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-2 text-[#B79864]">Unterstützen</h3>
            <p className="text-gray-300">
              Nutze das Forum und teile eigene Beispiele aus deinem digitalen Alltag.
              Gemeinsam bauen wir eine Sammlung, die anderen hilft, wachsam zu bleiben.
            </p>
          </div>
          <ArrowRight className="shrink-0 w-6 h-6 text-[#B79864] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </div>

      </div>
    </section>
  );
}
