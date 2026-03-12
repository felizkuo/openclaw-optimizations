#!/usr/bin/env node
/**
 * MFA Full Franchise Extractor - All pages
 */

const { chromium } = require('playwright');

async function extractAll() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const brands = new Set();
    
    // Get pages 1-7
    for (let p = 1; p <= 7; p++) {
        const url = p === 1 
            ? 'https://www.mfa.org.my/business-directory/listing_category/food-and-beverages/'
            : `https://www.mfa.org.my/business-directory/listing_category/food-and-beverages/page/${p}/`;
        
        console.log(`📍 Page ${p}...`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            
            const content = await page.evaluate(() => document.body.innerText);
            
            // Extract Brand and Company
            const brandMatch = content.match(/Brand\s+([^\n]+)/g);
            const companyMatch = content.match(/Company\s+([^\n]+)/g);
            
            if (brandMatch) {
                brandMatch.forEach(b => {
                    const brand = b.replace('Brand ', '').trim();
                    brands.add(brand);
                });
            }
            
            console.log(`  Found ${brands.size} brands so far`);
            
        } catch (e) {
            console.log(`  Error:`, e.message);
        }
    }
    
    console.log('\n=== All Food & Beverages Franchises ===');
    console.log('Total:', brands.size);
    console.log('\n' + Array.from(brands).join('\n'));
    
    await browser.close();
}

extractAll().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
