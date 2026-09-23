import { analyzeScam } from '../lib/engine/analyzer';
import { detectUrlsFromText, validateImageFile } from '../lib/ocr/extractText';
import { analyzeUrl, validateAndNormalizeUrl } from '../lib/url/urlAnalyzer';

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

  // Test URL Analyzer
  console.log('=== TESTING URL HEURISTIC ANALYZER ===\n');

  const urlTestCases = [
    {
      name: 'URL Test 1: Typosquatting + Insecure HTTP + Suspicious TLD (.xyz)',
      url: 'http://sbi-kyc-update.xyz/verify-pan?session=9382&token=abc83719',
      expectedStatus: 'Suspicious',
      expectedRisk: 'HIGH_RISK',
      requiredFlags: ['TYPOSQUATTING', 'INSECURE_HTTP', 'SUSPICIOUS_TLD']
    },
    {
      name: 'URL Test 2: IP-Based Hostname',
      url: 'http://192.241.144.22/secure-banking/login.php',
      expectedStatus: 'Suspicious',
      expectedRisk: 'HIGH_RISK',
      requiredFlags: ['IP_BASED_URL', 'INSECURE_HTTP']
    },
    {
      name: 'URL Test 3: URL Shortener Service',
      url: 'https://bit.ly/sbi-urgent-reward',
      expectedStatus: 'Suspicious',
      expectedRisk: 'HIGH_RISK',
      requiredFlags: ['URL_SHORTENER']
    },
    {
      name: 'URL Test 4: Executable Package (.apk)',
      url: 'https://security-download-hub.net/banking-update.apk',
      expectedStatus: 'Suspicious',
      expectedRisk: 'HIGH_RISK',
      requiredFlags: ['DANGEROUS_FILE_EXTENSION']
    },
    {
      name: 'URL Test 5: Clean Official Banking Domain',
      url: 'https://www.onlinesbi.sbi/',
      expectedStatus: 'No obvious red flags detected',
      expectedRisk: 'LOW_CONCERN',
      requiredFlags: []
    }
  ];

  let urlPassed = 0;
  for (const utc of urlTestCases) {
    console.log(`Testing: ${utc.name}`);
    const res = await analyzeUrl(utc.url);
    console.log(`- Domain: ${res.urlDetails?.domain}`);
    console.log(`- Status: ${res.urlDetails?.statusLabel} (Risk: ${res.riskLevel}, Score: ${res.riskScore})`);
    console.log(`- Flags: ${res.redFlags.map((f) => f.type).join(', ') || 'None'}`);

    let passedCase = true;
    if (res.urlDetails?.statusLabel !== utc.expectedStatus) {
      console.error(`  ❌ Status mismatch: expected "${utc.expectedStatus}", got "${res.urlDetails?.statusLabel}"`);
      passedCase = false;
    }

    if (res.riskLevel !== utc.expectedRisk) {
      console.error(`  ❌ Risk level mismatch: expected "${utc.expectedRisk}", got "${res.riskLevel}"`);
      passedCase = false;
    }

    for (const rf of utc.requiredFlags) {
      if (!res.redFlags.some((f) => f.type === rf)) {
        console.error(`  ❌ Missing required URL flag: ${rf}`);
        passedCase = false;
      }
    }

    if (passedCase) {
      console.log('  ✅ PASSED\n');
      urlPassed++;
    } else {
      console.log('  ❌ FAILED\n');
    }
  }

  // Test URL Validation Utility
  const invalidVal = validateAndNormalizeUrl('not a valid hostname :::');
  if (!invalidVal.isValid) {
    console.log('  ✅ URL INVALID FORMAT REJECTION PASSED\n');
  } else {
    console.error('  ❌ URL INVALID FORMAT REJECTION FAILED\n');
    process.exit(1);
  }

  // Test History & Dashboard Telemetry
  console.log('=== TESTING SCAN HISTORY & DASHBOARD TELEMETRY ===\n');
  const { getHistoryStats, INITIAL_SAMPLE_SCANS, formatScanDate } = await import('../lib/history');

  const historyStats = getHistoryStats(INITIAL_SAMPLE_SCANS);
  console.log(`- Sample Scans Count: ${INITIAL_SAMPLE_SCANS.length}`);
  console.log(`- Computed Stats: Total=${historyStats.total}, HighRisk=${historyStats.highRisk}, NeedsCaution=${historyStats.needsCaution}, LowConcern=${historyStats.lowConcern}`);

  let historyPassed = true;
  if (historyStats.total !== 4 || historyStats.highRisk !== 3 || historyStats.lowConcern !== 1) {
    console.error('  ❌ History stats computation mismatch');
    historyPassed = false;
  } else {
    console.log('  ✅ HISTORY STATS COMPUTATION PASSED');
  }

  const sampleDateFormatted = formatScanDate(new Date(Date.now() - 1000 * 60 * 10).toISOString());
  console.log(`- Relative Date Format (10m ago): "${sampleDateFormatted}"`);
  if (sampleDateFormatted === '10m ago') {
    console.log('  ✅ DATE FORMATTING UTILITY PASSED\n');
  } else {
    console.error(`  ❌ Date format unexpected: ${sampleDateFormatted}`);
    historyPassed = false;
  }

  console.log(`\nOverall Test Results:`);
  console.log(`- Text Engine: ${passed}/${total} passed`);
  console.log(`- URL Engine: ${urlPassed}/${urlTestCases.length} passed`);
  console.log(`- History & Dashboard Engine: ${historyPassed ? '1/1 passed' : '0/1 passed'}`);

  if (passed === total && urlPassed === urlTestCases.length && historyPassed) {
    console.log('\n🎉 ALL ENGINE, OCR, URL, AND DASHBOARD HISTORY TESTS PASSED SUCCESSFULLY!');
  } else {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});

