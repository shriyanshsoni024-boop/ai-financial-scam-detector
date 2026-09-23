import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResponse, RiskLevel, ScamCategory } from '@/types/scam';

const GEMINI_MODEL = 'gemini-2.5-flash';

const ALLOWED_CATEGORIES: ScamCategory[] = [
  'Fake KYC Scam',
  'Bank Impersonation Scam',
  'UPI / Payment Scam',
  'Phishing',
  'Fake Customer Support',
  'Investment Scam',
  'Lottery / Prize Scam',
  'Job / Task Scam',
  'Loan Scam',
  'Unknown / Suspicious'
];

/**
 * Sanitize text to remove sensitive credential patterns before processing.
 */
export function sanitizeAnalysisInput(text: string): string {
  if (!text) return '';
  // Redact apparent 16-digit card numbers and 6-digit OTP codes in prompt content
  return text
    .replace(/\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, '[CARD_NUMBER_REDACTED]')
    .replace(/\b(otp|code|pin)[:\s]+(\d{4,6})\b/gi, '$1: [REDACTED]');
}

/**
 * Normalize and strictly validate raw JSON from Gemini into AIAnalysisResponse.
 */
export function parseAndValidateAIResponse(rawJson: unknown): AIAnalysisResponse {
  if (!rawJson || typeof rawJson !== 'object') {
    throw new Error('AI response is not an object.');
  }

  const obj = rawJson as Record<string, unknown>;

  // Validate Risk Level
  let riskLevel: RiskLevel = 'NEEDS_CAUTION';
  if (typeof obj.riskLevel === 'string') {
    const norm = obj.riskLevel.toUpperCase().replace(/\s+/g, '_');
    if (norm.includes('HIGH') || norm === 'HIGH_RISK') {
      riskLevel = 'HIGH_RISK';
    } else if (norm.includes('LOW') || norm === 'LOW_CONCERN') {
      riskLevel = 'LOW_CONCERN';
    } else if (norm.includes('CAUTION') || norm === 'NEEDS_CAUTION') {
      riskLevel = 'NEEDS_CAUTION';
    }
  }

  // Validate Scam Category
  let scamCategory: ScamCategory = 'Unknown / Suspicious';
  if (typeof obj.scamCategory === 'string') {
    const found = ALLOWED_CATEGORIES.find(
      (c) => c.toLowerCase() === (obj.scamCategory as string).toLowerCase()
    );
    if (found) {
      scamCategory = found;
    } else if (obj.scamCategory.includes('KYC')) {
      scamCategory = 'Fake KYC Scam';
    } else if (obj.scamCategory.includes('Bank') || obj.scamCategory.includes('Impersonat')) {
      scamCategory = 'Bank Impersonation Scam';
    } else if (obj.scamCategory.includes('UPI') || obj.scamCategory.includes('Payment')) {
      scamCategory = 'UPI / Payment Scam';
    } else if (obj.scamCategory.includes('Phish')) {
      scamCategory = 'Phishing';
    } else if (obj.scamCategory.includes('Invest') || obj.scamCategory.includes('Crypto')) {
      scamCategory = 'Investment Scam';
    } else if (obj.scamCategory.includes('Job') || obj.scamCategory.includes('Task')) {
      scamCategory = 'Job / Task Scam';
    } else if (obj.scamCategory.includes('Loan')) {
      scamCategory = 'Loan Scam';
    } else if (obj.scamCategory.includes('Support') || obj.scamCategory.includes('Help')) {
      scamCategory = 'Fake Customer Support';
    } else if (obj.scamCategory.includes('Lottery') || obj.scamCategory.includes('Prize')) {
      scamCategory = 'Lottery / Prize Scam';
    }
  }

  // Validate Confidence
  let confidence = 75;
  if (typeof obj.confidence === 'number' && !isNaN(obj.confidence)) {
    confidence = Math.min(100, Math.max(0, Math.round(obj.confidence)));
  }

  // Validate Summary
  let summary = 'Heuristic assessment indicates potential indicators requiring verification.';
  if (typeof obj.summary === 'string' && obj.summary.trim().length > 0) {
    summary = obj.summary.trim();
  }

  // Validate Red Flags
  const redFlags: string[] = [];
  if (Array.isArray(obj.redFlags)) {
    for (const item of obj.redFlags) {
      if (typeof item === 'string' && item.trim().length > 0) {
        redFlags.push(item.trim());
      }
    }
  }

  // Validate Recommended Actions
  const recommendedActions: string[] = [];
  if (Array.isArray(obj.recommendedActions)) {
    for (const act of obj.recommendedActions) {
      if (typeof act === 'string' && act.trim().length > 0) {
        recommendedActions.push(act.trim());
      }
    }
  }

  return {
    scamCategory,
    riskLevel,
    confidence,
    summary,
    redFlags: redFlags.length > 0 ? redFlags : ['Suspicious communication pattern detected.'],
    recommendedActions:
      recommendedActions.length > 0
        ? recommendedActions
        : ['Independently verify message through official bank channels.']
  };
}

/**
 * Perform real AI analysis via Google Gemini API.
 */
export async function analyzeWithGemini(
  text: string,
  detectedUrls: string[] = []
): Promise<{ response: AIAnalysisResponse; model: string; latencyMs: number }> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const sanitized = sanitizeAnalysisInput(text);
  const startTime = Date.now();

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are ScamShield AI, an advanced digital financial fraud and cyber extortion analysis engine.
Your mission is to evaluate communications (SMS alerts, payment notifications, chat messages, URLs) for fraudulent manipulation.

Recognized scam categories:
- Fake KYC Scam (threats to freeze accounts/SIM unless KYC link is tapped)
- Bank Impersonation Scam (spoofed bank security or RBI alerts)
- UPI / Payment Scam (PIN collection traps, fake cashback QR codes)
- Phishing (cloned banking portals, credential harvesters)
- Fake Customer Support (fake toll-free numbers, remote desktop apps)
- Investment Scam (5x–10x guaranteed returns, crypto VIP signals)
- Job / Task Scam (prepaid tasks, video liking deposits)
- Loan Scam (advance fee loan approvals)
- Unknown / Suspicious (benign notices or unverified content)

SAFETY CONSTRAINTS:
- NEVER claim certainty that a message is 100% definitely a scam.
- Use prudent, explainable terminology such as "potentially suspicious", "high-risk indicators detected", or "requires independent verification".
- Output MUST be valid, parseable JSON conforming strictly to the requested schema with zero markdown wrappers around the JSON.`;

  const prompt = `Analyze this message and context for financial security risks:

CONTENT TO ANALYZE:
"${sanitized}"

DETECTED URLS:
${detectedUrls.length > 0 ? detectedUrls.join(', ') : 'None'}

Return ONLY a valid JSON object matching this schema:
{
  "scamCategory": "Fake KYC Scam" | "Bank Impersonation Scam" | "UPI / Payment Scam" | "Phishing" | "Fake Customer Support" | "Investment Scam" | "Job / Task Scam" | "Loan Scam" | "Unknown / Suspicious",
  "riskLevel": "LOW_CONCERN" | "NEEDS_CAUTION" | "HIGH_RISK",
  "confidence": 85,
  "summary": "1-2 sentence explainable diagnostic summary using cautious security language.",
  "redFlags": ["specific suspicious pattern 1", "specific suspicious pattern 2"],
  "recommendedActions": ["step 1 for user safety", "step 2 for user safety"]
}`;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  });

  const responseText = response.text || '';
  const latencyMs = Date.now() - startTime;

  if (!responseText) {
    throw new Error('Empty response from Gemini AI model.');
  }

  // Parse JSON
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(responseText);
  } catch {
    // Attempt cleaning markdown fences if present
    const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedJson = JSON.parse(cleaned);
  }

  const validated = parseAndValidateAIResponse(parsedJson);

  return {
    response: validated,
    model: GEMINI_MODEL,
    latencyMs
  };
}
