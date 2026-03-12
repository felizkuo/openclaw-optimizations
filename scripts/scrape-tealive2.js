const { chromium } = require('playwright');

async function scrapeTealiveMenu() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Try different Wayback URLs
    const urls = [
        'https://web.archive.org/web/20201202125852/https://www.tealive.com.my/menu',
        'https://web.archive.org/web/20190918180746if_/https://www.tealive.com.my/menu',
        'https://web.archive.org/web/20190918180746/https://www.tealive.com.my/menu?_escaped_fragment_='
    ];
    
    for (const url of urls) {
        console.log('\n=== Trying:', url, '===');
        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.waitForTimeout(5000);
            
            const text = await page.evaluate(() => document.body.innerText);
            console.log('Text length:', text.length);
            console.log('First 2000 chars:', text.substring(0, 2000));
            
            if (text.length > 500) break;
        } catch (e) {
            console.log('Error:', e.message);
        }
    }
    
    // Also try to find any JSON data
    console.log('\n=== Looking for JSON data ===');
    const jsonData = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script');
        const data = [];
        scripts.forEach((s, i) => {
            const txt = s.innerText || s.textContent || '';
            if (txt.includes('menu') || txt.includes('product') || txt.includes('drink')) {
                data.push({ index: i, length: txt.length, preview: txt.substring(0, 500) });
            }
        });
        return data;
    });
    console.log('Found script data:', JSON.stringify(jsonData, null, 2));
    
    await browser.close();
}

scrapeTealiveMenu().catch(console.error);
