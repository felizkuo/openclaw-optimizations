#!/usr/bin/env node
/**
 * MFA Franchise - Extract text properly
 */

const { chromium } = require('playwright');

async function extract() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    console.log('📍 Loading page 1...');
    await page.goto('https://www.mfa.org.my/business-directory/listing_category/food-and-beverages/', { 
        waitUntil: 'networkidle', 
        timeout: 60000 
    });
    await page.waitForTimeout(3000);
    
    // Get all text
    const text = await page.evaluate(() => document.body.innerText);
    
    // Split and filter
    const lines = text.split('\n').filter(l => l.trim());
    
    console.log('\n=== Lines with Brand/Company ===');
    let count = 0;
    for (const line of lines) {
        if (line.includes('Brand') || line.includes('Company') || line.includes('Website')) {
            console.log(line);
            count++;
            if (count > 50) break;
        }
    }
    
    await browser.close();
}

extract().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
