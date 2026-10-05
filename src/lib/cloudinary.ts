// SERVER-ONLY: This file uses the Cloudinary API secret — never import from client components.
// Signed uploads: the server generates a signature so the browser can upload
// directly to Cloudinary without exposing the API secret.

import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials are not set. Add CLOUDINARY_CLOUD_NAME, " +
        "CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local"
    );
  }

  return { cloudName, apiKey, apiSecret };
}

// Configure once, lazily
let configured = false;
function ensureConfigured() {
  if (configured) return;
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  configured = true;
}

// ── Signed upload signature ───────────────────────────────────────────────────
// The browser hits /api/cloudinary/sign, gets back a signature + timestamp,
// then uploads directly to Cloudinary. No API secret ever touches the browser.
export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export function generateSignedUploadParams(folder = "okiki/products"): SignedUploadParams {
  ensureConfigured();
  const { cloudName, apiKey } = getCloudinaryConfig();
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = { folder, timestamp };
  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );
  return { signature, timestamp, cloudName, apiKey, folder };
}

// ── Delete a media asset ──────────────────────────────────────────────────────
export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<void> {
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

// ── Build optimised delivery URL (for OG images, email, etc.) ────────────────
export function buildCloudinaryUrl(
  publicId: string,
  {
    width,
    height,
    crop = "fill",
    format = "auto",
    quality = "auto",
  }: {
    width?: number;
    height?: number;
    crop?: string;
    format?: string;
    quality?: string;
  } = {}
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) throw new Error("Cloudinary cloud name is not configured");

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
