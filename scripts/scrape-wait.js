const { chromium } = require('playwright');

async function scrapeWithWait() {
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set a longer timeout and wait for network to be idle
    const url = 'https://web.archive.org/web/20201202125852/https://www.tealive.com.my/menu';
    console.log('Loading:', url);
    
    try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        
        // Wait for any dynamic content
        await page.waitForTimeout(5000);
        
        // Try multiple selectors to find menu content
        const selectors = [
            '.menu-item', '.drink-item', '.product-item',
            '[class*="menu"]', '[class*="product"]',
            'div.col-sm-6', 'div.col-md-4'
        ];
        
        for (const sel of selectors) {
            const count = await page.locator(sel).count();
            if (count > 0) {
                console.log(`Found ${count} items with selector: ${sel}`);
            }
        }
        
        // Get the full page text
        const text = await page.evaluate(() => document.body.innerText);
        console.log('\n=== Full text content ===');
        console.log(text.substring(0, 5000));
        
    } catch (e) {
        console.log('Error:', e.message);
    }
    
    await browser.close();
}

scrapeWithWait();
