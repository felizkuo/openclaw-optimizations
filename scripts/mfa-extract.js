#!/usr/bin/env node
/**
 * MFA Member Extractor - Extract all franchise members
 */

const { chromium } = require('playwright');

async function extractMFA() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    const allMembers = new Set();
    
    // Try multiple pages
    const pages = [1, 2, 3];
    
    for (const pageNum of pages) {
        const url = `https://www.mfa.org.my/members/page/${pageNum}/`;
        console.log(`📍 Loading page ${pageNum}...`);
        
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(2000);
            
            const content = await page.evaluate(() => document.body.innerText);
            
            // Extract company names - look for patterns
            const lines = content.split('\n');
            for (const line of lines) {
                // Company name patterns in franchise context
                if (line.match(/(Coffee|Tea|Bubble|Milk|Drink|Food|Restaurant|Cafe|Bakery|Sweet|Ice|Cream|Pizza|Burger|Chicken|Fast|Take|Away|Dessert|Snack|Beverage)/i) &&
                    line.length > 3 && 
                    line.length < 100 &&
                    !line.includes('Details') &&
                    !line.includes('Read More') &&
                    !line.includes('Home')) {
                    allMembers.add(line.trim());
                }
            }
            
            console.log(`  Found ${allMembers.size} total so far`);
            
        } catch (e) {
            console.log(`  Error on page ${pageNum}:`, e.message);
        }
    }
    
    console.log('\n=== Found Franchise Companies ===');
    console.log(Array.from(allMembers).join('\n'));
    
    await browser.close();
}

extractMFA().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
