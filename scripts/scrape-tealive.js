const { chromium } = require('playwright');

async function scrapeTealiveMenu() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Wayback Machine URL - 2019 version
    const url = 'https://web.archive.org/web/20190918180746/https://www.tealive.com.my/menu';
    
    console.log('Loading:', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to render
    await page.waitForTimeout(3000);
    
    // Get page content
    const content = await page.content();
    console.log('Page loaded, length:', content.length);
    
    // Try to find menu items - look for common patterns
    const menuItems = await page.evaluate(() => {
        const items = [];
        
        // Try different selectors
        const selectors = [
            '.menu-item',
            '.drink-item', 
            '[class*="menu"]',
            '[class*="product"]',
            'h3', 'h4',
            '.col-sm-6',
            '.category'
        ];
        
        for (const sel of selectors) {
            const elements = document.querySelectorAll(sel);
            if (elements.length > 0) {
                items.push({ selector: sel, count: elements.length });
            }
        }
        return items;
    });
    
    console.log('Found elements:', JSON.stringify(menuItems, null, 2));
    
    // Get all text content
    const text = await page.evaluate(() => document.body.innerText);
    console.log('\n--- Text content (first 3000 chars) ---');
    console.log(text.substring(0, 3000));
    
    await browser.close();
}

scrapeTealiveMenu().catch(console.error);
