import { AnalysisResult, RiskLevel, ScamCategory, RedFlag } from '@/types/scam';
import { extractRedFlags, classifyScamCategory } from './rules';
import { combineHybridAssessment } from '@/lib/ai/hybrid';

/**
 * Pure deterministic rule-based evaluation.
 * Always fast, deterministic, and serves as the rock-solid baseline.
 */
export function analyzeWithRules(text: string): AnalysisResult {
  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('Please provide text to analyze.');
  }

  const { redFlags, totalWeight } = extractRedFlags(cleanText);
  const category = classifyScamCategory(cleanText, redFlags);

  // Calculate normalized risk score between 0 and 100
  const highSeverityCount = redFlags.filter((f) => f.severity === 'high').length;
  const mediumSeverityCount = redFlags.filter((f) => f.severity === 'medium').length;

  let riskScore = Math.min(100, Math.round(totalWeight * 1.25));

  // Refine risk score based on high severity flags
  if (highSeverityCount >= 2) {
    riskScore = Math.max(riskScore, 85);
  } else if (highSeverityCount === 1) {
    riskScore = Math.max(riskScore, 65);
  } else if (mediumSeverityCount >= 2) {
    riskScore = Math.max(riskScore, 50);
  }

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW_CONCERN';
  if (riskScore >= 65 || highSeverityCount >= 1) {
    riskLevel = 'HIGH_RISK';
  } else if (riskScore >= 30 || mediumSeverityCount >= 1) {
    riskLevel = 'NEEDS_CAUTION';
  } else {
    riskLevel = 'LOW_CONCERN';
    riskScore = Math.max(5, Math.min(25, riskScore));
  }

  // Calculate Heuristic Confidence Score (percentage)
  let confidence = 88;
  if (riskLevel === 'HIGH_RISK') {
    confidence = Math.min(98, 85 + redFlags.length * 3);
  } else if (riskLevel === 'LOW_CONCERN') {
    confidence = 91;
  } else {
    confidence = 82;
  }

  // Generate Explanations & Summary
  const { summary, explanation } = generateAnalysisNarrative(riskLevel, category, redFlags);

  // Generate Actionable Advice
  const recommendedActions = generateRecommendedActions(riskLevel, category, redFlags);
  const avoidActions = generateAvoidActions(riskLevel, category, redFlags);

  return {
    id: `scam-analysis-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    riskLevel,
    riskScore,
    category,
    confidence,
    redFlags,
    explanation,
    summary,
    recommendedActions,
    avoidActions,
    analyzedText: cleanText,
    analyzedAt: new Date().toISOString(),
    analysisMode: 'heuristic',
    aiAnalysis: {
      enabled: false
    }
  };
}

/**
 * Main analysis function:
 * 1. Runs deterministic rule engine
 * 2. Attempts real AI evaluation via server API
 * 3. Combines signals into an explainable hybrid assessment
 * 4. Gracefully falls back to pure rule engine if AI is unavailable
 */
export async function analyzeScam(
  text: string,
  detectedUrls: string[] = []
): Promise<AnalysisResult> {
  const ruleResult = analyzeWithRules(text);

  // Client-side browser execution: call /api/analyze route
  if (typeof window !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          detectedUrls,
          ruleContext: {
            score: ruleResult.riskScore,
            category: ruleResult.category,
            flags: ruleResult.redFlags.map((f) => f.title)
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.ai) {
          return combineHybridAssessment(ruleResult, data.ai, data.model, data.latencyMs);
        }
      }
    } catch {
      // Network failure, timeout, or missing key -> seamlessly fallback to rule engine
    }

    return ruleResult;
  }

  // Server-side / CLI execution
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  if (apiKey) {
    try {
      const { analyzeWithGemini } = await import('@/lib/ai/gemini');
      const aiResult = await analyzeWithGemini(text, detectedUrls);
      return combineHybridAssessment(ruleResult, aiResult.response, aiResult.model, aiResult.latencyMs);
    } catch {
      // Fallback
      return ruleResult;
    }
  }

  return ruleResult;
}

function generateAnalysisNarrative(
  riskLevel: RiskLevel,
  category: ScamCategory,
  redFlags: RedFlag[]
): { summary: string; explanation: string[] } {
  const explanation: string[] = [];
  let summary = '';

  if (riskLevel === 'HIGH_RISK') {
    summary = `Multiple high-risk scam indicators detected. This message closely mirrors known patterns of ${category}. Please exercise extreme caution and verify independently before taking any action.`;

    explanation.push(
      `Pattern Assessment: The analyzed text exhibits ${redFlags.length} distinctive red flags commonly leveraged by cyber fraudsters to induce panic or offer deceptive incentives.`
    );

    const highFlags = redFlags.filter((f) => f.severity === 'high');
    if (highFlags.length > 0) {
      explanation.push(
        `Critical Risk Factors: Detected ${highFlags.map((f) => `"${f.title}"`).join(', ')}. Legitimate financial organizations do not demand credentials, OTPs, or immediate payments via unverified channels.`
      );
    }

    if (redFlags.some((f) => f.type === 'URGENCY' || f.type === 'ACCOUNT_BLOCK_THREAT')) {
      explanation.push(
        'Psychological Coercion: Threatening account closure or imposing tight deadlines is a social-engineering tactic designed to bypass logical verification.'
      );
    }

    if (redFlags.some((f) => f.type === 'SUSPICIOUS_URL')) {
      explanation.push(
        'Phishing Link Threat: The message directs to an unverified or shortened web address intended to harvest banking credentials or deploy malicious APK files.'
      );
    }
  } else if (riskLevel === 'NEEDS_CAUTION') {
    summary = `Some potentially suspicious indicators detected. While not conclusively fraudulent, certain elements require caution and independent verification.`;

    explanation.push(
      `Heuristic Evaluation: Found ${redFlags.length} indicator(s) that match borderline promotional or financial request patterns.`
    );
    explanation.push(
      'Verify Origin: Cross-check the sender ID or phone number against official banking applications before interacting with any attachments or links.'
    );
  } else {
    summary = `Few suspicious indicators detected. The text appears consistent with routine informational or transactional updates, but always maintain standard security hygiene.`;

    explanation.push(
      'Baseline Check: No overt credential requests, emergency account threats, or malicious phishing vectors were identified.'
    );
    explanation.push(
      'Standard Caution: Even for regular notices, always navigate directly to the official banking portal or mobile app rather than tapping embedded links.'
    );
  }

  return { summary, explanation };
}

function generateRecommendedActions(riskLevel: RiskLevel, category: ScamCategory, flags: RedFlag[]): string[] {
  const actions: string[] = [];

  if (riskLevel === 'HIGH_RISK') {
    actions.push('Report the incident to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or dial 1930.');
    actions.push('Contact your bank directly via the official phone number printed on the back of your debit/credit card.');
    actions.push('Block and mark the sender as spam in your messaging app (SMS, WhatsApp, or Email).');

    if (flags.some((f) => f.type === 'OTP_REQUEST' || f.type === 'PASSWORD_REQUEST' || f.type === 'PIN_REQUEST')) {
      actions.push('If you already entered credentials, immediately freeze your account/cards via your official banking app and change all passwords.');
    }

    if (category === 'UPI / Payment Scam') {
      actions.push('Check your UPI transaction history and report any unauthorized requests on your UPI app (BHIM, GPay, PhonePe, Paytm).');
    }
  } else if (riskLevel === 'NEEDS_CAUTION') {
    actions.push('Verify the communication by logging into your official banking app directly.');
    actions.push('Do not use any contact numbers provided within the message itself.');
    actions.push('Confirm with your local bank branch if you have doubts regarding account status or KYC.');
  } else {
    actions.push('Open your bank app directly from your home screen if you need to review transactions or statements.');
    actions.push('Ensure two-factor authentication (2FA) is active across all your financial accounts.');
  }

  return actions;
}

function generateAvoidActions(riskLevel: RiskLevel, category: ScamCategory, flags: RedFlag[]): string[] {
  const avoids: string[] = [
    'Never share your OTP, UPI PIN, ATM PIN, or Internet Banking password with anyone.',
    'Do NOT click on unverified links, shortened URLs, or download unknown APK attachments.'
  ];

  if (flags.some((f) => f.type === 'PIN_REQUEST' || category === 'UPI / Payment Scam')) {
    avoids.push('Never enter your UPI PIN to "receive" or "claim" money. Entering a PIN always debits your account.');
  }

  if (flags.some((f) => f.type === 'ACCOUNT_BLOCK_THREAT')) {
    avoids.push('Do NOT panic or respond in haste to threats of immediate account deactivation.');
  }

  if (category === 'Investment Scam' || flags.some((f) => f.type === 'GUARANTEED_RETURNS')) {
    avoids.push('Do NOT transfer money to personal UPI IDs or individual bank accounts promising guaranteed investment gains.');
  }

  if (category === 'Fake Customer Support') {
    avoids.push('Do NOT install remote desktop applications like AnyDesk, TeamViewer, or QuickSupport on your device.');
  }

  return avoids;
}
