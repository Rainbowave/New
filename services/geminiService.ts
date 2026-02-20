
import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent top-level crashes if process.env isn't ready immediately
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to sanitize JSON output from the model (removes markdown code blocks)
function cleanJsonString(text: string): string {
  if (!text) return "{}";
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
}

const ADULT_TAGS = [
    "absol", "eeveelution", "espeon", "stallion (character)", "stallion (words worth)", "words worth",
    "absurd res", "english text", "hi res", "text", "abs", "angry", "anthro", "april swanton",
    "armwear", "big breasts", "blush", "bodily fluids", "body hair", "breasts", "choker",
    "clothing", "cross-popping vein", "crotchless clothing", "cum", "cum on face", "cutaway",
    "dancing", "devious grin", "ear piercing", "ear ring", "ejaculation", "ejaculation between thighs",
    "equid", "equine", "erection", "genital fluids", "genitals", "gentital fluids", "glans",
    "hair", "happy trail", "horse", "humanoid genitalia", "humanoid penis", "looking pleasured",
    "male", "muscular", "nicoak", "penis", "red hair", "solo", "teeth showing", "tongue",
    "tongue out", "vein"
];

const DATING_TAGS = [
    "absol", "eeveelution", "espeon", "stallion (character)", "stallion (words worth)", "words worth",
    "absurd res", "english text", "hi res", "text", "abs", "angry", "anthro", "april swanton",
    "armwear", "athletic build", "blush", "confident pose", "body hair", "fit physique",
    "choker", "clothing", "intense expression", "stylish outfit", "charming smile"
];

/**
 * Star Validation Protocol
 * Uses Gemini 3 Pro with max thinking budget (32768) for deep-logic community safety scan.
 * Analyzes proof for face detection, code matching, and authenticity.
 */
export async function analyzeVerificationProof(proofFile: File, expectedCode: string): Promise<any> {
  try {
    const imagePart = await fileToGenerativePart(proofFile);
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          imagePart,
          { text: `VERIFICATION AUDIT: 
          1. FACE DETECTION: Confirm precisely one human face is visible.
          2. OCR VALIDATION: Locate handwritten or printed code. It MUST match "${expectedCode}" exactly.
          3. AUTHENTICITY: Detect AI-generation, deepfakes, or "photo of a photo" indicators.
          4. AGE AUDIT: Visual estimate to confirm subject is 18+.
          
          Return JSON: 
          { 
            "verified": boolean, 
            "confidence": number, 
            "checks": { 
              "faceVisible": boolean, 
              "codeMatch": boolean, 
              "isRealPhoto": boolean, 
              "isAdult": boolean 
            },
            "reason": string (Explanation if verified is false)
          }` }
        ]
      },
      config: {
        systemInstruction: "You are the LuciSin Security System. Perform exhaustive validation. High precision is mandatory to detect sophisticated forgery.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });

    return JSON.parse(cleanJsonString(response.text || "{}"));
  } catch (error) {
    console.error("AI Forensic Failure:", error);
    return { verified: false, reason: "Security system connection timeout. Please try again." };
  }
}

/**
 * Creative Content Assistant
 * Uses Gemini 3 Pro with max thinking budget for handling complex creator queries.
 */
export async function generateAssistantResponse(prompt: string, context: string): Promise<string> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Context: ${context}\n\nCreator Request: ${prompt}`,
      config: {
        systemInstruction: "You are the LuciSin Creative Assistant. Help stars grow their Following and maximize Heat (Likes) through high-quality content advice. Use community terms.",
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });
    return response.text || "I couldn't process that advice at this time.";
  } catch (error) {
    console.error("Assistant Error:", error);
    return "Strategic signal loss. Recalibrating.";
  }
}

export async function analyzeImageForTags(imageFile: File, mode: 'dating' | 'adult' = 'dating'): Promise<string[]> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const ai = getAI();
    
    // Switch instructions based on mode using specific vocabularies
    const vocabList = mode === 'adult' ? ADULT_TAGS.join(', ') : DATING_TAGS.join(', ');
    const contextDesc = mode === 'adult' ? "an adult-oriented creator platform ('Naughty Mode')" : "a wholesome dating and lifestyle app ('Dating Mode')";
    
    const systemInstruction = `You are analyzing content for ${contextDesc}. 
    Generate 6-10 tags. 
    PRIORITIZE using terms from this specific vocabulary list if applicable: [${vocabList}]. 
    If the image contains elements not in the list, generate accurate descriptive tags consistent with the ${mode} theme.
    Return ONLY a JSON array of strings.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: {
        parts: [
          imagePart,
          { text: "Generate context-aware social tags for this image based on the provided vocabulary." }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });
    return JSON.parse(cleanJsonString(response.text || "[]"));
  } catch (error) {
    return [];
  }
}

/**
 * Moderation AI Analyst
 * Uses Gemini 3 Pro to analyze reported content and context.
 */
export async function analyzeModerationCase(report: any): Promise<any> {
  try {
    const ai = getAI();
    // Convert URL to Generative Part
    const imgResponse = await fetch(report.contentPreview);
    const blob = await imgResponse.blob();
    const imagePart = await fileToGenerativePart(new File([blob], "evidence.jpg", { type: blob.type }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          imagePart,
          { text: `MODERATION AUDIT:
          Report Reason: ${report.reason}
          Details: ${report.details}
          
          Analyze the attached content and the report details. 
          Determine if this content violates standard community safety guidelines (e.g. Hate Speech, Nudity, Harassment, Spam).
          
          Return JSON:
          {
            "violation": boolean,
            "severity": "low" | "medium" | "high",
            "recommendedAction": "keep" | "remove" | "ban",
            "reasoning": "detailed explanation (max 20 words)"
          }` }
        ]
      },
      config: {
        systemInstruction: "You are a Trust & Safety AI. Analyze content with high scrutiny using the Thinking Protocol.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return JSON.parse(cleanJsonString(response.text || "{}"));
  } catch (error) {
    console.error("Moderation AI Error:", error);
    return { violation: false, reasoning: "AI Analysis failed." };
  }
}

async function fileToGenerativePart(file: File) {
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });
  return { inlineData: { data: base64Data, mimeType: file.type } };
}
