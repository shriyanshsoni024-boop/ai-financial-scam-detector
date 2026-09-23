import { createWorker } from 'tesseract.js';
import { OCRResult } from '@/types/scam';

export interface OCROptions {
  onProgress?: (progress: {
    stage: 'uploading' | 'recognizing' | 'analyzing' | 'complete';
    percent: number;
    message: string;
  }) => void;
}

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/**
 * Validates an uploaded screenshot file before processing.
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No image file provided.' };
  }

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  const isAllowedType =
    ALLOWED_IMAGE_TYPES.includes(fileType) ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.webp');

  if (!isAllowedType) {
    return {
      valid: false,
      error: 'Unsupported file format. Please upload a PNG, JPG, JPEG, or WEBP screenshot.'
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit. Please upload a smaller screenshot.`
    };
  }

  return { valid: true };
}

/**
 * Extracts all URLs, domain names, and shortened links from raw text.
 */
export function detectUrlsFromText(text: string): string[] {
  if (!text) return [];

  // Match full URLs, domains with TLDs, and URL shorteners
  const urlRegex =
    /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*|\b(?:bit\.ly|tinyurl\.com|t\.co|wa\.me|cutt\.ly|is\.gd|rb\.gy|goo\.gl|ow\.ly)\/[^\s]*|\b[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:com|org|net|in|co\.in|xyz|top|live|info|me|app|link|site|click|online|ru|cc|to|tech|vip|store|shop|biz)(?:\/[^\s]*)?/gi;

  const matches = text.match(urlRegex) || [];

  const cleaned = matches
    .map((raw) => {
      // Strip trailing punctuation often caught in OCR
      return raw.replace(/[.,;:!?)\s'"\]]+$/, '').trim();
    })
    .filter((url) => url.length >= 4);

  // Return unique URLs
  return Array.from(new Set(cleaned));
}

/**
 * Executes OCR on a screenshot using Tesseract.js.
 */
export async function extractTextFromImage(
  imageSource: File | Blob | string,
  options?: OCROptions
): Promise<OCRResult> {
  const onProgress = options?.onProgress;

  if (onProgress) {
    onProgress({
      stage: 'uploading',
      percent: 15,
      message: 'Uploading and preparing screenshot...'
    });
  }

  let worker;
  try {
    if (onProgress) {
      onProgress({
        stage: 'recognizing',
        percent: 30,
        message: 'Initializing OCR engine...'
      });
    }

    worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && onProgress) {
          const progressPercent = Math.min(85, Math.round(30 + (m.progress || 0) * 55));
          onProgress({
            stage: 'recognizing',
            percent: progressPercent,
            message: `Extracting text from image (${Math.round((m.progress || 0) * 100)}%)...`
          });
        }
      }
    });

    const ret = await worker.recognize(imageSource);
    await worker.terminate();
    worker = null;

    const rawText = ret.data.text || '';
    const confidence = ret.data.confidence || 0;

    // Normalize whitespace while preserving line structure
    const cleanedText = rawText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n')
      .trim();

    if (!cleanedText || cleanedText.length < 5) {
      throw new Error(
        'No readable text could be detected in this screenshot. Please ensure the image is clear and contains visible text.'
      );
    }

    if (onProgress) {
      onProgress({
        stage: 'analyzing',
        percent: 90,
        message: 'Parsing detected URLs and threat vectors...'
      });
    }

    const detectedUrls = detectUrlsFromText(cleanedText);

    if (onProgress) {
      onProgress({
        stage: 'complete',
        percent: 100,
        message: 'Text extraction complete.'
      });
    }

    return {
      text: cleanedText,
      confidence,
      detectedUrls
    };
  } catch (err: unknown) {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // ignore terminate errors
      }
    }

    const message =
      err instanceof Error
        ? err.message
        : 'Failed to extract text from screenshot. Please try a clearer image.';
    throw new Error(message);
  }
}
