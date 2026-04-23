import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Textblock from "@/components/Textblock";
import Image from "next/image";

// Folie Session 06, 41: Beispiel mit refs zum Scrollen zu ...


export default function Home() {
  return (
    <div>
      <header className="fixed w-full z-50">
        <Header />
      </header>
      <section>
        <Hero />
      </section>
      <section>
        <Textblock>Test</Textblock>
        <Textblock>Hallo</Textblock>
      </section>
    </div>
  );
}
