import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: ".env.local" });

// Ensure required env vars exist
const requiredVars = [
  "DATABASE_URL",
  "SUPER_ADMIN_EMAIL",
  "ADMIN_NOTIFY_EMAIL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const v of requiredVars) {
  if (!process.env[v]) {
    console.error(`❌ Missing required env var: ${v}`);
    process.exit(1);
  }
}

if (process.env.CLOUDINARY_API_SECRET!.includes("<")) {
  console.error(
    "❌ CLOUDINARY_API_SECRET still has the placeholder value in .env.local.\n" +
    "Please go to Cloudinary > Settings > API Keys, reveal the secret, copy it, update .env.local, and rerun the seed."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function uploadToCloudinary(filePath: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `okikistore_seed/${folder}`,
      use_filename: true,
      unique_filename: false,
    });
    return result.public_id;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    return `placeholder/${folder}/${path.basename(filePath)}`;
  }
}

async function uploadVideoToCloudinary(filePath: string, folder: string) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `okikistore_seed/${folder}`,
      resource_type: "video",
      use_filename: true,
      unique_filename: false,
    });
    return result.public_id;
  } catch (error) {
    console.error(`Error uploading video ${filePath}:`, error);
    return `placeholder/${folder}/${path.basename(filePath)}`;
  }
}

async function seed() {
  console.log("🌱 Starting seed...");

  // 1. Admins
  const superAdmin = process.env.SUPER_ADMIN_EMAIL!;
  const notifyEmails = process.env.ADMIN_NOTIFY_EMAIL!.split(",").map((e) => e.trim());
  const otherAdmin = notifyEmails.find((e) => e !== superAdmin);

  console.log(`Seeding super admin: ${superAdmin}`);
  await db
    .insert(schema.admins)
    .values({ email: superAdmin, isSample: false })
    .onConflictDoNothing();

  if (otherAdmin) {
    console.log(`Seeding admin: ${otherAdmin}`);
    await db
      .insert(schema.admins)
      .values({ email: otherAdmin, isSample: false })
      .onConflictDoNothing();
  }

  // 2. Settings (defaults)
  console.log("Seeding default settings...");
  const defaultSettings = [
    { key: "site.phone1", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER! },
    { key: "site.phone2", value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_2 || "" },
    { key: "site.email", value: "okikielectronicstore@gmail.com" },
    { key: "site.address", value: "Dugbe Alawo, Opposite Kamiluze Phase One, Ibadan" },
    { key: "site.whatsapp_order_number", value: process.env.NEXT_PUBLIC_WHATSAPP_ORDER_NUMBER! },
    { key: "trust.original_products", value: "false" },
    { key: "trust.warranty", value: "false" },
    { key: "trust.swift_delivery", value: "false" },
    { key: "trust.best_prices", value: "false" },
    { key: "trust.wholesale", value: "false" },
    { key: "site.default_price_mode", value: "show" },
  ];

  for (const s of defaultSettings) {
    await db
      .insert(schema.settings)
      .values({ key: s.key, value: s.value })
      .onConflictDoNothing();
  }

  // 3. Categories
  console.log("Seeding categories...");
  const cats = [
    { name: "Salon & Beauty", slug: "salon-beauty", icon: "💄", isSample: true },
    { name: "Home Electronics", slug: "home-electronics", icon: "🏠", isSample: true },
    { name: "Power & Generators", slug: "power-generators", icon: "⚡", isSample: true },
    { name: "Creator Gear", slug: "creator-gear", icon: "🎥", isSample: true },
  ];

  const catIdMap = new Map();
  for (let i = 0; i < cats.length; i++) {
    const res = await db
      .insert(schema.categories)
      .values({ ...cats[i], sortOrder: i })
      .onConflictDoNothing()
      .returning({ id: schema.categories.id, slug: schema.categories.slug });
    
    // If conflict, find the existing one
    if (res.length > 0) {
      catIdMap.set(res[0].slug, res[0].id);
    } else {
      const existing = await db.select().from(schema.categories).where(eq(schema.categories.slug, cats[i].slug));
      if (existing.length > 0) catIdMap.set(existing[0].slug, existing[0].id);
    }
  }

  // 4. Media Slots (Replaces hero slides)
  console.log("Seeding media slots...");
  const defaultSlots = [
    { slug: "home-hero", label: "Home Page Hero", location: "home", layout: "hero", defaultTransition: "fade" },
    { slug: "shop-banner", label: "Shop Page Banner", location: "shop", layout: "banner", defaultTransition: "slide" },
    { slug: "cat-salon-beauty", label: "Category: Salon & Beauty", location: "category_salon-beauty", layout: "banner" },
    { slug: "cat-home-electronics", label: "Category: Home Electronics", location: "category_home-electronics", layout: "banner" },
    { slug: "cat-power-generators", label: "Category: Power & Generators", location: "category_power-generators", layout: "banner" },
    { slug: "cat-creator-gear", label: "Category: Creator Gear", location: "category_creator-gear", layout: "banner" },
    { slug: "tile-salon", label: "Tile: Salon", location: "home", layout: "tile" },
    { slug: "tile-home", label: "Tile: Home", location: "home", layout: "tile" },
    { slug: "tile-power", label: "Tile: Power", location: "home", layout: "tile" },
    { slug: "tile-creator", label: "Tile: Creator", location: "home", layout: "tile" },
    { slug: "bundle-starter", label: "Bundle Card: Starter", location: "home", layout: "card" },
    { slug: "bundle-standard", label: "Bundle Card: Standard", location: "home", layout: "card" },
    { slug: "bundle-premium", label: "Bundle Card: Premium", location: "home", layout: "card" },
    { slug: "visit-us", label: "Visit Us Block", location: "home", layout: "card" }
  ];

  for (const slot of defaultSlots) {
    await db.insert(schema.mediaSlots)
      .values({ ...slot, autoplay: true, showControls: true })
      .onConflictDoNothing();
  }

  // Scan for slot media
  const slotsMediaDir = path.join(process.cwd(), "public", "seed-media", "slots");
  if (fs.existsSync(slotsMediaDir)) {
    const slotFolders = fs.readdirSync(slotsMediaDir, { withFileTypes: true }).filter(d => d.isDirectory());
    for (const folder of slotFolders) {
      const slotSlug = folder.name;
      
      const slotRecord = await db.select().from(schema.mediaSlots).where(eq(schema.mediaSlots.slug, slotSlug));
      if (!slotRecord.length) continue;
      const slotId = slotRecord[0].id;

      const files = fs.readdirSync(path.join(slotsMediaDir, slotSlug));
      let sortOrder = 0;
      for (const file of files) {
        const filePath = path.join(slotsMediaDir, slotSlug, file);
        const isVideo = file.endsWith(".mp4") || file.endsWith(".webm");
        
        let publicId;
        if (isVideo) {
          publicId = await uploadVideoToCloudinary(filePath, `slots/${slotSlug}`);
        } else {
          publicId = await uploadToCloudinary(filePath, `slots/${slotSlug}`);
        }

        await db.insert(schema.slides).values({
          slotId,
          mediaType: isVideo ? "video" : "image",
          publicId,
          // Dummy poster for now if video. In real app, Cloudinary auto-generates poster.
          posterPublicId: isVideo ? publicId.replace(/\.(mp4|webm)$/, ".jpg") : null,
          sortOrder,
          isSample: true,
          isActive: true
        });
        sortOrder++;
      }
    }
  }

  // 5. Products & Media (from /public/seed-media/)
  console.log("Scanning /public/seed-media/ for products...");
  const seedMediaDir = path.join(process.cwd(), "public", "seed-media");
  
  if (fs.existsSync(seedMediaDir)) {
    const folders = fs.readdirSync(seedMediaDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== "promos");

    for (const folder of folders) {
      const categorySlug = folder.name;
      const categoryId = catIdMap.get(categorySlug) || null;

      const catPath = path.join(seedMediaDir, folder.name);
      const files = fs.readdirSync(catPath);
      
      // Group files by base product name
      const productsMap = new Map<string, string[]>();
      for (const file of files) {
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext);
        // Clean up -1, -2 suffixes
        const baseName = nameWithoutExt.replace(/-\d+$/, "");
        
        if (!productsMap.has(baseName)) {
          productsMap.set(baseName, []);
        }
        productsMap.get(baseName)!.push(file);
      }

      for (const [productName, productFiles] of Array.from(productsMap.entries())) {
        const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        
        console.log(`Seeding product: ${productName} in ${categorySlug}`);
        const prodRes = await db
          .insert(schema.products)
          .values({
            name: productName,
            slug,
            categoryId,
            priceKobo: Math.floor(Math.random() * 5000000) + 1000000, // Random price 10k-60k NGN
            isSample: true,
          })
          .onConflictDoNothing()
          .returning({ id: schema.products.id });

        let productId: number;
        if (prodRes.length > 0) {
          productId = prodRes[0].id;
        } else {
          const existing = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
          productId = existing[0].id;
        }

        // Upload and link media
        let sortOrder = 0;
        for (const file of productFiles) {
          const filePath = path.join(catPath, file);
          const isVideo = file.endsWith(".mp4") || file.endsWith(".webm");
          
          let publicId;
          if (isVideo) {
            publicId = await uploadVideoToCloudinary(filePath, categorySlug);
          } else {
            publicId = await uploadToCloudinary(filePath, categorySlug);
          }

          await db
            .insert(schema.productMedia)
            .values({
              productId,
              publicId,
              type: isVideo ? "video" : "image",
              sortOrder,
              isSample: true,
            });
          sortOrder++;
        }
      }
    }
  } else {
    console.log("No /public/seed-media/ folder found, skipping media uploads.");
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
