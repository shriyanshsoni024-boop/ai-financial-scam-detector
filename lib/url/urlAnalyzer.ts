import {
  AnalysisResult,
  RedFlag,
  RiskLevel,
  ScamCategory,
  UrlAnalysisDetails
} from '@/types/scam';

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'wa.me',
  'ow.ly',
  'buff.ly',
  'trib.al',
  'goo.gl',
  'qr.ae',
  'adf.ly',
  'bit.do',
  'lnkd.in',
  'rebrand.ly',
  'v.gd',
  's.id',
  'clck.ru',
  'ngrok.io',
  'serveo.net',
  'page.link'
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'live',
  'club',
  'buzz',
  'click',
  'online',
  'site',
  'work',
  'gq',
  'cf',
  'ml',
  'tk',
  'fit',
  'rest',
  'monster',
  'icu',
  'cam',
  'vip',
  'cc',
  'ws',
  'link',
  'stream',
  'bid',
  'download',
  'racing',
  'kim',
  'party',
  'trade',
  'date',
  'faith',
  'accountant',
  'loan',
  'win',
  'cricket'
]);

const FINANCIAL_BRAND_KEYWORDS = [
  'sbi',
  'statebank',
  'hdfc',
  'icici',
  'axis',
  'pnb',
  'punjabnational',
  'paytm',
  'phonepe',
  'gpay',
  'googlepay',
  'bhim',
  'rbi',
  'kotak',
  'bob',
  'canara',
  'unionbank',
  'netbanking',
  'onlinesbi',
  'kyc',
  'aadhaar',
  'incometax',
  'citibank',
  'indusind',
  'yesbank',
  'bankofbaroda'
];

const OFFICIAL_VERIFIED_DOMAINS = new Set([
  'onlinesbi.sbi',
  'sbi.co.in',
  'statebankofindia.com',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'pnbindia.in',
  'paytm.com',
  'phonepe.com',
  'rbi.org.in',
  'kotak.com',
  'bankofbaroda.in',
  'canarabank.com',
  'unionbankofindia.co.in',
  'incometax.gov.in',
  'uidai.gov.in',
  'npci.org.in',
  'google.com',
  'apple.com',
  'microsoft.com',
  'amazon.in',
  'amazon.com'
]);

const SENSITIVE_QUERY_PARAMS = new Set([
  'otp',
  'pin',
  'password',
  'token',
  'session',
  'cvv',
  'cvc',
  'card',
  'redirect',
  'auth_token',
  'key',
  'secret',
  'seed',
  'auth',
  'user_id',
  'account_no',
  'mpin'
]);

export interface UrlValidationResult {
  isValid: boolean;
  error?: string;
  normalizedUrl?: string;
  urlObj?: URL;
}

/**
 * Validates and normalizes user-provided URL or domain string.
 */
export function validateAndNormalizeUrl(rawInput: string): UrlValidationResult {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter a URL or domain to evaluate.' };
  }

  // Prepend protocol if missing
  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = `http://${candidate}`;
  }

  try {
    const parsed = new URL(candidate);
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return { isValid: false, error: 'Invalid hostname format.' };
    }

    // Check for valid hostname characters (alphanumeric, dots, hyphens, colons for IPv6)
    if (!/^[a-zA-Z0-9.:\-_[\]]+$/.test(parsed.hostname)) {
      return { isValid: false, error: 'Hostname contains unsupported characters.' };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.toString(),
      urlObj: parsed
    };
  } catch {
    return { isValid: false, error: 'Unable to parse URL. Please check the address format.' };
  }
}

/**
 * Executes heuristic security inspection on a URL.
 */
export async function analyzeUrl(rawUrl: string): Promise<AnalysisResult> {
  // Brief latency simulation for smooth UX
  await new Promise((resolve) => setTimeout(resolve, 400));

  const validation = validateAndNormalizeUrl(rawUrl);
  if (!validation.isValid || !validation.urlObj || !validation.normalizedUrl) {
    throw new Error(validation.error || 'Invalid URL provided.');
  }

  const urlObj = validation.urlObj;
  const hostname = urlObj.hostname.toLowerCase();
  const protocol = urlObj.protocol.toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();
  const searchParams = urlObj.searchParams;

  const redFlags: RedFlag[] = [];
  const keySignals: string[] = [];
  let totalScore = 0;

  // 1. IP-Based URL Check
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/.test(hostname);
  const isIpv6 = hostname.startsWith('[') && hostname.endsWith(']');
  const isIpAddress = isIpv4 || isIpv6;

  if (isIpAddress) {
    redFlags.push({
      id: `flag-ip-${Date.now()}`,
      type: 'IP_BASED_URL',
      title: 'IP-Based Hostname Addressing',
      description: 'The destination directly uses a numerical IP address instead of a registered domain name. Legitimate institutions rely on verified domain registries.',
      severity: 'high',
      evidence: [hostname]
    });
    keySignals.push('Direct IP Addressing');
    totalScore += 35;
  }

  // 2. HTTPS / Encryption Check
  const isHttps = protocol === 'https:';
  if (!isHttps) {
    redFlags.push({
      id: `flag-http-${Date.now()}`,
      type: 'INSECURE_HTTP',
      title: 'Insecure HTTP Protocol',
      description: 'Communication is unencrypted. Credentials, OTPs, or session data sent to this endpoint can be intercepted.',
      severity: 'medium',
      evidence: [protocol]
    });
    keySignals.push('Unencrypted Protocol (HTTP)');
    totalScore += 20;
  }

  // 3. URL Shortener Service Check
  const isShortener = KNOWN_SHORTENERS.has(hostname) || Array.from(KNOWN_SHORTENERS).some((s) => hostname.endsWith(`.${s}`));
  if (isShortener) {
    redFlags.push({
      id: `flag-shortener-${Date.now()}`,
      type: 'URL_SHORTENER',
      title: 'URL Shortener Service Detected',
      description: 'The link utilizes a shortening redirection service that conceals the ultimate server destination and domain identity.',
      severity: 'high',
      evidence: [hostname]
    });
    keySignals.push(`URL Shortener (${hostname})`);
    totalScore += 25;
  }

  // 4. Suspicious / High-Abuse TLD Check
  const hostParts = hostname.split('.');
  const tld = hostParts[hostParts.length - 1];
  const hasSuspiciousTld = SUSPICIOUS_TLDS.has(tld);

  if (hasSuspiciousTld) {
    redFlags.push({
      id: `flag-tld-${Date.now()}`,
      type: 'SUSPICIOUS_TLD',
      title: `Suspicious Top-Level Domain (.${tld})`,
      description: `The domain utilizes a high-abuse TLD (.${tld}) commonly leveraged in disposable phishing infrastructure.`,
      severity: 'medium',
      evidence: [`.${tld}`]
    });
    keySignals.push(`High-Abuse TLD (.${tld})`);
    totalScore += 20;
  }

  // 5. Typosquatting & Brand Impersonation Check
  const isOfficialDomain = OFFICIAL_VERIFIED_DOMAINS.has(hostname) || Array.from(OFFICIAL_VERIFIED_DOMAINS).some((d) => hostname.endsWith(`.${d}`));
  let isTyposquatting = false;
  let matchedBrandName = '';

  if (!isOfficialDomain && !isIpAddress && !isShortener) {
    for (const brand of FINANCIAL_BRAND_KEYWORDS) {
      if (hostname.includes(brand)) {
        isTyposquatting = true;
        matchedBrandName = brand;
        break;
      }
    }
  }

  if (isTyposquatting) {
    redFlags.push({
      id: `flag-typosquatting-${Date.now()}`,
      type: 'TYPOSQUATTING',
      title: `Brand Keyword in Unofficial Domain ("${matchedBrandName.toUpperCase()}")`,
      description: `The domain name incorporates financial brand terms ("${matchedBrandName}") but does not match the official verified domain registry.`,
      severity: 'high',
      evidence: [hostname]
    });
    keySignals.push(`Brand Impersonation (${matchedBrandName.toUpperCase()})`);
    totalScore += 35;
  }

  // 6. Suspicious Subdomains Check
  let hasSuspiciousSubdomains = false;
  if (!isIpAddress && hostParts.length >= 4) {
    hasSuspiciousSubdomains = true;
    redFlags.push({
      id: `flag-subdomain-${Date.now()}`,
      type: 'SUSPICIOUS_SUBDOMAIN',
      title: 'Deep / Misleading Subdomain Hierarchy',
      description: 'The URL uses multi-level subdomains to simulate legitimate brand prefixes on top of an unrelated root domain.',
      severity: 'high',
      evidence: [hostname]
    });
    keySignals.push('Multi-Level Subdomains');
    totalScore += 25;
  }

  // 7. Excessive or Sensitive Query Parameters Check
  const paramKeys = Array.from(searchParams.keys()).map((k) => k.toLowerCase());
  const foundSensitiveParams = paramKeys.filter((k) => SENSITIVE_QUERY_PARAMS.has(k));
  const hasExcessiveParams = paramKeys.length >= 4 || foundSensitiveParams.length > 0;

  if (hasExcessiveParams) {
    const evidenceList: string[] = [];
    if (foundSensitiveParams.length > 0) {
      evidenceList.push(`Sensitive keys: ${foundSensitiveParams.join(', ')}`);
    }
    if (paramKeys.length >= 4) {
      evidenceList.push(`${paramKeys.length} total parameters`);
    }

    redFlags.push({
      id: `flag-params-${Date.now()}`,
      type: 'EXCESSIVE_URL_PARAMETERS',
      title: 'Suspicious / Sensitive URL Query Parameters',
      description: 'The URL includes sensitive parameter keys (e.g. tokens, session, redirect, OTP) often leveraged in credential exfiltration flows.',
      severity: 'medium',
      evidence: evidenceList
    });
    keySignals.push(`Sensitive Query Params (${paramKeys.length})`);
    totalScore += 15;
  }

  // 8. Dangerous File Extension in Path
  const dangerousExtMatch = pathname.match(/\.(apk|exe|scr|bat|vbs|iso|msi)$/i);
  if (dangerousExtMatch) {
    const ext = dangerousExtMatch[1].toUpperCase();
    redFlags.push({
      id: `flag-file-${Date.now()}`,
      type: 'DANGEROUS_FILE_EXTENSION',
      title: `Direct Application Package Download (.${ext})`,
      description: `The URL links directly to an executable installer (.${ext}). Never install applications from unverified web links.`,
      severity: 'high',
      evidence: [pathname]
    });
    keySignals.push(`Direct Executable Download (.${ext})`);
    totalScore += 30;
  }

  // Risk Classification
  const highSeverityCount = redFlags.filter((f) => f.severity === 'high').length;
  const mediumSeverityCount = redFlags.filter((f) => f.severity === 'medium').length;

  let riskLevel: RiskLevel = 'LOW_CONCERN';
  let statusLabel: 'Suspicious' | 'Needs Caution' | 'No obvious red flags detected' = 'No obvious red flags detected';
  let category: ScamCategory = 'Unknown / Suspicious';
  let riskScore = 10;

  if (highSeverityCount >= 1 || totalScore >= 45) {
    riskLevel = 'HIGH_RISK';
    statusLabel = 'Suspicious';
    riskScore = Math.min(95, Math.max(65, totalScore));
    category = isTyposquatting ? 'Bank Impersonation Scam' : 'Phishing';
  } else if (mediumSeverityCount >= 1 || totalScore >= 20) {
    riskLevel = 'NEEDS_CAUTION';
    statusLabel = 'Needs Caution';
    riskScore = Math.min(60, Math.max(35, totalScore));
    category = 'Phishing';
  } else {
    riskLevel = 'LOW_CONCERN';
    statusLabel = 'No obvious red flags detected';
    riskScore = 10;
    category = 'Unknown / Suspicious';
  }

  if (keySignals.length === 0) {
    keySignals.push('Standard Domain Format', 'HTTPS Encryption');
  }

  // Explanations & Summaries adhering to required neutral/objective security tone
  let summary = '';
  const explanation: string[] = [];

  if (statusLabel === 'Suspicious') {
    summary = `Suspicious: Multiple indicators of deception detected (e.g. ${keySignals.slice(0, 2).join(', ')}). Independent verification is strongly recommended before proceeding.`;
    explanation.push(`Domain Assessment: The address "${hostname}" triggers ${redFlags.length} security heuristics.`);
    explanation.push('Deceptive Pattern: Unofficial domains or direct IP addresses are frequently deployed to harvest credentials.');
  } else if (statusLabel === 'Needs Caution') {
    summary = `Needs Caution: Some non-standard indicators detected (${keySignals.slice(0, 2).join(', ')}). Exercise caution and verify the source.`;
    explanation.push(`Heuristic Note: Found ${redFlags.length} signal(s) requiring attention.`);
    explanation.push('Verify Identity: Always inspect the full address bar in your browser before entering sensitive information.');
  } else {
    summary = `No obvious red flags detected: The URL structure conforms to standard domain conventions. Always ensure you are on the intended website before submitting credentials.`;
    explanation.push('Baseline Inspection: Standard HTTPS protocol and domain structure verified.');
    explanation.push('General Hygiene: Even on clean domains, confirm the address matches the official bookmark.');
  }

  // Recommended Actions
  const recommendedActions: string[] = [
    'Verify the destination by manually navigating to the official website from a trusted search or bookmark.',
    'Check for a valid TLS certificate and confirm the exact domain spelling in your browser address bar.'
  ];

  if (statusLabel === 'Suspicious' || statusLabel === 'Needs Caution') {
    recommendedActions.push('Report suspicious links to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930.');
  }

  // Prohibited Actions
  const avoidActions: string[] = [
    'Never enter net-banking passwords, UPI PINs, or OTPs on unverified web links.',
    'Do not download or install APK applications from external links.'
  ];

  if (isIpAddress || isTyposquatting) {
    avoidActions.push('Do not approve any pop-up permission requests or login prompts on this domain.');
  }

  const urlDetails: UrlAnalysisDetails = {
    rawUrl,
    normalizedUrl: validation.normalizedUrl,
    domain: hostname,
    hostname,
    protocol,
    pathname,
    searchParamsCount: paramKeys.length,
    isHttps,
    isIpAddress,
    isShortener,
    hasSuspiciousSubdomains,
    hasExcessiveParams,
    isTyposquatting,
    hasSuspiciousTld,
    statusLabel,
    keySignals
  };

  return {
    id: `url-analysis-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    riskLevel,
    riskScore,
    category,
    confidence: statusLabel === 'Suspicious' ? 92 : statusLabel === 'Needs Caution' ? 85 : 89,
    redFlags,
    explanation,
    summary,
    recommendedActions,
    avoidActions,
    analyzedText: validation.normalizedUrl,
    analyzedAt: new Date().toISOString(),
    inputType: 'url',
    detectedUrls: [validation.normalizedUrl],
    urlDetails
  };
}
