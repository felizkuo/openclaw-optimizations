#!/usr/bin/env node
/**
 * Browser Automation - Combined Operations
 * Usage: node browser2.js <url> [commands...]
 */

const { chromium } = require('playwright');

async function main() {
    const args = process.argv.slice(2);
    const url = args[0];
    const commands = args.slice(1);
    
    if (!url) {
        console.log('Usage: node browser2.js <url> [commands...]');
        console.log('Commands: observe, extract-links, extract-images, screenshot');
        process.exit(1);
    }
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    console.log('📍 Loading:', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(2000);
    
    console.log('📄 Title:', await page.title());
    
    for (const cmd of commands) {
        console.log(`\n🔧 Running: ${cmd}`);
        
        switch(cmd) {
            case 'observe': {
                const info = await page.evaluate(() => {
                    return {
                        links: document.querySelectorAll('a').length,
                        buttons: document.querySelectorAll('button').length,
                        images: document.querySelectorAll('img').length,
                        headings: document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
                        text: document.body.innerText.substring(0, 2000)
                    };
                });
                console.log(JSON.stringify(info, null, 2));
                break;
            }
            
            case 'extract-links': {
                const links = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a'))
                        .map(a => ({ text: a.innerText?.trim().substring(0, 50), href: a.href }))
                        .filter(l => l.text);
                });
                console.log('Found', links.length, 'links');
                console.log(JSON.stringify(links.slice(0, 20), null, 2));
                break;
            }
            
            case 'extract-images': {
                const images = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('img'))
                        .map(img => ({ src: img.src, alt: img.alt }))
                        .filter(i => i.src);
                });
                console.log('Found', images.length, 'images');
                console.log(JSON.stringify(images.slice(0, 20), null, 2));
                break;
            }
            
            case 'screenshot': {
                await page.screenshot({ path: `tealive-${Date.now()}.png`, fullPage: true });
                console.log('📸 Screenshot saved');
                break;
            }
            
            case 'extract-all': {
                const text = await page.evaluate(() => document.body.innerText);
                console.log('Full text:', text.substring(0, 3000));
                break;
            }
        }
    }
    
    await browser.close();
    console.log('\n✅ Done');
}

main().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
