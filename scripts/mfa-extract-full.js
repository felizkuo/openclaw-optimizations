#!/usr/bin/env node
/**
 * MFA Franchise Full Extractor
 */

const { chromium } = require('playwright');

async function extract() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const allBrands = [];
    
    // Pages 1-7
    for (let p = 1; p <= 7; p++) {
        const url = p === 1 
            ? 'https://www.mfa.org.my/business-directory/wpbdp_category/food-and-beverages/'
            : `https://www.mfa.org.my/business-directory/wpbdp_category/food-and-beverages/page/${p}/`;
        
        console.log(`📍 Page ${p}...`);
        
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(2000);
        
        const text = await page.evaluate(() => document.body.innerText);
        
        // Extract brands
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('Brand ')) {
                const brand = lines[i].replace('Brand ', '').trim();
                const company = i + 1 < lines.length && lines[i+1].startsWith('Company ') 
                    ? lines[i+1].replace('Company ', '').trim() 
                    : '';
                const website = i + 2 < lines.length && lines[i+2].startsWith('Website ') 
                    ? lines[i+2].replace('Website ', '').trim() 
                    : '';
                
                allBrands.push({ brand, company, website });
            }
        }
        
        console.log(`  Total: ${allBrands.length} brands`);
    }
    
    console.log('\n=== All Food & Beverages Franchises ===');
    console.log(`Total: ${allBrands.length}\n`);
    
    // Save to file
    const fs = require('fs');
    let md = '# MFA 餐飲加盟品牌\n\n';
    md += '> 資料來源: https://www.mfa.org.my/business-directory/\n\n';
    md += '## 品牌列表 (共 ' + allBrands.length + ' 個)\n\n';
    md += '| # | 品牌 | 公司 | 網站 |\n';
    md += '|---|------|------|------|\n';
    
    allBrands.forEach((b, i) => {
        md += `| ${i+1} | ${b.brand} | ${b.company} | ${b.website} |\n`;
    });
    
    fs.writeFileSync('/home/felizkuo/.openclaw/workspace-cos/knowledge-base/mfa-franchises.md', md);
    console.log('Saved to knowledge-base/mfa-franchises.md');
    
    await browser.close();
}

extract().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
