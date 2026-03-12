#!/usr/bin/env node
/**
 * MFA Franchise Directory Extractor
 */

const { chromium } = require('playwright');

async function extractFranchise() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const url = 'https://www.mfa.org.my/business-directory/';
    console.log('📍 Loading:', url);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Try to click on Food and Beverages
    console.log('🔍 Looking for Food and Beverages...');
    
    try {
        // Find and click Food and Beverages link
        const fbLink = page.getByText('Food and Beverages').first();
        await fbLink.click();
        await page.waitForTimeout(3000);
        console.log('Clicked!');
    } catch (e) {
        console.log('Click error:', e.message);
    }
    
    // Get content
    const content = await page.evaluate(() => document.body.innerText);
    console.log('\n=== Content (first 3000 chars) ===');
    console.log(content.substring(0, 3000));
    
    await browser.close();
}

extractFranchise().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
