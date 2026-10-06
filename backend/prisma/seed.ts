import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed in production");
  }

  const existingCount = await prisma.quiz.count();
  if (existingCount > 0 && process.env.FORCE_SEED !== "1") {
    console.log("Skipping seed: database already has quizzes. Set FORCE_SEED=1 to reset.");
    return;
  }

  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  await prisma.quiz.create({
    data: {
      title: "JavaScript Basics",
      questions: {
        create: [
          {
            text: "JavaScript is a compiled language.",
            type: QuestionType.BOOLEAN,
            correctAnswer: "false",
            position: 0,
          },
          {
            text: "Which keyword declares a block-scoped variable?",
            type: QuestionType.INPUT,
            correctAnswer: "let",
            position: 1,
          },
          {
            text: "Which of the following are JavaScript data types?",
            type: QuestionType.CHECKBOX,
            position: 2,
            options: {
              create: [
                { text: "string", isCorrect: true, position: 0 },
                { text: "boolean", isCorrect: true, position: 1 },
                { text: "integer", isCorrect: false, position: 2 },
                { text: "undefined", isCorrect: true, position: 3 },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
      title: "Web Fundamentals",
      questions: {
        create: [
          {
            text: "HTML stands for HyperText Markup Language.",
            type: QuestionType.BOOLEAN,
            correctAnswer: "true",
            position: 0,
          },
          {
            text: "What does CSS stand for?",
            type: QuestionType.INPUT,
            correctAnswer: "Cascading Style Sheets",
            position: 1,
          },
          {
            text: "Which HTTP methods are considered safe?",
            type: QuestionType.CHECKBOX,
            position: 2,
            options: {
              create: [
                { text: "GET", isCorrect: true, position: 0 },
                { text: "POST", isCorrect: false, position: 1 },
                { text: "HEAD", isCorrect: true, position: 2 },
                { text: "DELETE", isCorrect: false, position: 3 },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
