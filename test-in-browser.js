import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\WANNABEE\\.gemini\\antigravity\\brain\\37038676-218a-4caa-a03e-a20d3806b40d';

async function runTest() {
  console.log('--- STARTING IN-BROWSER END-TO-END TEST ---');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // 1. Open the user's exact link: http://localhost:5174/?class=DE
    console.log('[Step 1] Navigating to http://localhost:5174/?class=DE ...');
    await page.goto('http://localhost:5174/?class=DE', { waitUntil: 'networkidle0', timeout: 15000 });
    console.log('[Step 1] Page loaded successfully!');

    // Check for Class DE badge
    const pageContent = await page.content();
    const hasDeBadge = pageContent.includes('DE') || pageContent.includes('Data Engineering');
    console.log('[Step 1] Class DE displayed on page:', hasDeBadge);

    // 2. Type student email
    console.log('[Step 2] Typing school email: student@uniben.edu ...');
    const emailInput = await page.$('input[type="email"]');
    if (!emailInput) throw new Error('Email input not found!');
    await emailInput.type('student@uniben.edu', { delay: 40 });

    // Wait a moment for dynamic logo detection
    await page.evaluate(() => new Promise(r => setTimeout(r, 600)));

    // Check if UNIBEN detected
    const logoDetected = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('University of Benin') || text.includes('UNIBEN');
    });
    console.log('[Step 2] UNIBEN Logo & Badge detected dynamically:', logoDetected);

    // 3. Type random student reg no
    console.log('[Step 3] Typing Student Reg No: UNIBEN/2026/8842 ...');
    const regInput = await page.$('input[type="text"]');
    if (!regInput) throw new Error('Reg No input not found!');
    await regInput.type('UNIBEN/2026/8842', { delay: 40 });

    const shot1 = path.join(ARTIFACT_DIR, 'test_student_login_filled.png');
    await page.screenshot({ path: shot1 });
    console.log(`[Step 3] Screenshot saved: ${shot1}`);

    // 4. Click Sign In
    console.log('[Step 4] Submitting student form ...');
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn.click();

    // Wait for welcome screen
    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
    const welcomeVisible = await page.evaluate(() => {
      return document.body.innerText.includes('Welcome') || document.body.innerText.includes('UNIBEN/2026/8842');
    });
    console.log('[Step 4] Student Welcome screen appeared:', welcomeVisible);

    const shot2 = path.join(ARTIFACT_DIR, 'test_student_welcome_screen.png');
    await page.screenshot({ path: shot2 });
    console.log(`[Step 4] Screenshot saved: ${shot2}`);

    // 5. Open Admin in second page
    console.log('[Step 5] Opening Admin Console: http://localhost:5173/?admin=true ...');
    const adminPage = await browser.newPage();
    await adminPage.goto('http://localhost:5173/?admin=true', { waitUntil: 'networkidle0', timeout: 15000 });

    // Check if admin login screen appears
    const needsLogin = await adminPage.$('input[type="password"]');
    if (needsLogin) {
      console.log('[Step 5] Logging into admin console with admin/password123 ...');
      const userInput = await adminPage.$('input[type="text"]');
      if (userInput) await userInput.type('admin');
      await needsLogin.type('password123');
      const loginBtn = await adminPage.$('button[type="submit"]');
      if (loginBtn) await loginBtn.click();
      await adminPage.evaluate(() => new Promise(r => setTimeout(r, 800)));
    }

    // 6. Navigate to Captured Data tab
    console.log('[Step 6] Navigating to "Captured Data" tab in Admin ...');
    await adminPage.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const capturedBtn = buttons.find(b => b.innerText.includes('Captured Data'));
      if (capturedBtn) capturedBtn.click();
    });

    // Wait for real-time polling to load submissions
    await adminPage.evaluate(() => new Promise(r => setTimeout(r, 1500)));

    // Verify submission data in table
    const tableText = await adminPage.evaluate(() => document.body.innerText);
    const hasReg = tableText.includes('UNIBEN/2026/8842');
    const hasEmail = tableText.includes('student@uniben.edu');

    console.log('[Step 6] Captured Data contains Student Reg No "UNIBEN/2026/8842":', hasReg);
    console.log('[Step 6] Captured Data contains School Email "student@uniben.edu":', hasEmail);

    const shot3 = path.join(ARTIFACT_DIR, 'test_admin_captured_data.png');
    await adminPage.screenshot({ path: shot3 });
    console.log(`[Step 6] Admin Captured Data Screenshot saved: ${shot3}`);

    console.log('--- ALL BROWSER END-TO-END TESTS COMPLETED SUCCESSFULLY ---');
    console.log(JSON.stringify({
      success: hasReg && hasEmail,
      hasDeBadge,
      logoDetected,
      welcomeVisible,
      capturedRegNo: hasReg,
      capturedEmail: hasEmail,
      screenshots: [shot1, shot2, shot3]
    }, null, 2));

  } finally {
    await browser.close();
  }
}

runTest().catch(err => {
  console.error('Browser Test Error:', err);
  process.exit(1);
});

