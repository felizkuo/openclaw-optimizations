#!/usr/bin/env node
/**
 * MRCA Member Extractor v3 - with scroll
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
    await page.waitForTimeout(5000);
    
    // Try to scroll down to load more
    console.log('📜 Scrolling...');
    for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await page.waitForTimeout(500);
    }
    
    // Get all text content after scrolling
    const content = await page.evaluate(() => document.body.innerText);
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    
    // Find all members
    const members = [];
    let currentCategory = '';
    
    const categories = [
        'Food & Beverages',
        'Advertising / Design / Printing',
        'Agriculture',
        'Automotive',
        'Banking / Finance',
        'Beauty / Healthcare',
        'Education',
        'Entertainment',
        'Event Management',
        'Fashion',
        'Home Improvements',
        'IT / E-Commerce',
        'Logistics / Transportation',
        'Media',
        'Property Developer / Real Estate',
        'Retails Products',
        'Security',
        'Services',
        'Supermarket/ Hypermarket/ Shopping Malls',
        'Telecommunication',
        'Travel / Tourism / Hospitality'
    ];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (categories.includes(line)) {
            currentCategory = line;
            continue;
        }
        
        if (line.includes('Member')) {
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                if (!nextLine.includes('Member') && !categories.includes(nextLine) && nextLine.length > 3) {
                    members.push({
                        company: nextLine,
                        type: line,
                        category: currentCategory
                    });
                }
            }
        }
    }
    
    // Filter F&B
    const fbMembers = members.filter(m => m.category === 'Food & Beverages');
    
    console.log('\n=== Results ===');
    console.log('Total members found:', members.length);
    console.log('Food & Beverages:', fbMembers.length);
    
    if (fbMembers.length > 0) {
        console.log('\n=== Food & Beverages Members ===');
        fbMembers.forEach((m, i) => {
            console.log(`${i+1}. ${m.company}`);
            console.log(`   Type: ${m.type}`);
        });
    }
    
    // Also save all members
    console.log('\n=== All Members (first 50) ===');
    members.slice(0, 50).forEach((m, i) => {
        console.log(`${i+1}. ${m.company} - ${m.category}`);
    });
    
    await browser.close();
}

extractMRCA().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
