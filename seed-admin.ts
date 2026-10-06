import { db } from "./src/db/index.ts";
import { admins } from "./src/db/schema.ts";

async function main() {
  console.log("Adding admin...");
  await db.insert(admins).values({
    email: "Remsonboy@gmail.com",
    role: "super_admin",
  });
  console.log("Admin added successfully.");
}

main().catch(console.error);
