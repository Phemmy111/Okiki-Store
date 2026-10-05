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
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!publicId) return "";
  
  // If it's already a full URL, just return it (e.g. placeholders from seed)
  if (publicId.startsWith("http")) return publicId;

  if (!cloudName) {
    console.warn("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
    return "";
  }

  const transforms: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
