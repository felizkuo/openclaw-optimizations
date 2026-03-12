#!/usr/bin/env node
/**
 * MRCA Member Extractor v2
 * Extract all members with categories
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
    
    // Split into lines and process
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    
    // Find all members and their categories
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
        
        // Check if this line is a category
        if (categories.includes(line)) {
            currentCategory = line;
            continue;
        }
        
        // Check for membership type
        if (line.includes('Associate Member') || line.includes('Ordinary Member') || line.includes('Affiliate Member')) {
            // Next line should be company name
            if (i + 1 < lines.length) {
                const nextLine = lines[i + 1];
                // Check if it's a company name (not a category or membership type)
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
    
    console.log('\n=== All Members Found ===');
    console.log('Total:', members.length);
    
    // Filter F&B members
    const fbMembers = members.filter(m => m.category === 'Food & Beverages');
    console.log('\n=== Food & Beverages Members ===');
    console.log('Total F&B:', fbMembers.length);
    
    fbMembers.forEach((m, i) => {
        console.log(`${i+1}. ${m.company} (${m.type})`);
    });
    
    // Also show first 20 of all members
    console.log('\n=== First 30 All Members ===');
    members.slice(0, 30).forEach((m, i) => {
        console.log(`${i+1}. ${m.company} - ${m.category} (${m.type})`);
    });
    
    await browser.close();
}

extractMRCA().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
