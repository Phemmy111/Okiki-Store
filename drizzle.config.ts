import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use the UNPOOLED (direct) connection for migrations — poolers don't support DDL
    url: process.env.DATABASE_URL_UNPOOLED!,
  },
  verbose: true,
  strict: true,
});
