import { SampleTestCase } from '@/types/scam';

export const SAMPLE_TEST_CASES: SampleTestCase[] = [
  {
    id: 'test-case-1',
    title: 'Fake KYC & Account Block Threat',
    preview: 'URGENT! Your bank account will be blocked today...',
    category: 'Fake KYC Scam',
    expectedRisk: 'HIGH_RISK',
    tags: ['Fake KYC', 'Account Block', 'OTP Trap', 'Urgent Link'],
    text: 'URGENT! Your bank account will be blocked today. Complete KYC immediately by clicking this link: example-verification.com. Enter your OTP to verify.'
  },
  {
    id: 'test-case-2',
    title: 'Legitimate Bank Statement Notification',
    preview: 'Your monthly account statement is available in your banking app...',
    category: 'Unknown / Suspicious',
    expectedRisk: 'LOW_CONCERN',
    tags: ['Safe Notice', 'Official App', 'No Demands'],
    text: 'Your monthly account statement is available in your banking app. Please log in through the official app to view it.'
  },
  {
    id: 'test-case-3',
    title: 'Guaranteed High-Yield Investment Scam',
    preview: 'Invest ₹10,000 today and receive guaranteed ₹50,000 within 7 days...',
    category: 'Investment Scam',
    expectedRisk: 'HIGH_RISK',
    tags: ['Guaranteed Returns', '5x Profit', 'Payment Demand'],
    text: 'Invest ₹10,000 today and receive guaranteed ₹50,000 within 7 days. Limited slots! Send payment to reserve your account.'
  },
  {
    id: 'test-case-4',
    title: 'UPI "Scan & Enter PIN to Receive" Fraud',
    preview: '₹5,000 credited to your UPI wallet. Scan QR and enter PIN to claim...',
    category: 'UPI / Payment Scam',
    expectedRisk: 'HIGH_RISK',
    tags: ['UPI PIN Trap', 'QR Code Scam', 'Fake Credit'],
    text: 'Dear Customer, ₹5,000 has been credited to your UPI wallet. Scan this QR code and enter your UPI PIN to claim money now.'
  },
  {
    id: 'test-case-5',
    title: 'Part-Time Telegram Job / Task Scam',
    preview: 'Earn ₹3,500 daily by liking YouTube videos. Send ₹500 registration fee...',
    category: 'Job / Task Scam',
    expectedRisk: 'HIGH_RISK',
    tags: ['Work From Home', 'Task Scam', 'Registration Fee'],
    text: 'Work from Home opportunity! Earn ₹3,500 daily by liking YouTube videos and rating hotels on Google. Send ₹500 registration fee to begin your first task.'
  },
  {
    id: 'test-case-6',
    title: 'Urgent Electricity Disconnection Threat',
    preview: 'Your electricity power will be disconnected tonight at 9:30 PM...',
    category: 'Unknown / Suspicious',
    expectedRisk: 'HIGH_RISK',
    tags: ['Utility Threat', 'Fear Inducement', 'Fake Helpline'],
    text: 'Urgent Notice: Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM due to unpaid bill. Call electricity officer immediately at 9876543210 to update bill.'
  }
];

export interface SampleScreenshotPreset {
  id: string;
  title: string;
  category: string;
  expectedRisk: string;
  lines: string[];
}

export const SAMPLE_SCREENSHOTS: SampleScreenshotPreset[] = [
  {
    id: 'screenshot-sample-1',
    title: 'Bank KYC Suspension Alert',
    category: 'Fake KYC Scam',
    expectedRisk: 'HIGH_RISK',
    lines: [
      'BANK ALERT: Dear Customer,',
      'Your NetBanking access will be BLOCKED today.',
      'Mandatory KYC pending as per regulatory order.',
      'Click http://sbi-kyc-update.xyz to update Aadhaar.',
      'Enter your received OTP to prevent permanent deactivation.'
    ]
  },
  {
    id: 'screenshot-sample-2',
    title: 'UPI Cash Refund Collect Trap',
    category: 'UPI / Payment Scam',
    expectedRisk: 'HIGH_RISK',
    lines: [
      'CASHBACK NOTIFICATION',
      'You have won a cashback refund of Rs 4,999.',
      'Scan this QR code in GPay or PhonePe.',
      'Enter your UPI PIN to claim money into your bank.',
      'Offer expires in 10 minutes.'
    ]
  },
  {
    id: 'screenshot-sample-3',
    title: 'VIP Trading Guaranteed 5X Scheme',
    category: 'Investment Scam',
    expectedRisk: 'HIGH_RISK',
    lines: [
      'CRYPTO VIP SIGNALS CLUB',
      'Guaranteed 500% daily profit returns!',
      'Deposit Rs 5,000 to receive Rs 25,000 within 24 hours.',
      'Zero risk insider strategy. Limited slots remaining.',
      'Send payment screenshot to @admin_cryptovip'
    ]
  }
];

export function createSampleScreenshotDataUrl(preset: SampleScreenshotPreset): string {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 420;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Dark canvas background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 720, 420);

    // Subtle border
    ctx.strokeStyle = '#292929';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 718, 418);

    // Header bar
    ctx.fillStyle = '#111111';
    ctx.fillRect(2, 2, 716, 60);
    ctx.strokeStyle = '#292929';
    ctx.beginPath();
    ctx.moveTo(2, 62);
    ctx.lineTo(718, 62);
    ctx.stroke();

    // Header text
    ctx.fillStyle = '#b6ff00';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('SCAMSHIELD / SUSPICIOUS SCREENSHOT SAMPLE', 24, 38);

    // Message Container
    ctx.fillStyle = '#111111';
    ctx.fillRect(24, 84, 672, 310);
    ctx.strokeStyle = '#292929';
    ctx.strokeRect(24, 84, 672, 310);

    // Message Title
    ctx.fillStyle = '#f2f2f2';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(preset.title.toUpperCase(), 48, 126);

    // Divider
    ctx.strokeStyle = '#292929';
    ctx.beginPath();
    ctx.moveTo(48, 142);
    ctx.lineTo(660, 142);
    ctx.stroke();

    // Body Lines
    ctx.fillStyle = '#d1d1d1';
    ctx.font = '16px monospace';
    let y = 178;
    for (const line of preset.lines) {
      ctx.fillText(line, 48, y);
      y += 34;
    }

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}
