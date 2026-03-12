const { chromium } = require('playwright');

async function scrapeTealiveArchive() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Direct archive URLs we found earlier
    const urls = [
        'https://web.archive.org/web/20170220123306/http://www.tealive.com.my/menu',
        'https://web.archive.org/web/20190918180746/https://www.tealive.com.my/menu',
        'https://web.archive.org/web/20201202125852/https://www.tealive.com.my/menu'
    ];
    
    for (const url of urls) {
        console.log('\n=== Testing:', url);
        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            
            // Get all images
            const images = await page.evaluate(() => {
                const imgs = document.querySelectorAll('img');
                return Array.from(imgs).map(img => ({
                    src: img.src,
                    alt: img.alt || '',
                    width: img.width,
                    height: img.height
                })).filter(img => img.src.length > 10);
            });
            
            console.log('Images found:', images.length);
            
            // Try to find any text that might be product names
            const text = await page.evaluate(() => document.body.innerText);
            console.log('Text length:', text.length);
            
            // Look for product-related keywords
            const keywords = ['milk', 'tea', 'coffee', 'matcha', 'latte', 'fruit', '珍珠', '奶茶', 'brown sugar'];
            const found = keywords.filter(k => text.toLowerCase().includes(k.toLowerCase()));
            console.log('Keywords found:', found);
            
            if (text.length > 500) {
                console.log('Sample text:', text.substring(0, 500));
            }
            
        } catch (e) {
            console.log('Error:', e.message);
        }
    }
    
    await browser.close();
}

scrapeTealiveArchive().catch(console.error);
