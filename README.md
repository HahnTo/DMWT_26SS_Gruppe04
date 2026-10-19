# Dark Patterns – Wie sie manipulieren

Interaktive Lern-Website über **Dark Patterns**, also Designtricks, die Nutzer zu Handlungen drängen, die sie eigentlich nicht geplant hatten. Die Seite erklärt zehn typische Muster, bietet eine interaktive Übung an einer nachgebauten Streaming-Anmeldeseite und enthält ein Community-Forum, in dem Nutzer eigene Beispiele teilen und diskutieren können.

Es handelt sich um ein Studentenprojekt, das von Lutz Morath, Michael Eberle und Tobias Hahn im Rahmen des Moduls Digital Media and Webtechnologie entstanden ist.

## Screenshots

<p align="center">
  <img src="public/screenshots/Hero_screen.png" alt="Screenshot des Heros" width="45%" />
  <img src="public/screenshots/Cards_screen.png" alt="Screenshot der Cards" width="45%" />
</p>

## Über das Projekt

Die Website ist als Single Page aufgebaut und führt Nutzer in mehreren Abschnitten durch das Thema:

1. **Hero** mit animierten Hintergrundbildern, die vor dem Mauszeiger ausweichen.
2. **Intro** mit einer kurzen Erklärung, was Dark Patterns sind.
3. **Patterns** als horizontal scrollende Karten mit Beschreibung und Beispielen.
4. **Teste dich** – eine Drag-and-Drop-Übung an der fiktiven Streaming-Plattform „Streamly".
5. **Abschluss** mit Handlungsempfehlungen.
6. **Forum** zum Austausch eigener Erfahrungen.

Besonderheiten: ein WebGL-basierter, interaktiver Flüssigkeits-Hintergrund (Three.js) sowie ein Forum mit PostgreSQL-Anbindung über Prisma.

## Technologien

| Technologie | Verwendung |
|---|---|
| TypeScript 5 | Programmiersprache für Frontend und API-Routen |
| [Next.js](https://nextjs.org) 16.2.4 (App Router) | Framework für Seiten, Layout und API-Routen |
| React 19.2.4 | UI-Komponenten |
| Tailwind CSS 4 | Styling |
| PostgreSQL 16 | Datenbank für das Forum |
| Prisma 6.19 (`@prisma/client`, `prisma`) | ORM, Schema und Migrationen |
| Docker / Docker Compose | Containerisierte Ausführung von Web-App und Datenbank |

In den `devDependencies` sind zusätzlich `tsx`, `autoprefixer` und `@tailwindcss/line-clamp` eingetragen. Eine Verwendung im vorhandenen Code ist nicht erkennbar.

## Voraussetzungen

- **Node.js ≥ 20.9** (von Next.js 16 gefordert; das Dockerfile nutzt `node:20-alpine`) inklusive npm
- **Docker** und **Docker Compose** (für die Datenbank bzw. die komplette Container-Ausführung)
- Eine erreichbare **PostgreSQL**-Datenbank – im Projekt wird sie über `docker-compose.yml` bereitgestellt

## Installation und Start

### Variante 1: Entwicklungsmodus (empfohlen)

Die Datenbank läuft im Container, die Next.js-Anwendung lokal mit Hot Reload.

1. **Repository klonen und ins Projektverzeichnis wechseln**
   ```bash
   git clone https://github.com/HahnTo/DMWT_26SS_Gruppe04.git
   cd DMWT_26SS_Gruppe04
   ```

2. **Abhängigkeiten installieren** (im Projektstamm)
   ```bash
   npm install
   ```

3. **Datenbank starten** (im Projektstamm). Startet nur den Dienst `db` (PostgreSQL 16, Port 5432):
   ```bash
   docker compose up -d db
   ```

4. **`.env` im Projektstamm anlegen.** Die Datei wird von Git ignoriert (`.env*`). Benutzer, Passwort und Datenbankname stehen im Dienst `db` der `docker-compose.yml`; der Host ist beim lokalen Start `localhost`:
   ```env
   DATABASE_URL="postgresql://dmwt:dmwtpassword@localhost:5432/dmwt_comments"
   ```

5. **Migrationen ausführen und Prisma-Client erzeugen** (im Projektstamm). Die Migrationen legen die Tabellen an und fügen Beispielbeiträge für das Forum ein:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

6. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

7. **Im Browser öffnen:** [http://localhost:3000](http://localhost:3000) (Standardport von Next.js; in der Konfiguration nicht abweichend gesetzt).

### Variante 2: Komplett mit Docker (produktionsnah)

Baut die Anwendung (`next build`) und startet sie zusammen mit der Datenbank:

```bash
docker compose up --build
```

Der Container führt über `scripts/start.sh` nacheinander `prisma migrate deploy`, `prisma generate` und `npm run start` aus. Die Website ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar. `DATABASE_URL` wird in diesem Fall in `docker-compose.yml` (und im `Dockerfile`) gesetzt, eine `.env` ist dafür nicht nötig.

> **Hinweis:** `scripts/start.sh` steht in der `.gitignore`. Fehlt die Datei nach dem Klonen, schlägt der Container-Start fehl. Sie muss dann vorhanden sein oder aus der `.gitignore` entfernt werden.

## Projektstruktur

```text
.
├── app/
│   ├── api/forum/posts/            # GET/POST Beiträge
│   │   └── [id]/replies/           # POST Antworten
│   ├── fonts.ts                    # Lokale Schriften (next/font/local)
│   ├── globals.css                 # Tailwind-Import, Farben, Basis-Styles
│   ├── layout.tsx                  # Root-Layout (lang="de")
│   └── page.tsx                    # Startseite, setzt alle Abschnitte zusammen
├── components/
│   ├── Header.tsx, Hero.tsx, IntroSection.tsx, ConcludingSection.tsx, Footer.tsx
│   ├── HorizontalScrollSection.tsx, Card.tsx, Textblock.tsx   # Pattern-Karten
│   ├── StreamlyInteractive.tsx     # Drag-and-Drop-Übung
│   ├── ForumPage.tsx               # Forum (Client-Komponente)
│   ├── LiquidEther.tsx             # WebGL-Hintergrund
│   └── CTAButton.tsx, Button.tsx
├── lib/prisma.ts                   # Prisma-Client (Singleton)
├── prisma/
│   ├── schema.prisma               # Datenmodell
│   └── migrations/                 # SQL-Migrationen inkl. Forum-Beispieldaten
├── scripts/start.sh                # Startskript im Docker-Container
├── Dockerfile, docker-compose.yml
├── prisma.config.ts
├── AGENTS.md, CLAUDE.md            # Hinweise für KI-Coding-Assistenten
└── package.json
```

Die Komponenten verweisen auf Bilder unter `/images/…` sowie Schriftdateien (`app/fonts/…`). Diese Verzeichnisse waren bei der Erstellung der README nicht einsehbar.

## Funktionen der Website

### Dark-Pattern-Karten
Zehn Karten mit Erklärung und Beispielen: Nagging, Roach Motel, Confirmshaming, Hidden Costs, Disguised Ads, Forced Continuity, Countdown, Trick Questions, False Social Proof und Preselection. Der vertikale Scrollfortschritt steuert eine horizontale Bewegung, die aktive Karte wird vergrößert und zeigt den Text. Bei der letzten Karte erscheint ein Link zur Übung.

### Interaktive Übung „Streamly"
Sechs Begriffe (Countdown, Preselection, Trick Question, Hidden Costs, False Social Proof, Roach Motel) werden per Drag and Drop auf die passende Stelle einer nachgebauten Streaming-Seite gezogen. Nach „Überprüfen" werden Treffer markiert, es folgen eine Auflösung mit Erklärungen und die Möglichkeit zum erneuten Versuch.   

### Community-Forum
- Beiträge ansehen, nach Kategorie filtern und aufklappen
- Neue Beiträge mit Name, Titel, Beschreibung, optionaler Website und Kategorie erstellen
- Auf Beiträge antworten

## Team und Projektkontext

Dieses Projekt ist ein **Studentenprojekt** aus dem Modul Digital Media and Webtechnologie.  
Das Team besteht aus **Lutz Morath, Michael Eberle und Tobias Hahn**.