-- Dark Pattern Kategorien als Enum
CREATE TYPE "Category" AS ENUM (
  'NAGGING',
  'ROACH_MOTEL',
  'HIDDEN_COSTS',
  'FORCED_CONTINUITY',
  'TRICK_QUESTIONS',
  'DISGUISED_ADS',
  'COUNTDOWN',
  'CONFIRM_SHAMING',
  'SONSTIGES'
);

-- Forum-Beiträge (Threads)
CREATE TABLE "ForumPost" (
  "id"        SERIAL PRIMARY KEY,
  "author"    TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "website"   TEXT,
  "category"  "Category" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Antworten auf Beiträge
CREATE TABLE "ForumReply" (
  "id"        SERIAL PRIMARY KEY,
  "postId"    INTEGER NOT NULL,
  "author"    TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ForumReply_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "ForumPost"("id")
    ON DELETE CASCADE
);
