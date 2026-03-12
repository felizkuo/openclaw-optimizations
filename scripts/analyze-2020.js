const { chromium } = require('playwright');

async function analyzeTealive2020() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const url = 'https://web.archive.org/web/20201202125852/https://www.tealive.com.my/menu';
    console.log('Loading:', url);
    
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    // Get all text content
    const text = await page.evaluate(() => document.body.innerText);
    
    // Try to find menu categories
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    console.log('\n=== All text lines ===');
    lines.forEach((line, i) => {
        if (line.trim().length > 2) {
            console.log(`${i}: ${line.substring(0, 80)}`);
        }
    });
    
    // Look for prices
    const pricePattern = /RM\s*\d+/gi;
    const prices = text.match(pricePattern);
    console.log('\n=== Prices found ===');
    console.log(prices?.slice(0, 30) || 'None');
    
    // Look for product names - common patterns
    const productPatterns = [
        /[A-Z][a-z]+\s+(Latte|Milk|Tea|Coffee)/gi,
        /Brown\s+Sugar/gi,
        /Matcha/gi,
        /Chocolate/gi,
        /Fruit/gi,
        /Milk\s+Tea/gi,
        /Pearl/gi
    ];
    
    console.log('\n=== Product patterns ===');
    productPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            console.log(`${pattern}: ${[...new Set(matches)].slice(0, 10).join(', ')}`);
        }
    });
    
    await browser.close();
}

analyzeTealive2020().catch(console.error);
