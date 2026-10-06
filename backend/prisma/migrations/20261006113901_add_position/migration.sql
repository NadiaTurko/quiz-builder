-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AnswerOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    CONSTRAINT "AnswerOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AnswerOption" ("id", "isCorrect", "questionId", "text", "position")
SELECT
    "id",
    "isCorrect",
    "questionId",
    "text",
    ROW_NUMBER() OVER (PARTITION BY "questionId" ORDER BY rowid) - 1
FROM "AnswerOption";
DROP TABLE "AnswerOption";
ALTER TABLE "new_AnswerOption" RENAME TO "AnswerOption";
CREATE TABLE "new_Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "correctAnswer" TEXT,
    "position" INTEGER NOT NULL,
    CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("correctAnswer", "id", "quizId", "text", "type", "position")
SELECT
    "correctAnswer",
    "id",
    "quizId",
    "text",
    "type",
    ROW_NUMBER() OVER (PARTITION BY "quizId" ORDER BY rowid) - 1
FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
