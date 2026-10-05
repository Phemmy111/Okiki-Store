import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  await sql`DROP TABLE IF EXISTS hero_slides CASCADE`;
  console.log("Dropped!");
}

run();
