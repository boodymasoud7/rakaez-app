'use client';

/**
 * Client-side image optimization utilities.
 * Compresses and converts images to WebP before uploading.
 */

export interface OptimizedImage {
  blob: Blob;
  fileName: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
}

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.8; // WebP quality (0.0 - 1.0)
const THUMBNAIL_WIDTH = 400;

/**
 * Load an image file into an HTMLImageElement
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Resize and compress an image using Canvas API
 */
function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    let { width, height } = img;

    // Calculate new dimensions maintaining aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Optimize a single image file:
 * - Resize to max dimensions
 * - Convert to WebP
 * - Compress with specified quality
 */
export async function optimizeImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }
): Promise<OptimizedImage> {
  const maxWidth = options?.maxWidth ?? MAX_WIDTH;
  const maxHeight = options?.maxHeight ?? MAX_HEIGHT;
  const quality = options?.quality ?? QUALITY;

  const img = await loadImage(file);

  const blob = await resizeImage(img, maxWidth, maxHeight, quality);

  // Generate WebP filename
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const fileName = `${baseName}.webp`;

  // Clean up object URL
  URL.revokeObjectURL(img.src);

  return {
    blob,
    fileName,
    originalSize: file.size,
    optimizedSize: blob.size,
    width: Math.min(img.width, maxWidth),
    height: Math.min(img.height, maxHeight),
  };
}

/**
 * Generate a thumbnail version of an image
 */
export async function generateThumbnail(file: File): Promise<Blob> {
  const img = await loadImage(file);
  const blob = await resizeImage(img, THUMBNAIL_WIDTH, THUMBNAIL_WIDTH, 0.7);
  URL.revokeObjectURL(img.src);
  return blob;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, maxSizeMB: number = 10): string | null {
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return `File too large. Maximum size is ${maxSizeMB}MB`;
  }
  return null;
}
