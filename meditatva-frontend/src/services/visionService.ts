/**
 * Google Vision API Service
 * Handles prescription image analysis using Google Cloud Vision API
 */

import { analyzeImageWithTesseract } from './tesseractService';
const VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

export interface VisionTextAnnotation {
  description: string;
  boundingPoly?: {
    vertices: Array<{ x: number; y: number }>;
  };
}

export interface VisionResponse {
  text: string;
  confidence: number;
  medications: string[];
  dosages: string[];
  warnings: string[];
}

/**
 * Converts image file to base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts canvas/video frame to base64
 */
export const canvasToBase64 = (canvas: HTMLCanvasElement): string => {
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  return dataUrl.split(',')[1];
};

/**
 * Analyzes image using Google Vision API
 */
export const analyzeImage = async (base64Image: string): Promise<VisionResponse> => {
  try {
    console.log('🔍 Starting Vision API analysis...');
    console.log('API Key exists:', !!VISION_API_KEY);
    console.log('API Key:', VISION_API_KEY ? VISION_API_KEY.substring(0, 20) + '...' : 'MISSING');
    console.log('Image size (base64):', base64Image.length, 'characters');

    if (!VISION_API_KEY || VISION_API_KEY === 'undefined') {
      console.error('❌ API Key is missing or undefined!');
      throw new Error('Vision API key not configured. Please check .env file and restart the dev server.');
    }

    const response = await fetch(VISION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Image,
            },
            features: [
              {
                type: 'TEXT_DETECTION',
              },
            ],
          },
        ],
      }),
    });

    console.log('📡 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Vision API error response:', errorText);
      let errorMessage = 'Vision API request failed';
      let errorData;
      let billingDisabled = false;
      try {
        errorData = JSON.parse(errorText);
        console.error('❌ Parsed error:', errorData);
        // Check for specific error reasons
        const errorReason = errorData.error?.details?.[0]?.reason;
        if (errorReason === 'BILLING_DISABLED') {
          errorMessage = '💳 BILLING NOT ENABLED - Using Tesseract.js fallback for OCR.';
          billingDisabled = true;
        } else if (errorData.error?.status === 'PERMISSION_DENIED') {
          errorMessage = 'API key invalid or Vision API not enabled. Please enable Cloud Vision API in Google Cloud Console.';
        } else if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      }
      if (billingDisabled) {
        // Use Tesseract.js fallback
        try {
          const tesseractText = await analyzeImageWithTesseract(base64Image);
          const analysis = extractMedicalInfo(tesseractText);
          return {
            text: tesseractText,
            confidence: 0.7,
            medications: analysis.medications,
            dosages: analysis.dosages,
            warnings: [
              'OCR performed using Tesseract.js (no Google billing)',
              ...analysis.warnings
            ],
          };
        } catch (err) {
          return getDemoResult('Tesseract.js OCR failed: ' + (err?.message || err));
        }
      }
      // Return demo data instead of throwing error
      console.warn('⚠️ Returning demo data due to API error');
      return getDemoResult(errorMessage);
    }

    const data = await response.json();
    console.log('✅ API Response received:', data);
    
    if (!data.responses || !data.responses[0]) {
      console.error('❌ No response from Vision API');
      throw new Error('No response from Vision API');
    }

    const annotations = data.responses[0];
    
    // Check for errors in response
    if (annotations.error) {
      console.error('❌ Vision API returned error:', annotations.error);
      return getDemoResult(annotations.error.message || 'Unknown API error');
    }
    
    const fullText = annotations.fullTextAnnotation?.text || annotations.textAnnotations?.[0]?.description || '';
    console.log('📝 Extracted text:', fullText);
    
    // If no text detected, return empty result
    if (!fullText || fullText.trim().length === 0) {
      console.warn('⚠️ No text detected in image');
      return {
        text: 'No text detected in the image. Please try again with a clearer image.',
        confidence: 0,
        medications: [],
        dosages: [],
        warnings: ['No prescription text found - please ensure the image is clear and well-lit'],
      };
    }
    
    // Extract medications, dosages, and warnings from text
    const analysis = extractMedicalInfo(fullText);
    console.log('💊 Analysis complete:', {
      medications: analysis.medications.length,
      dosages: analysis.dosages.length,
      warnings: analysis.warnings.length,
    });

    const confidence = annotations.fullTextAnnotation?.pages?.[0]?.confidence || 0.85;

    return {
      text: fullText,
      confidence,
      ...analysis,
    };
  } catch (error) {
    console.error('❌ Vision API Error:', error);
    
    // Return demo data instead of failing
    if (error instanceof Error) {
      return getDemoResult(error.message);
    }
    return getDemoResult('Unknown error occurred');
  }
};

/**
 * Returns demo/fallback data when API fails
 */
function getDemoResult(errorMessage: string): VisionResponse {
  console.log('🎭 Returning demo prescription data');
  return {
    text: `DEMO MODE - API Error: ${errorMessage}\n\nDr. Sarah Johnson, MD\nPrescription\n\nPatient: Demo User\nDate: Nov 12, 2025\n\nRx:\n1. Amoxicillin 500mg\n   Take 1 capsule 3 times daily\n   Duration: 7 days\n\n2. Ibuprofen 400mg\n   Take 1 tablet every 6 hours as needed\n   Max 4 tablets per day\n\nWARNING: Do not take on empty stomach\nCAUTION: May cause drowsiness`,
    confidence: 0.95,
    medications: ['Amoxicillin', 'Ibuprofen'],
    dosages: ['500mg', '400mg', '1 capsule 3 times daily', '1 tablet every 6 hours'],
    warnings: [
      'WARNING: Do not take on empty stomach',
      'CAUTION: May cause drowsiness',
      `Note: API Error - ${errorMessage}. Showing demo data.`
    ],
  };
}

/**
 * Extracts medical information from OCR text
 */
const extractMedicalInfo = (text: string): {
  medications: string[];
  dosages: string[];
  warnings: string[];
} => {
  const medications: string[] = [];
  const dosages: string[] = [];
  const warnings: string[] = [];

  const upperText = text.toUpperCase();
  const lines = text.split('\n');

  // Common medication patterns (case-insensitive)
  const medicationPatterns = [
    /(?:tablet|capsule|syrup|injection|suspension|cream|ointment|drops)\s*[:.-]?\s*([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/gi,
    /([A-Z][a-z]+(?:ine|ol|cin|mycin|cillin|azole|pril|statin|zole|mab|tinib|afil))\s*(?:\d+\s*(?:mg|ml|mcg|g))?/g,
    /Rx\s*[:.-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,
  ];

  // Dosage patterns
  const dosagePatterns = [
    /(\d+\s*(?:mg|ml|mcg|g|units?|IU)(?:\s*\/\s*\d+\s*(?:mg|ml|mcg|g))?)/gi,
    /(\d+\s*(?:x|times)\s*(?:daily|per day|a day|weekly|per week))/gi,
    /(?:take|dosage|dose|frequency)\s*[:.-]?\s*([^\n.]{5,80})/gi,
    /(\d+\s*(?:tablet|capsule|drop|teaspoon|tablespoon)s?\s*(?:daily|per day|every\s+\d+\s*hours?))/gi,
  ];

  // Warning patterns
  const warningPatterns = [
    /(?:warning|caution|note|important|attention)\s*[:.-]?\s*([^\n]{10,200})/gi,
    /(?:do not|avoid|contraindication|not recommended)\s*[:.-]?\s*([^\n]{5,150})/gi,
    /(?:side effects?|adverse|reactions?)\s*[:.-]?\s*([^\n]{10,150})/gi,
  ];

  // Extract medications
  medicationPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const med = (match[1] || match[0])?.trim();
      if (med && med.length > 2 && med.length < 50 && !medications.includes(med)) {
        // Filter out common non-medication words
        const lower = med.toLowerCase();
        if (!['tablet', 'capsule', 'take', 'dose', 'daily', 'times', 'the', 'and', 'for', 'with'].includes(lower)) {
          medications.push(med);
        }
      }
    }
  });

  // Extract dosages
  dosagePatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const dosage = match[0]?.trim();
      if (dosage && dosage.length > 2 && !dosages.includes(dosage)) {
        dosages.push(dosage);
      }
    }
  });

  // Extract warnings
  warningPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const warning = match[0]?.trim();
      if (warning && warning.length > 5 && !warnings.includes(warning)) {
        warnings.push(warning);
      }
    }
  });

  // If no specific data found, try generic extraction
  if (medications.length === 0) {
    // Look for capitalized words that might be medications
    lines.forEach(line => {
      const words = line.split(/\s+/);
      words.forEach(word => {
        const cleaned = word.replace(/[^a-zA-Z]/g, '');
        if (cleaned.length > 4 && /^[A-Z][a-z]/.test(cleaned) && !medications.includes(cleaned)) {
          medications.push(cleaned);
        }
      });
    });
  }

  return { 
    medications: medications.slice(0, 10), // Limit to 10 most relevant
    dosages: dosages.slice(0, 10), 
    warnings: warnings.slice(0, 5) 
  };
};

/**
 * Analyzes prescription from file
 */
export const analyzePrescriptionFile = async (file: File): Promise<VisionResponse> => {
  const base64 = await fileToBase64(file);
  return analyzeImage(base64);
};

/**
 * Analyzes prescription from camera capture
 */
export const analyzePrescriptionFromCamera = async (
  video: HTMLVideoElement
): Promise<VisionResponse> => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(video, 0, 0);
  const base64 = canvasToBase64(canvas);
  
  return analyzeImage(base64);
};
