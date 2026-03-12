#!/usr/bin/env node
/**
 * MRCA Member Extractor
 * Extract F&B members from MRCA directory
 */

const { chromium } = require('playwright');

async function extractMRCA() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const url = 'https://www.mrca.org.my/memberdirectory';
    console.log('📍 Loading:', url);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);
    
    // Get all text content
    const content = await page.evaluate(() => document.body.innerText);
    
    // Parse member data
    const lines = content.split('\n').filter(l => l.trim());
    
    console.log('\n=== Searching for Food & Beverages companies ===\n');
    
    let inFoodSection = false;
    const members = [];
    
    for (const line of lines) {
        // Look for Food & Beverages category
        if (line.includes('Food & Beverages')) {
            inFoodSection = true;
            console.log('Found Food & Beverages category!');
            continue;
        }
        
        // Stop at next category
        if (inFoodSection && line.match(/^[A-Z][A-Za-z\s\/\.]+$/)) {
            if (line.includes('Home Improvements') || line.includes('IT / E-Commerce')) {
                inFoodSection = false;
            }
        }
        
        // Extract member names (they typically have specific patterns)
        if (inFoodSection && line.length > 5) {
            // Member pattern: Company name followed by category
            if (!line.includes('Food & Beverages') && 
                !line.includes('Associate Member') &&
                !line.includes('Ordinary Member') &&
                !line.includes('Affiliate Member') &&
                !line.match(/^[A-Z]+\s*$/)) {
                members.push(line.trim());
            }
        }
    }
    
    // Alternative: Extract all companies with Food & Beverages category
    const allText = content;
    const fbMatches = allText.match(/([A-Z0-9][A-Za-z0-9\s\&\'\-\.\,]+(?:Sdn|Bhd|Sdn\. Bhd\.?|S\/A|Jan|Berhad))[\s\S]*?Food & Beverages/g);
    
    if (fbMatches) {
        console.log('Found', fbMatches.length, 'Food & Beverages companies:\n');
        fbMatches.forEach((match, i) => {
            console.log(`${i+1}. ${match.substring(0, 100)}...`);
        });
    }
    
    // Get page source to analyze structure
    const html = await page.content();
    
    // Look for any data attributes or structured content
    const hasData = html.includes('data-') || html.includes('json') || html.includes('member');
    console.log('\n=== Page Analysis ===');
    console.log('Has structured data:', hasData);
    console.log('HTML length:', html.length);
    
    await browser.close();
}

extractMRCA().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
