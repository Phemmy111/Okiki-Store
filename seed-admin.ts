import { db } from "./src/db/index.ts";
import { admins } from "./src/db/schema.ts";
import { sql } from "drizzle-orm";

async function main() {
  // 1. Add the role column if it doesn't exist yet
  await db.execute(sql`
    ALTER TABLE admins 
    ADD COLUMN IF NOT EXISTS role varchar(50) NOT NULL DEFAULT 'admin'
  `);
  console.log("✅ role column ensured");

  // 2. Fix the capitalisation on the existing remsonboy entry + set role
  await db.execute(sql`
    UPDATE admins 
    SET email = 'remsonboy@gmail.com', role = 'super_admin'
    WHERE lower(email) = 'remsonboy@gmail.com'
  `);
  console.log("✅ remsonboy updated to super_admin");

  // 3. Remove stale okikielectronicstore sample entry
  await db.execute(sql`
    DELETE FROM admins 
    WHERE email = 'okikielectronicstore@gmail.com'
  `);
  console.log("✅ stale sample entry removed");

  // 4. Upsert femiadeleke2020@gmail.com as super_admin
  await db.execute(sql`
    INSERT INTO admins (email, role, created_by)
    VALUES ('femiadeleke2020@gmail.com', 'super_admin', 'remsonboy@gmail.com')
    ON CONFLICT (email) DO UPDATE SET role = 'super_admin'
  `);
  console.log("✅ femiadeleke2020@gmail.com added as super_admin");

  // 5. Show final state
  const rows = await db.execute(sql`SELECT id, email, role, created_by, created_at FROM admins ORDER BY id`);
  console.log("\nFinal admins table:");
  console.table(rows.rows);
}

main().catch(console.error);
