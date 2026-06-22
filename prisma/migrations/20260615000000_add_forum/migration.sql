-- Dark Pattern Kategorien als Enum


DO $$ BEGIN
  CREATE TYPE "Category" AS ENUM (
    'NAGGING',
    'ROACH_MOTEL',
    'CONFIRM_SHAMING',
    'HIDDEN_COSTS',
    'DISGUISED_ADS',
    'FORCED_CONTINUITY',
    'COUNTDOWN',
    'TRICK_QUESTIONS',
    'PRESELECTION',
    'FALSE_SOCIAL_PROOF',
    'SONSTIGES'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- Forum-Beiträge (Threads)
CREATE TABLE IF NOT EXISTS "ForumPost" (
  "id"        SERIAL PRIMARY KEY,
  "author"    TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "website"   TEXT,
  "category"  "Category" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ForumPost_author_content_key"
    UNIQUE ("author", "content")
);


-- Antworten auf Beiträge
CREATE TABLE IF NOT EXISTS "ForumReply" (
  "id"        SERIAL PRIMARY KEY,
  "postId"    INTEGER NOT NULL,
  "author"    TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ForumReply_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "ForumPost"("id")
    ON DELETE CASCADE,
  CONSTRAINT "ForumReply_author_content_key"
    UNIQUE ("author", "content")
);


INSERT INTO "ForumPost"
("author", "title", "content", "website", "category")
VALUES
(
  'Tobias',
  'TikTok nervt',
  'Immer wenn ich auf TikTok bin werde ich gefragt, ob ich meine Benachrichtigungen aktivieren möchte.
Die fragen auch immer ob ich meine Kontakte verknüpfen will. Warum verstehen die nicht, dass mal gut ist..
Habt iht Tipps wie man das deaktivieren kann?',
  'https://www.tiktok.com/',
  'NAGGING'
),
(
  'Anna',
  'Kann man heutzutage auch ohne Abo noch Stil haben?',
  'Ich wollte letztens bei Dailylook Klamotten bestellen. Sie haben mir einen Rabatt angeboten, wenn ich meine Email preisgebe.
Um abzulehnen musste man aber auf folgenden Satz drücken: "No thanks, i don''t want to look my best".
Kann das denn echt wahr sein??',
  'https://www.dailylook.com/',
  'CONFIRM_SHAMING'
),
(
  'Max',
  'Figma nutzt meine Designs für KI?',
  'Ich habe heute erfahren, dass Figma meine Design-Dateien automatisch für das Training ihrer KI verwendet. 
Davon wusste ich überhaupt nichts. Eine Benachrichtigung oder Nachfrage gab es nicht. Noch schlimmer: 
Nur Enterprise-Kunden waren standardmäßig ausgenommen. 
Den Opt-out zu finden war auch alles andere als einfach, weil die Einstellung tief in den Team-Einstellungen versteckt ist. Findet ihr das auch so problematisch oder übertreibe ich?',
  'https://www.figma.com/',
  'PRESELECTION'
),
(
  'Mattis',
  'Uber Eats versteckt Servicekosten',
  'Ich wollte bei Uber Eats was bestellen und dachte der Preis ist ja gut. Doch dann im Warenkorb kamen plötzlich Servicekosten dazu. Eine Frechheit',
  'https://www.ubereats.com/',
  'HIDDEN_COSTS'
)
ON CONFLICT ("author", "content") DO NOTHING;


INSERT INTO "ForumReply"
("postId", "author", "content")
VALUES
(
  '1',
  'Thorsten',
  'Geht mir auch so!'
),
(
  '2',
  'Nils',
  'Man darf das alles leider nicht mehr so persönlich nehmen. Passiert immer wieder.'
),
(
  '2',
  'Sophie',
  'Ich habe beschlossen nicht mehr dort einzukaufen. Ich finde es auch unmöglich, dafür gibt es dann doch bessere Seiten.'
),
(
  '3',
  'Fabi',
  'Oh, davon habe ich noch garnichts gehört. Danke für die Info, dann gucke ich mal nach :)'
),
(
  '4',
  'Daniel',
  'Also ich finde vieles frech im Internet, aber das? Das ist das völlig normal und sie brauchen eben auch das Geld für die bearbeitung der Bestellung.'
),
(
  '4',
  'Mattis',
  'Und auch wenn es normal ist, kann es doch trotzdem frech sein? Ich bleibe bei meiner Meinung.'
),
(
  '4',
  'Lilly',
  'Ich sehe das wie Daniel, man kann auch übertreiben.'
)
ON CONFLICT ("author", "content") DO NOTHING;
