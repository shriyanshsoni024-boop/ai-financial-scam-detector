import { RedFlag, RedFlagType, ScamCategory } from '@/types/scam';

interface RuleDefinition {
  type: RedFlagType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  patterns: RegExp[];
  weight: number;
}

export const RED_FLAG_RULES: RuleDefinition[] = [
  {
    type: 'OTP_REQUEST',
    title: 'OTP / One-Time Password Solicitations',
    description: 'The message requests or instructs you to share or enter a one-time password (OTP). Legitimate institutions never ask for OTPs.',
    severity: 'high',
    weight: 25,
    patterns: [
      /\b(enter|share|send|provide|give|submit|confirm|tell)\s+(your\s+)?(otp|one[-\s]time[-\s]password|6[-\s]digit\s+code|verification\s+code)\b/i,
      /\botp\s*(to\s+verify|for\s+verification|to\s+confirm|required|needed)\b/i,
      /\benter\s+your\s+otp\b/i,
      /\bforward\s+this\s+otp\b/i,
      /\b(share|give)\s+the\s+code\b/i
    ]
  },
  {
    type: 'PIN_REQUEST',
    title: 'UPI / ATM PIN Request',
    description: 'The message requests your UPI or ATM PIN. Remember: You never need to enter your PIN to receive money in UPI.',
    severity: 'high',
    weight: 25,
    patterns: [
      /\b(enter|share|type|send)\s+(your\s+)?(upi\s*pin|atm\s*pin|4[-\s]digit\s*pin|6[-\s]digit\s*pin|security\s*pin|mpin)\b/i,
      /\benter\s+pin\s+to\s+(receive|claim|accept|credit|get)\s+money\b/i,
      /\bscan\s+qr\s+(and|to)\s+enter\s+pin\b/i
    ]
  },
  {
    type: 'PASSWORD_REQUEST',
    title: 'Login / Net Banking Password Solicitation',
    description: 'Direct request to enter or share banking passwords or login credentials.',
    severity: 'high',
    weight: 25,
    patterns: [
      /\b(enter|provide|share|update)\s+(your\s+)?(netbanking|online\s+banking|banking|account)\s+password\b/i,
      /\bpassword\s+(reset|expired|required)\b/i,
      /\blogin\s+credentials\b/i
    ]
  },
  {
    type: 'CVV_CARD_REQUEST',
    title: 'Card Details & CVV Solicitation',
    description: 'Soliciting 16-digit card numbers, expiration dates, or CVV/CVC security codes.',
    severity: 'high',
    weight: 25,
    patterns: [
      /\b(enter|provide|share)\s+(your\s+)?(cvv|cvc|card\s*number|debit\s*card\s*details|credit\s*card\s*details|expiry\s*date)\b/i,
      /\b16[-\s]digit\s+card\b/i
    ]
  },
  {
    type: 'ACCOUNT_BLOCK_THREAT',
    title: 'Account Deactivation or Suspension Threat',
    description: 'Threatens that your bank account, card, SIM, or utility service will be blocked or deactivated if you do not act.',
    severity: 'high',
    weight: 20,
    patterns: [
      /\b(account|card|sim|service|electricity|power)\s+(will\s+be\s+|is\s+)?(blocked|suspended|deactivated|terminated|closed|frozen|disabled)\b/i,
      /\b(block|suspend|deactivate|freeze)\s+(your\s+)?(account|card|netbanking|access|services?)\b/i,
      /\baccount\s+restricted\b/i,
      /\bkyc\s+(expired|pending|suspended|overdue)\b/i,
      /\bpan\s+(card\s+)?(not\s+updated|blocked|deactivated)\b/i
    ]
  },
  {
    type: 'URGENCY',
    title: 'Artificial Urgency & Time Pressure',
    description: 'Creates artificial panic and rushes you to take immediate action without verification.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(urgent|urgently|immediately|immediate\s+action|hurry|act\s+fast|rush|last\s+chance|final\s+warning|within\s+\d+\s*(hours?|hrs?|mins?|minutes?)|today\s+itself|expire[s]?\s+today)\b/i,
      /\bdo\s+not\s+delay\b/i,
      /\blimited\s+(time|slots?|period|offer)\b/i,
      /\bvalid\s+only\s+for\s+today\b/i
    ]
  },
  {
    type: 'SUSPICIOUS_URL',
    title: 'Suspicious / Unverified Web Link or APK',
    description: 'Contains shortened URLs, third-party unverified domains, IP addresses, or dangerous application (.apk) download links.',
    severity: 'high',
    weight: 20,
    patterns: [
      /\b(?:https?:\/\/)?(?:www\.)?(?:bit\.ly|tinyurl\.com|t\.co|is\.gd|cutt\.ly|rb\.gy|shorturl\.at|ngrok\.io|serveo\.net)[^\s]*/i,
      /\b(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)+(?:xyz|top|live|club|buzz|click|online|site|work|gq|cf|ml|tk|fit|rest|monster|icu|cam)[^\s]*/i,
      /\b(?:https?:\/\/)?\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:[^\s]*)?/i,
      /\b[a-zA-Z0-9-]+\.(?:apk|app|download)\b/i,
      /\b(click|visit|open)\s+(this\s+)?(link|url|website|portal):?\s*[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i,
      /\b(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)*(?:sbi|hdfc|icici|axis|pnb|paytm|phonepe|gpay|bank)[a-zA-Z0-9-]*\.(?!com|in|co\.in|org)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i,
      /\bexample-verification\.com\b/i
    ]
  },
  {
    type: 'GUARANTEED_RETURNS',
    title: 'Guaranteed Financial Returns / Get Rich Quick',
    description: 'Promises unrealistic guaranteed returns, doubling money in days, or zero-risk investment profits.',
    severity: 'high',
    weight: 20,
    patterns: [
      /\b(guaranteed|fixed|assured)\s+(return[s]?|profit[s]?|income|gain[s]?)\b/i,
      /\b(double|triple|10x|100x)\s+(your\s+)?(money|investment|income)\b/i,
      /\breceive\s+guaranteed\b/i,
      /\bearn\s+(₹|\$|rs\.?|inr)?\s*\d+([,\d]*)\s*(daily|per\s+day|every\s+day|within\s+\d+\s*days?)\b/i,
      /\bzero\s+risk\s+investment\b/i
    ]
  },
  {
    type: 'UNREALISTIC_REWARD',
    title: 'Unrealistic Prize / Lottery / Reward Claim',
    description: 'Claims you have won a lottery, prize money, cash reward, or contest you never participated in.',
    severity: 'high',
    weight: 20,
    patterns: [
      /\b(congratulations|you\s+have\s+won|selected\s+for|lucky\s+winner|prize\s+money|lottery|kbc|jackpot|reward\s+points\s+worth)\b/i,
      /\bclaim\s+(your\s+)?(prize|reward|cashback|gift|iphone|car|bonus)\b/i,
      /\bwon\s+(₹|\$|rs\.?|inr)?\s*\d+([,\d]*)\b/i
    ]
  },
  {
    type: 'PAYMENT_REQUEST',
    title: 'Upfront Payment / Fund Transfer Demand',
    description: 'Requires sending money to reserve, claim, unlock, or process funds.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(send|transfer|deposit|pay)\s+(payment|money|amount|(₹|\$|rs\.?|inr)?\s*\d+([,\d]*))\s+(to\s+reserve|to\s+claim|to\s+activate|to\s+verify|to\s+release)\b/i,
      /\bsend\s+payment\s+to\b/i,
      /\badvance\s+payment\b/i
    ]
  },
  {
    type: 'PROCESSING_FEE',
    title: 'Advance Processing / Handling Fee Requirement',
    description: 'Asks for upfront processing or documentation fees before releasing a loan, prize, or job payment.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(processing|handling|documentation|clearance|file|release)\s+fee[s]?\b/i,
      /\bpay\s+(nominal|small|initial)\s+charges?\b/i
    ]
  },
  {
    type: 'VERIFICATION_FEE',
    title: 'Mandatory Verification / Activation Fee',
    description: 'Demands an upfront fee under the guise of account verification, refundable charge, or activation.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(verification|activation|registration|kyc)\s+(fee[s]?|charge[s]?|amount)\b/i,
      /\bpay\s+(₹|\$|rs\.?|inr)?\s*\d+\s+for\s+verification\b/i
    ]
  },
  {
    type: 'SECURITY_DEPOSIT',
    title: 'Upfront Security Deposit / Collateral Demand',
    description: 'Requests a refundable security deposit before commencing remote work, task assignments, or rental/loan releases.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(security|refundable)\s+deposit\b/i,
      /\bdeposit\s+(₹|\$|rs\.?|inr)?\s*\d+\s+(as\s+security|first)\b/i
    ]
  },
  {
    type: 'IMPERSONATION',
    title: 'Brand / Authority Impersonation',
    description: 'Impersonates banks, government agencies (RBI, Police, CBI, IT Dept), couriers, or tech support.',
    severity: 'medium',
    weight: 15,
    patterns: [
      /\b(sbi|hdfc|icici|axis\s*bank|punjab\s*national\s*bank|pnb|reserve\s*bank\s*of\s*india|rbi|income\s*tax\s*department|cbi|mumbai\s*police|trai|fedex|customs\s*officer|telegram\s*admin|whatsapp\s*support)\b/i,
      /\bofficial\s+bank\s+(notice|alert|officer)\b/i,
      /\byour\s+bank\s+(manager|head\s+office)\b/i
    ]
  },
  {
    type: 'THREAT_FEAR',
    title: 'Legal Action / Police / Disconnection Threat',
    description: 'Uses intimidation, arrest threats, legal notices, or essential service cutoffs to coerce compliance.',
    severity: 'high',
    weight: 20,
    patterns: [
      /\b(legal\s+action|police\s+case|arrest\s+warrant|court\s+notice|penalty\s+of|fir\s+will\s+be\s+filed|electricity\s+will\s+be\s+disconnected|power\s+cut\s+tonight)\b/i,
      /\bofficial\s+legal\s+proceedings\b/i
    ]
  },
  {
    type: 'EMOTIONAL_MANIPULATION',
    title: 'Confidentiality Pressure / Emotional Manipulation',
    description: 'Instructs you to keep the conversation secret, bypass bank staff, or exploit family distress.',
    severity: 'medium',
    weight: 10,
    patterns: [
      /\b(do\s+not\s+inform|keep\s+it\s+secret|confidential\s+matter|don't\s+tell\s+anyone|don't\s+tell\s+bank\s+branch|family\s+emergency|hospital\s+emergency)\b/i,
      /\bsecret\s+assignment\b/i
    ]
  }
];

export function extractRedFlags(text: string): { redFlags: RedFlag[]; totalWeight: number } {
  const flags: RedFlag[] = [];
  let totalWeight = 0;

  for (const rule of RED_FLAG_RULES) {
    const matchedEvidence: string[] = [];

    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (match) {
        matchedEvidence.push(match[0]);
      }
    }

    if (matchedEvidence.length > 0) {
      flags.push({
        id: `flag-${rule.type.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: rule.type,
        title: rule.title,
        description: rule.description,
        severity: rule.severity,
        evidence: Array.from(new Set(matchedEvidence))
      });
      totalWeight += rule.weight;
    }
  }

  return { redFlags: flags, totalWeight };
}

export function classifyScamCategory(text: string, flags: RedFlag[]): ScamCategory {
  const lower = text.toLowerCase();

  // Fake KYC Scam
  if (
    (lower.includes('kyc') || lower.includes('pan card') || lower.includes('aadhaar')) &&
    (lower.includes('block') || lower.includes('suspend') || lower.includes('update') || lower.includes('link') || lower.includes('verify'))
  ) {
    return 'Fake KYC Scam';
  }

  // UPI / Payment Scam
  if (
    lower.includes('upi') ||
    lower.includes('gpay') ||
    lower.includes('phonepe') ||
    lower.includes('paytm') ||
    lower.includes('qr code') ||
    lower.includes('scan to receive') ||
    lower.includes('enter pin to receive')
  ) {
    return 'UPI / Payment Scam';
  }

  // Investment Scam
  if (
    lower.includes('guaranteed') ||
    lower.includes('double') ||
    lower.includes('invest') ||
    lower.includes('returns') ||
    lower.includes('crypto') ||
    lower.includes('trading profit') ||
    lower.includes('per day profit')
  ) {
    return 'Investment Scam';
  }

  // Job / Task Scam
  if (
    lower.includes('telegram task') ||
    lower.includes('like youtube') ||
    lower.includes('part-time job') ||
    lower.includes('work from home') ||
    lower.includes('daily salary') ||
    lower.includes('review product') ||
    lower.includes('rating task')
  ) {
    return 'Job / Task Scam';
  }

  // Lottery / Prize Scam
  if (
    lower.includes('won') ||
    lower.includes('winner') ||
    lower.includes('lottery') ||
    lower.includes('kbc') ||
    lower.includes('lucky draw') ||
    lower.includes('prize') ||
    lower.includes('cash reward')
  ) {
    return 'Lottery / Prize Scam';
  }

  // Loan Scam
  if (
    lower.includes('instant loan') ||
    lower.includes('pre-approved loan') ||
    lower.includes('loan approved') ||
    lower.includes('disbursement fee') ||
    lower.includes('loan sanction')
  ) {
    return 'Loan Scam';
  }

  // Fake Customer Support
  if (
    lower.includes('anydesk') ||
    lower.includes('teamviewer') ||
    lower.includes('quicksupport') ||
    lower.includes('customer care') ||
    lower.includes('helpline number') ||
    lower.includes('support desk')
  ) {
    return 'Fake Customer Support';
  }

  // Bank Impersonation Scam
  if (
    (lower.includes('bank') || lower.includes('sbi') || lower.includes('hdfc') || lower.includes('icici') || lower.includes('axis') || lower.includes('rbi')) &&
    flags.some((f) => f.severity === 'high' || f.type === 'ACCOUNT_BLOCK_THREAT' || f.type === 'OTP_REQUEST')
  ) {
    return 'Bank Impersonation Scam';
  }

  // Phishing
  if (flags.some((f) => f.type === 'SUSPICIOUS_URL' || f.type === 'PASSWORD_REQUEST' || f.type === 'OTP_REQUEST')) {
    return 'Phishing';
  }

  if (flags.length > 0) {
    return 'Unknown / Suspicious';
  }

  return 'Unknown / Suspicious';
}
