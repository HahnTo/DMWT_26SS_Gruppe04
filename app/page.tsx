import Card from "@/components/Card";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import Textblock from "@/components/Textblock";
import Image from "next/image";
import Footer from "@/components/Footer";
import Fakeflix from "@/components/FakeFlix";
import IntroSection from "@/components/IntroSection";
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
        <IntroSection
            title = "Was sind Dark Patterns?"

            intro = {`Dark Patterns sind gezielte Designstrategien in digitalen Anwendungen, die Nutzerinnen und Nutzer unbewusst beeinflussen oder zu bestimmten Handlungen lenken sollen.
            Dabei geht es oft nicht um Transparenz oder Benutzerfreundlichkeit, sondern darum, Entscheidungen im Sinne des Anbieters zu steuern. Solche Mechanismen finden sich in vielen
            alltäglichen Interfaces – von Online-Shops über Apps bis hin zu sozialen Netzwerken. Ein typisches Beispiel ist sogenanntes 'Nagging', bei dem Nutzer wiederholt zu einer bestimmten
            Aktion gedrängt werden, etwa durch ständige Pop-ups oder Erinnerungen. Auch wenn solche Methoden auf den ersten Blick harmlos wirken, können sie langfristig das Nutzerverhalten stark
            beeinflussen. Diese Website bietet einen ersten Überblick über das Thema Dark Patterns. Sie zeigt, wie solche Designmuster funktionieren, warum sie eingesetzt werden und welche 
            Auswirkungen sie auf Nutzer haben können. Ziel ist es, ein grundlegendes Verständnis dafür zu schaffen, wie digitale Produkte gestaltet sind – und wie man manipulative Elemente erkennt.
            Denn nur wer sich dieser Strategien bewusst ist, kann informierte und selbstbestimmte Entscheidungen im digitalen Raum treffen.`}

            subTitle = "Warum ist das ein Problem?"

            subText = "Diese Muster untergraben die Autonomie der Nutzer. Auf dieser Seite zeigen wir dir die häufigsten Techniken – damit du sie erkennst."

            source = "Quelle: Verbraucherzentrale / dpa-themendienst"
         />
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
      <section>
        <Fakeflix></Fakeflix>
      </section>
      <section>
        <Textblock>Concluding Text</Textblock>
      </section>
      <Footer></Footer>
    </div>
  );
}
