// Tesseract.js OCR fallback for client-side image text extraction
import Tesseract from 'tesseract.js';

export async function analyzeImageWithTesseract(base64Image: string): Promise<string> {
  // Convert base64 to blob
  const byteString = atob(base64Image);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: 'image/jpeg' });

  // Run Tesseract OCR
  const result = await Tesseract.recognize(blob, 'eng', {
    logger: m => console.log('[Tesseract]', m)
  });
  return result.data.text;
}
