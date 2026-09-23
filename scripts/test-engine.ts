import { analyzeScam } from '../lib/engine/analyzer';
import { detectUrlsFromText, validateImageFile } from '../lib/ocr/extractText';

async function runTests() {
  console.log('=== RUNNING AI FINANCIAL SCAM DETECTOR TESTS ===\n');

  const testCases = [
    {
      name: 'Case 1: Fake KYC & Account Block Threat',
      text: 'URGENT! Your bank account will be blocked today. Complete KYC immediately by clicking this link: example-verification.com. Enter your OTP to verify.',
      expectedRisk: 'HIGH_RISK',
      expectedCategory: 'Fake KYC Scam',
      requiredRedFlags: ['URGENCY', 'ACCOUNT_BLOCK_THREAT', 'SUSPICIOUS_URL', 'OTP_REQUEST']
    },
    {
      name: 'Case 2: Legitimate Bank Statement Notification',
      text: 'Your monthly account statement is available in your banking app. Please log in through the official app to view it.',
      expectedRisk: 'LOW_CONCERN',
      expectedCategory: 'Unknown / Suspicious',
      requiredRedFlags: []
    },
    {
      name: 'Case 3: Guaranteed High-Yield Investment Scam',
      text: 'Invest ₹10,000 today and receive guaranteed ₹50,000 within 7 days. Limited slots! Send payment to reserve your account.',
      expectedRisk: 'HIGH_RISK',
      expectedCategory: 'Investment Scam',
      requiredRedFlags: ['GUARANTEED_RETURNS', 'PAYMENT_REQUEST', 'URGENCY']
    },
    {
      name: 'Case 4: UPI Scan & Enter PIN Trap',
      text: 'Dear Customer, ₹5,000 has been credited to your UPI wallet. Scan this QR code and enter your UPI PIN to claim money now.',
      expectedRisk: 'HIGH_RISK',
      expectedCategory: 'UPI / Payment Scam',
      requiredRedFlags: ['PIN_REQUEST']
    }
  ];

  let passed = 0;
  const total = testCases.length;

  for (const tc of testCases) {
    console.log(`Testing: ${tc.name}`);
    const result = await analyzeScam(tc.text);
    console.log(`- Risk Level: ${result.riskLevel} (Score: ${result.riskScore})`);
    console.log(`- Category: ${result.category}`);
    console.log(`- Red Flags (${result.redFlags.length}): ${result.redFlags.map(f => f.type).join(', ')}`);
    console.log(`- Confidence: ${result.confidence}%`);

    let tcPassed = true;
    if (result.riskLevel !== tc.expectedRisk) {
      console.error(`  ❌ Risk level mismatch: expected ${tc.expectedRisk}, got ${result.riskLevel}`);
      tcPassed = false;
    }

    if (tc.expectedCategory && result.category !== tc.expectedCategory) {
      console.warn(`  ⚠️ Category: expected ${tc.expectedCategory}, got ${result.category}`);
    }

    for (const rf of tc.requiredRedFlags) {
      if (!result.redFlags.some(f => f.type === rf)) {
        console.error(`  ❌ Missing required red flag: ${rf}`);
        tcPassed = false;
      }
    }

    if (tcPassed) {
      console.log('  ✅ PASSED\n');
      passed++;
    } else {
      console.log('  ❌ FAILED\n');
    }
  }

  // Test OCR Utilities
  console.log('Testing OCR URL Detection Utility:');
  const sampleOcrText = 'Bank KYC alert: visit http://sbi-kyc-update.xyz/verify or bit.ly/kyc2024 to unblock account.';
  const detected = detectUrlsFromText(sampleOcrText);
  console.log(`- Detected URLs: ${detected.join(', ')}`);
  if (detected.length >= 2 && detected.includes('http://sbi-kyc-update.xyz/verify')) {
    console.log('  ✅ URL DETECTION PASSED\n');
  } else {
    console.error('  ❌ URL DETECTION FAILED\n');
    process.exit(1);
  }

  // Test File Validation
  console.log('Testing File Validation Utility:');
  const mockValidFile = { name: 'suspicious_sms.png', type: 'image/png', size: 1024 * 500 } as unknown as File;
  const valResult = validateImageFile(mockValidFile);
  if (valResult.valid) {
    console.log('  ✅ FILE VALIDATION PASSED\n');
  } else {
    console.error('  ❌ FILE VALIDATION FAILED\n');
    process.exit(1);
  }

  console.log(`\nResult: ${passed}/${total} test cases passed.`);
  if (passed === total) {
    console.log('🎉 ALL ENGINE & OCR TEST CASES PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
