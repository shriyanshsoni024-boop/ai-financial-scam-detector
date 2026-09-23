export type RiskLevel = 'LOW_CONCERN' | 'NEEDS_CAUTION' | 'HIGH_RISK';

export type ScamCategory =
  | 'Fake KYC Scam'
  | 'Bank Impersonation Scam'
  | 'UPI / Payment Scam'
  | 'Phishing'
  | 'Fake Customer Support'
  | 'Investment Scam'
  | 'Lottery / Prize Scam'
  | 'Job / Task Scam'
  | 'Loan Scam'
  | 'Unknown / Suspicious';

export type RedFlagType =
  | 'URGENCY'
  | 'THREAT_FEAR'
  | 'OTP_REQUEST'
  | 'PIN_REQUEST'
  | 'PASSWORD_REQUEST'
  | 'CVV_CARD_REQUEST'
  | 'SUSPICIOUS_URL'
  | 'ACCOUNT_BLOCK_THREAT'
  | 'IMPERSONATION'
  | 'UNREALISTIC_REWARD'
  | 'GUARANTEED_RETURNS'
  | 'PAYMENT_REQUEST'
  | 'PROCESSING_FEE'
  | 'VERIFICATION_FEE'
  | 'SECURITY_DEPOSIT'
  | 'EMOTIONAL_MANIPULATION';

export interface RedFlag {
  id: string;
  type: RedFlagType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  evidence?: string[];
}

export interface AnalysisResult {
  id: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  category: ScamCategory;
  confidence: number; // 0 - 100 percentage
  redFlags: RedFlag[];
  explanation: string[];
  summary: string;
  recommendedActions: string[];
  avoidActions: string[];
  analyzedText: string;
  analyzedAt: string;
  inputType?: 'text' | 'screenshot';
  screenshotUrl?: string;
  detectedUrls?: string[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  detectedUrls: string[];
}

export interface SampleTestCase {
  id: string;
  title: string;
  preview: string;
  category: ScamCategory;
  expectedRisk: RiskLevel;
  text: string;
  tags: string[];
}
