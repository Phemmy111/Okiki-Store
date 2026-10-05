import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL is missing in .env.local");
  process.exit(1);
}

async function testConnection() {
  console.log("Testing connection to Neon database...");
  const sql = neon(dbUrl as string);

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await sql`SELECT version();`;
      console.log("✅ Successfully connected to Neon!");
      console.log("Database version:", result[0].version);
      return;
    } catch (error: any) {
      console.error(`Connection attempt failed (${retries} left):`, error.message);
      retries--;
      if (retries === 0) {
        console.error("❌ Failed to connect to Neon after 3 attempts.");
        process.exit(1);
      }
      // Wait 2 seconds before retrying (in case DB is waking up from sleep)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

testConnection().catch(console.error);
