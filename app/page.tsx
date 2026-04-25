import Card from "@/components/Card";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
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
      <section>
        <HorizontalScrollSection>
          <Card
            title="Nagging"
            img="/images/Nagging1.png"
          >
            <Textblock>
              Nagging ist ein Dark Pattern, bei dem der Nutzer wiederholt und aufdringlich zu bestimmten Sachen befragt wird.
              Beispiele sind:
              <li>
                <ul>Coockie-Banner</ul>
                <ul>Push-Benachrichtigung aktivieren</ul>
                <ul>Kostenpflichtige Version abonnieren</ul>
              </li>
            </Textblock>
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
      </section>
    </div>
  );
}
