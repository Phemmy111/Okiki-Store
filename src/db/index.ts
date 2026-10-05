// SERVER-ONLY: Neon serverless Postgres + Drizzle ORM
// This module MUST only be imported from Server Components, Server Actions,
// and Route Handlers — never from client components.
// The DATABASE_URL env var is intentionally NOT prefixed with NEXT_PUBLIC_.

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set.\n" +
      "1. Copy .env.example to .env.local\n" +
      "2. Add your Neon pooled connection string to DATABASE_URL\n" +
      "   (Use the pooled endpoint, e.g. ep-xyz.neon.tech — NOT the direct endpoint)"
  );
}

// Use the pooled Neon connection for all app queries
// (drizzle-orm/neon-http uses HTTP-based queries, perfect for serverless)
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export { schema };
export type DbSchema = typeof schema;
