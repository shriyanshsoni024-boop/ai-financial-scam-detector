import { AnalysisResult } from '@/types/scam';

export const HISTORY_STORAGE_KEY = 'sentinelshield_scan_history';
export const HISTORY_INIT_KEY = 'sentinelshield_history_initialized';

export interface HistoryStats {
  total: number;
  highRisk: number;
  needsCaution: number;
  lowConcern: number;
}

/**
 * Baseline initial scans populated only on first visit if user storage is completely empty.
 */
export const INITIAL_SAMPLE_SCANS: AnalysisResult[] = [
  {
    id: 'scan-sample-001',
    riskLevel: 'HIGH_RISK',
    riskScore: 92,
    category: 'Fake KYC Scam',
    confidence: 96,
    redFlags: [
      {
        id: 'rf-1',
        type: 'ACCOUNT_BLOCK_THREAT',
        title: 'Account Suspension / Block Threat',
        description: 'Threatens immediate account deactivation unless urgent action is taken.',
        severity: 'high'
      },
      {
        id: 'rf-2',
        type: 'SUSPICIOUS_URL',
        title: 'Suspicious Non-Official Domain',
        description: 'Directs user to an unverified third-party verification portal.',
        severity: 'high'
      },
      {
        id: 'rf-3',
        type: 'OTP_REQUEST',
        title: 'Credential / OTP Solicitation',
        description: 'Demands one-time password or security code submission.',
        severity: 'high'
      }
    ],
    explanation: [
      'Message employs coercive urgency to force panic compliance.',
      'Includes an external unverified hyperlink pretending to be official KYC.',
      'Asks for authentication credentials which banks never request.'
    ],
    summary: 'High probability Fake KYC credential phishing campaign mimicking standard banking alerts.',
    recommendedActions: [
      'Do not click the link or provide any OTP.',
      'Report sender to 1930 National Cyber Crime Helpline.',
      'Verify account status directly in your official banking application.'
    ],
    avoidActions: [
      'Never share OTP or banking passwords.',
      'Never call phone numbers provided inside suspicious SMS alerts.'
    ],
    analyzedText: 'URGENT: Your SBI account will be blocked today due to pending KYC. Update Aadhaar immediately at http://sbi-kyc-update.xyz to prevent deactivation.',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    inputType: 'text'
  },
  {
    id: 'scan-sample-002',
    riskLevel: 'HIGH_RISK',
    riskScore: 88,
    category: 'UPI / Payment Scam',
    confidence: 94,
    redFlags: [
      {
        id: 'rf-4',
        type: 'PIN_REQUEST',
        title: 'UPI PIN Request on Receive Trap',
        description: 'Tricks victim into entering UPI PIN to receive money (UPI PIN is ONLY for sending).',
        severity: 'high'
      },
      {
        id: 'rf-5',
        type: 'UNREALISTIC_REWARD',
        title: 'Unsolicited Cash Reward Claim',
        description: 'Promises large cash rebate to incentivize immediate QR scanning.',
        severity: 'medium'
      }
    ],
    explanation: [
      'Entering a UPI PIN authorizes a debit from your account, never a credit.',
      'Scammers use fake payment gateways disguised as reward claims.'
    ],
    summary: 'UPI PIN manipulation trap attempting to extract funds via reverse authorization.',
    recommendedActions: [
      'Reject incoming collect requests in PhonePe / GPay / Paytm.',
      'Block the sender UPI ID immediately.'
    ],
    avoidActions: [
      'Never enter your UPI PIN to receive funds or cashback rewards.'
    ],
    analyzedText: 'CASHBACK NOTIFICATION: You have won Rs 4,999 cashback. Scan QR in GPay and enter UPI PIN to receive money into your account.',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    inputType: 'screenshot'
  },
  {
    id: 'scan-sample-003',
    riskLevel: 'HIGH_RISK',
    riskScore: 85,
    category: 'Phishing',
    confidence: 90,
    redFlags: [
      {
        id: 'rf-6',
        type: 'TYPOSQUATTING',
        title: 'Deceptive Brand Impersonation Domain',
        description: 'URL contains brand keywords combined with scam identifiers.',
        severity: 'high'
      },
      {
        id: 'rf-7',
        type: 'INSECURE_HTTP',
        title: 'Unencrypted HTTP Connection',
        description: 'Website lacks SSL encryption, indicating a rogue server.',
        severity: 'medium'
      }
    ],
    explanation: [
      'The domain mimics standard banking portals but belongs to a malicious registrar.'
    ],
    summary: 'Rogue phishing infrastructure targeting online banking credentials.',
    recommendedActions: [
      'Close browser tab immediately.',
      'Bookmark official bank URL and access only via bookmark.'
    ],
    avoidActions: [
      'Do not enter card numbers, CVVs, or NetBanking login passwords.'
    ],
    analyzedText: 'http://sbi-kyc-update.xyz/verify-pan?session=9382',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    inputType: 'url',
    urlDetails: {
      rawUrl: 'http://sbi-kyc-update.xyz/verify-pan?session=9382',
      normalizedUrl: 'http://sbi-kyc-update.xyz/verify-pan?session=9382',
      domain: 'sbi-kyc-update.xyz',
      hostname: 'sbi-kyc-update.xyz',
      protocol: 'http:',
      pathname: '/verify-pan',
      searchParamsCount: 1,
      isHttps: false,
      isIpAddress: false,
      isShortener: false,
      hasSuspiciousSubdomains: false,
      hasExcessiveParams: false,
      isTyposquatting: true,
      hasSuspiciousTld: true,
      statusLabel: 'Suspicious',
      keySignals: ['Typosquatting detected', 'Insecure HTTP protocol', 'Suspicious .xyz TLD']
    }
  },
  {
    id: 'scan-sample-004',
    riskLevel: 'LOW_CONCERN',
    riskScore: 5,
    category: 'Unknown / Suspicious',
    confidence: 98,
    redFlags: [],
    explanation: [
      'Standard informational message without coercive language or credential requests.'
    ],
    summary: 'Standard advisory notification with zero detected threat signatures.',
    recommendedActions: [
      'No protective action required.',
      'Access bank communications strictly via official mobile application.'
    ],
    avoidActions: [],
    analyzedText: 'Your monthly account statement for July 2026 is ready. Log in to official NetBanking to view your e-statement.',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hours ago
    inputType: 'text'
  }
];

/**
 * Retrieve current scan history from localStorage.
 * Initializes with sample scans if user is visiting for the first time.
 */
export function getScanHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') {
    return INITIAL_SAMPLE_SCANS;
  }

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const hasInitialized = localStorage.getItem(HISTORY_INIT_KEY);

    if (raw === null && !hasInitialized) {
      // First visit: seed default samples
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SCANS));
      localStorage.setItem(HISTORY_INIT_KEY, 'true');
      return INITIAL_SAMPLE_SCANS;
    }

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to read scan history from localStorage:', err);
    return [];
  }
}

/**
 * Prepend a new scan result to history and persist to localStorage (capped at 50 entries).
 */
export function saveScanToHistory(result: AnalysisResult): AnalysisResult[] {
  if (typeof window === 'undefined') {
    return [result];
  }

  try {
    const current = getScanHistory();
    // Filter out if duplicate ID exists
    const filtered = current.filter((item) => item.id !== result.id);
    const updated = [result, ...filtered].slice(0, 50);

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(HISTORY_INIT_KEY, 'true');
    return updated;
  } catch (err) {
    console.error('Failed to save scan to history:', err);
    return [result];
  }
}

/**
 * Delete a specific scan from history by ID.
 */
export function deleteScanFromHistory(id: string): AnalysisResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const current = getScanHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete scan from history:', err);
    return [];
  }
}

/**
 * Clear all scan history and mark explicitly empty.
 */
export function clearScanHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([]));
    localStorage.setItem(HISTORY_INIT_KEY, 'true');
  } catch (err) {
    console.error('Failed to clear scan history:', err);
  }
}

/**
 * Restore sample records into history.
 */
export function loadSampleScans(): AnalysisResult[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_SCANS;

  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SCANS));
    localStorage.setItem(HISTORY_INIT_KEY, 'true');
    return INITIAL_SAMPLE_SCANS;
  } catch (err) {
    console.error('Failed to load sample scans:', err);
    return INITIAL_SAMPLE_SCANS;
  }
}

/**
 * Compute aggregate telemetry statistics from a scan list.
 */
export function getHistoryStats(history: AnalysisResult[]): HistoryStats {
  const stats: HistoryStats = {
    total: history.length,
    highRisk: 0,
    needsCaution: 0,
    lowConcern: 0
  };

  for (const item of history) {
    if (item.riskLevel === 'HIGH_RISK') {
      stats.highRisk++;
    } else if (item.riskLevel === 'NEEDS_CAUTION') {
      stats.needsCaution++;
    } else if (item.riskLevel === 'LOW_CONCERN') {
      stats.lowConcern++;
    }
  }

  return stats;
}

/**
 * Format timestamp into concise human readable date.
 */
export function formatScanDate(isoDateString?: string): string {
  if (!isoDateString) return 'Recent';

  try {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) return 'Recent';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return 'Recent';
  }
}
