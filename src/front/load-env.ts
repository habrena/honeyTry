import { config } from "dotenv";
import { resolve } from "path";

// resolved from where you RUN the command, so run from project root:
config({ path: resolve(process.cwd(), "src", ".env") });

console.log("DB URL loaded:", process.env.DATABASE_URL ? "yes" : "NO");