const { chromium } = require('playwright');

async function findTealiveImages() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Try to find any cached images or references
    const urls = [
        'https://web.archive.org/web/2018*/www.tealive.com.my/menu',
        'https://web.archive.org/web/2019*/www.tealive.com.my/menu',
        'https://web.archive.org/web/2020*/www.tealive.com.my/menu'
    ];
    
    let allImages = [];
    
    for (const url of urls) {
        console.log('Trying:', url);
        try {
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForTimeout(2000);
            
            const images = await page.evaluate(() => {
                const imgs = document.querySelectorAll('img');
                return Array.from(imgs).map(img => ({
                    src: img.src,
                    alt: img.alt,
                    width: img.width,
                    height: img.height
                }));
            });
            
            console.log('Found', images.length, 'images');
            allImages = allImages.concat(images);
            
        } catch (e) {
            console.log('Error:', e.message.substring(0, 50));
        }
    }
    
    // Filter for likely menu images
    const menuImages = allImages.filter(img => {
        const src = img.src.toLowerCase();
        return src.includes('menu') || src.includes('drink') || src.includes('product') || 
               src.includes('tea') || src.includes('milk') || src.includes('bubble') ||
               src.includes('product') || img.alt?.toLowerCase().includes('menu');
    });
    
    console.log('\n=== Potential Menu Images ===');
    console.log(JSON.stringify(menuImages, null, 2));
    
    await browser.close();
}

findTealiveImages().catch(console.error);
