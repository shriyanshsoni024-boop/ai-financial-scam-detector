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
  | 'EMOTIONAL_MANIPULATION'
  | 'IP_BASED_URL'
  | 'URL_SHORTENER'
  | 'SUSPICIOUS_SUBDOMAIN'
  | 'TYPOSQUATTING'
  | 'EXCESSIVE_URL_PARAMETERS'
  | 'INSECURE_HTTP'
  | 'SUSPICIOUS_TLD'
  | 'DANGEROUS_FILE_EXTENSION';

export interface RedFlag {
  id: string;
  type: RedFlagType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  evidence?: string[];
}

export interface UrlAnalysisDetails {
  rawUrl: string;
  normalizedUrl: string;
  domain: string;
  hostname: string;
  protocol: string;
  pathname: string;
  searchParamsCount: number;
  isHttps: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  hasSuspiciousSubdomains: boolean;
  hasExcessiveParams: boolean;
  isTyposquatting: boolean;
  hasSuspiciousTld: boolean;
  statusLabel: 'Suspicious' | 'Needs Caution' | 'No obvious red flags detected';
  keySignals: string[];
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
  inputType?: 'text' | 'screenshot' | 'url';
  screenshotUrl?: string;
  detectedUrls?: string[];
  urlDetails?: UrlAnalysisDetails;
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
