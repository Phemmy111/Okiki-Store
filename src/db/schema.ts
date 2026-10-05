import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ── ADMINS ────────────────────────────────────────────────────────────────────
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdBy: varchar("created_by", { length: 255 }), // email of admin who created this
  isSample: boolean("is_sample").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: text("icon"), // emoji or icon name
  imagePublicId: text("image_public_id"), // Cloudinary public_id
  sortOrder: integer("sort_order").default(0).notNull(),
  isSample: boolean("is_sample").default(false).notNull(),
});

// ── BRANDS ────────────────────────────────────────────────────────────────────
export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  logoPublicId: text("logo_public_id"),
  isSample: boolean("is_sample").default(false).notNull(),
});

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
  description: text("description"),
  specs: jsonb("specs").default([]).notNull(), // array of { name: string, value: string }
  priceKobo: integer("price_kobo"), // null means "ask for price"
  priceMode: varchar("price_mode", { length: 20 }).default("show").notNull(), // show, call, wholesale
  compareAtKobo: integer("compare_at_kobo"),
  stockStatus: varchar("stock_status", { length: 20 }).default("in_stock").notNull(), // in_stock, low_stock, out_of_stock, preorder
  stockQty: integer("stock_qty").default(0).notNull(),
  warrantyNote: text("warranty_note"),
  deliveryNote: text("delivery_note"),
  isHotDeal: boolean("is_hot_deal").default(false).notNull(),
  dealEndsAt: timestamp("deal_ends_at"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isNewArrival: boolean("is_new_arrival").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  isSample: boolean("is_sample").default(false).notNull(),
});

// ── PRODUCT MEDIA ─────────────────────────────────────────────────────────────
export const productMedia = pgTable("product_media", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  publicId: text("public_id").notNull(), // Cloudinary public_id
  type: varchar("type", { length: 10 }).default("image").notNull(), // image, video
  width: integer("width"),
  height: integer("height"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isSample: boolean("is_sample").default(false).notNull(),
});

// ── BUNDLES ───────────────────────────────────────────────────────────────────
export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  priceKobo: integer("price_kobo"), // null means "ask for price"
  priceMode: varchar("price_mode", { length: 20 }).default("show").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  isSample: boolean("is_sample").default(false).notNull(),
});

export const bundleItems = pgTable("bundle_items", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").references(() => bundles.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  qty: integer("qty").default(1).notNull(),
});

// ── MEDIA SLOTS (Replaces hero_slides) ────────────────────────────────────────
export const mediaSlots = pgTable("media_slots", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(), // home, shop, category_salon, etc.
  layout: varchar("layout", { length: 20 }).default("hero").notNull(), // hero, banner, tile, card
  defaultTransition: varchar("default_transition", { length: 20 }).default("fade").notNull(), // fade, slide, zoom, parallax
  defaultDurationMs: integer("default_duration_ms").default(5000).notNull(),
  autoplay: boolean("autoplay").default(true).notNull(),
  showControls: boolean("show_controls").default(true).notNull(),
});

export const slides = pgTable("slides", {
  id: serial("id").primaryKey(),
  slotId: integer("slot_id").references(() => mediaSlots.id, { onDelete: "cascade" }).notNull(),
  mediaType: varchar("media_type", { length: 10 }).default("image").notNull(), // image, video
  publicId: text("public_id").notNull(), // Cloudinary public_id
  posterPublicId: text("poster_public_id"), // For videos
  altText: text("alt_text"),
  headline: varchar("headline", { length: 255 }),
  subtext: text("subtext"),
  btnLabel: varchar("btn_label", { length: 50 }),
  btnUrl: varchar("btn_url", { length: 255 }),
  transitionOverride: varchar("transition_override", { length: 20 }),
  durationOverrideMs: integer("duration_override_ms"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at"),
  endsAt: timestamp("ends_at"),
  isSample: boolean("is_sample").default(false).notNull(),
});

// ── QUOTE REQUESTS ────────────────────────────────────────────────────────────
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  businessName: varchar("business_name", { length: 255 }),
  deliveryLocation: varchar("delivery_location", { length: 255 }),
  message: text("message"),
  status: varchar("status", { length: 20 }).default("new").notNull(), // new, contacted, quoted, won, lost
  adminNotes: text("admin_notes"),
  isSample: boolean("is_sample").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quoteItems = pgTable("quote_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").references(() => quoteRequests.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  productNameSnapshot: varchar("product_name_snapshot", { length: 255 }).notNull(),
  qty: integer("qty").default(1).notNull(),
});

// ── ORDERS (WHATSAPP CHECKOUT) ────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 20 }).notNull().unique(), // OKI-XXXX
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  deliveryMethod: varchar("delivery_method", { length: 20 }).notNull(), // pickup, delivery
  deliveryArea: varchar("delivery_area", { length: 255 }),
  deliveryAddress: text("delivery_address"),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).default("new").notNull(), // new, contacted, confirmed, delivered, cancelled
  paymentStatus: varchar("payment_status", { length: 20 }).default("unpaid").notNull(), // unpaid, partial, paid
  paymentMethod: varchar("payment_method", { length: 50 }), // cash, transfer, pos, other
  adminNotes: text("admin_notes"),
  totalKobo: integer("total_kobo"), // null if any item is "ask for price"
  isSample: boolean("is_sample").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }), // Keep reference but set null if product deleted
  productNameSnapshot: varchar("product_name_snapshot", { length: 255 }).notNull(),
  productSlugSnapshot: varchar("product_slug_snapshot", { length: 255 }).notNull(),
  priceKoboSnapshot: integer("price_kobo_snapshot"), // null means "price to be confirmed"
  qty: integer("qty").default(1).notNull(),
});

// ── SETTINGS ──────────────────────────────────────────────────────────────────
export const settings = pgTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ── ACTIVITY LOG ──────────────────────────────────────────────────────────────
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // created, updated, deleted
  entity: varchar("entity", { length: 100 }).notNull(), // products, orders, etc
  entityId: varchar("entity_id", { length: 100 }), // can be string for settings key
  diff: jsonb("diff"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
