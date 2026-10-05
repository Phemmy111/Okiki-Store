// ============================================================
// Shared TypeScript types for OKIKI Electronics Store
// ============================================================

// Price display modes
export type PriceMode = "show" | "call" | "wholesale";

// Stock status
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

// Media type for product images/videos
export type MediaType = "image" | "video";

// Hero slide transition types
export type SlideTransition = "fade" | "slide" | "zoom";

// Quote request status
export type QuoteStatus = "new" | "contacted" | "quoted" | "won" | "lost";

// Settings key-value pair
export interface SiteSetting {
  key: string;
  value: string;
  updatedAt: Date;
}

// Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  imagePublicId: string | null;
  sortOrder: number;
}

// Brand
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logoPublicId: string | null;
}

// Product media item
export interface ProductMedia {
  id: number;
  productId: number;
  publicId: string;
  type: MediaType;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

// Product (public-facing, no internal fields)
export interface Product {
  id: number;
  name: string;
  slug: string;
  categoryId: number | null;
  brandId: number | null;
  description: string | null;
  specs: Record<string, string> | null;
  priceKobo: number | null;
  priceMode: PriceMode;
  compareAtKobo: number | null;
  stockStatus: StockStatus;
  stockQty: number | null;
  warrantyNote: string | null;
  deliveryNote: string | null;
  isHotDeal: boolean;
  dealEndsAt: Date | null;
  isFeatured: boolean;
  isNewArrival: boolean;
  isPublished: boolean;
  isSample: boolean;
  media: ProductMedia[];
  category: Category | null;
  brand: Brand | null;
  createdAt: Date;
  updatedAt: Date;
}

// Quote list item (client-side, no payment)
export interface QuoteItem {
  productId: number;
  productName: string;
  productSlug: string;
  priceKobo: number | null;
  priceMode: PriceMode;
  imagePublicId: string | null;
  qty: number;
}

// WhatsApp contact numbers
export interface ContactNumbers {
  primary: string;
  secondary: string;
}
