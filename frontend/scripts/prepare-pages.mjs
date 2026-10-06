import { rmSync } from "node:fs";
import { join } from "node:path";

const appDir = join(process.cwd(), "src/app");

rmSync(join(appDir, "api"), { recursive: true, force: true });
rmSync(join(appDir, "quizzes/[id]"), { recursive: true, force: true });
