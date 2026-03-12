#!/usr/bin/env node
/**
 * MRCA Member Extractor v4 - Click on category filter
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
    
    // Try to find and click "Food & Beverages" filter
    console.log('🔍 Looking for Food & Beverages filter...');
    
    try {
        // Look for Food & Beverages as a clickable element
        const fbLink = page.getByText('Food & Beverages').first();
        if (fbLink) {
            console.log('Found! Clicking...');
            await fbLink.click();
            await page.waitForTimeout(3000);
        }
    } catch (e) {
        console.log('Could not click filter:', e.message);
    }
    
    // Try clicking on pagination to get more pages
    console.log('📄 Clicking through pages...');
    
    const allMembers = new Set();
    
    for (let pageNum = 1; pageNum <= 5; pageNum++) {
        console.log(`  Page ${pageNum}...`);
        
        const content = await page.evaluate(() => document.body.innerText);
        const lines = content.split('\n').map(l => l.trim()).filter(l => l);
        
        // Extract company names (lines that look like company names)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Company names typically have Sdn Bhd, Sdn, Berhad, Restaurant, etc.
            if (line.match(/Sdn\s*\.?\s*Bhd|Berhad|Restaurant|Cafe|Shop|Store|Food|Beverage|Malaysia/i) &&
                !line.includes('Member') &&
                !line.includes('Category')) {
                allMembers.add(line);
            }
        }
        
        // Click next page
        try {
            const nextBtn = page.getByText('›').or(page.getByText('Next'));
            if (nextBtn) {
                await nextBtn.click();
                await page.waitForTimeout(2000);
            }
        } catch (e) {
            break;
        }
    }
    
    console.log('\n=== Found Companies ===');
    console.log(Array.from(allMembers).join('\n'));
    
    await browser.close();
}

extractMRCA().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
