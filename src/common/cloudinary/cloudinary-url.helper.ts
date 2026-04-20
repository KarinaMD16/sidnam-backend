const CLOUDINARY_OPTIMIZATION_SEGMENT = 'f_auto,q_auto';

export function optimizeCloudinaryUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  if (url.includes(`/${CLOUDINARY_OPTIMIZATION_SEGMENT}/`)) {
    return url;
  }

  return url.replace('/upload/', `/upload/${CLOUDINARY_OPTIMIZATION_SEGMENT}/`);
}
