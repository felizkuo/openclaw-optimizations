const { chromium } = require('playwright');

async function findTealiveMenuData() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Try various sources
    const sources = [
        { name: 'MenuCDN', url: 'https://web.archive.org/web/20201202125852cs_/https://www.tealive.com.my/assets/css/menu/menu.css' },
        { name: 'DrinksCSS', url: 'https://web.archive.org/web/20201202125852cs_/https://www.tealive.com.my/assets/css/drinks.css' },
        { name: 'Components', url: 'https://web.archive.org/web/20201202125852cs_/https://www.tealive.com.my/assets/css/components/menu.css' }
    ];
    
    for (const source of sources) {
        console.log('\n=== Checking:', source.name, '===');
        try {
            const response = await page.goto(source.url, { timeout: 15000 });
            if (response.status() === 200) {
                const text = await page.content();
                console.log('Content length:', text.length);
                
                // Look for product names
                const productMatches = text.match(/[A-Z][a-zA-Z\s]{3,30}(?:Latte|Milk|Tea|Coffee|Matcha|Chocolate|Brown Sugar)/g);
                if (productMatches) {
                    console.log('Products found:', [...new Set(productMatches)].slice(0, 20));
                }
                
                // Look for prices
                const priceMatches = text.match(/RM\s*\d+/gi);
                if (priceMatches) {
                    console.log('Prices:', [...new Set(priceMatches)].slice(0, 15));
                }
            } else {
                console.log('Status:', response.status());
            }
        } catch (e) {
            console.log('Error:', e.message.substring(0, 50));
        }
    }
    
    await browser.close();
}

findTealiveMenuData().catch(console.error);
