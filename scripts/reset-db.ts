import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  const sql = neon(process.env.DATABASE_URL_UNPOOLED!);
  await sql`DROP SCHEMA public CASCADE`;
  await sql`CREATE SCHEMA public`;
  console.log("Dropped and recreated schema public!");
}
run();
