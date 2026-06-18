import Card from "@/components/Card";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HorizontalScrollSection from "@/components/HorizontalScrollSection";
import Textblock from "@/components/Textblock";
import Image from "next/image";
import Footer from "@/components/Footer";
import Fakeflix from "@/components/FakeFlix";
import IntroSection from "@/components/IntroSection";
import CommentsPage from "@/components/CommentsPage";
import LiquidEther from "@/components/LiquidEther";
import StreamlyInteractive from "@/components/StreamlyInteractive";
import ForumPage from "@/components/ForumPage";
// Folie Session 06, 41: Beispiel mit refs zum Scrollen zu ...


export default function Home() {
  return (
    <div>
      <div className="fixed inset-0 -z-10">
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B497CF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <header className="fixed w-full z-50">
        <Header />
      </header>
      <section id="hero">
        <Hero />
      </section>
      <section id="intro">
        <IntroSection />
      </section>
      <section id="cards">
        <HorizontalScrollSection>
          <Card
            title="Nagging"
            img="/images/Nagging.png"
          >
            <Textblock>
              Nagging ist ein Dark Pattern, bei dem der Nutzer wiederholt und aufdringlich zu bestimmten Sachen befragt wird.
              Beispiele sind:
              <ul className="list-disc">
                <li>Cookie-Banner</li>
                <li>Push-Benachrichtigung aktivieren</li>
                <li>Kostenpflichtige Version abonnieren</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Roach Motel"
            img="/images/RoachMotel.png"
          >
            <Textblock>
              Roach Motel ist ein Dark Pattern, bei dem etwas leicht abgeschlossen, aber sehr schwer wieder gekündigt werden kann.
              Beispiele sind:
              <ul className="list-disc">
                <li>Abonnements, die nur per Brief kündbar sind</li>
                <li>Deaktivierung des Accounts erfordert Kundenservice</li>
                <li>Versteckte Kündigungsoptionen in tiefen Menüebenen</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Confirmshaming"
            img="/images/Confirmshaming.png"
          >
            <Textblock>
              Confirmshaming ist ein Dark Pattern, bei dem der Nutzer durch schuldbehaftete Formulierungen manipuliert wird, eine bestimmte Entscheidung zu treffen.
              Beispiele sind:
              <ul className="list-disc">
                <li>„Nein danke, ich möchte kein Geld sparen."</li>
                <li>„Ich verzichte auf meinen Rabatt."</li>
                <li>Abonnement-Popups mit negativer Opt-out-Sprache</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Hidden Costs"
            img="/images/HiddenCosts.png"
          >
            <Textblock>
              Hidden Costs sind ein Dark Pattern, bei dem versteckte Zusatzkosten erst kurz vor dem Kaufabschluss angezeigt werden.
              Beispiele sind:
              <ul className="list-disc">
                <li>Bearbeitungsgebühren beim Checkout</li>
                <li>Pflichtversicherungen bei Buchungsportalen</li>
                <li>Steuern und Versandkosten erst im letzten Schritt</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Disguised Ads"
            img="/images/DisguisedAds.png"
          >
            <Textblock>
              Disguised Ads sind ein Dark Pattern, bei dem Werbung als redaktioneller Inhalt oder Systemmeldung getarnt wird.
              Beispiele sind:
              <ul className="list-disc">
                <li>Anzeigen im Look von Suchergebnissen</li>
                <li>Gesponserte Artikel ohne klare Kennzeichnung</li>
                <li>Fake-Downloadbuttons auf Webseiten</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Forced Continuity"
            img="/images/ForcedContinuity.png"
          >
            <Textblock>
              Forced Continuity ist ein Dark Pattern, bei dem nach einem kostenlosen Testzeitraum automatisch kostenpflichtige Abonnements beginnen.
              Beispiele sind:
              <ul className="list-disc">
                <li>Kreditkartenpflicht bei kostenloser Testphase</li>
                <li>Keine Erinnerung vor Ende des Testzeitraums</li>
                <li>Schwer auffindbare Kündigungsoption</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Countdown"
            img="/images/Countdown.png"
          >
            <Textblock>
              Countdown ist ein Dark Pattern, bei dem künstlicher Zeitdruck erzeugt wird, um den Nutzer zu schnellen Entscheidungen zu drängen.
              Beispiele sind:
              <ul className="list-disc">
                <li>„Nur noch 2 Artikel auf Lager!"</li>
                <li>Ablaufende Rabatt-Timer beim Checkout</li>
                <li>„10 Personen sehen sich dieses Angebot gerade an"</li>
              </ul>
            </Textblock>
          </Card>
          <Card
            title="Trick Questions"
            img="/images/TrickQuestions.png"
          >
            <Textblock>
              Trick Questions sind ein Dark Pattern, bei dem verwirrend formulierte Fragen den Nutzer dazu bringen, ungewollt zuzustimmen.
              Beispiele sind:
              <ul className="list-disc">
                <li>Doppelte Verneinungen in Einwilligungstexten</li>
                <li>Vorausgewählte Checkboxen für Newsletter</li>
                <li>Unklare Opt-in/Opt-out-Formulierungen</li>
              </ul>
            </Textblock>
          </Card>
        </HorizontalScrollSection>
      </section>
      <section id="interactive">
        <StreamlyInteractive />
      </section>
      <section id="forum">
        <ForumPage />
      </section>
      <section id="comments">
        <CommentsPage />
      </section>
      <section>
        <Textblock>Concluding Text</Textblock>
      </section>
      <Footer></Footer>
    </div>
  );
}
