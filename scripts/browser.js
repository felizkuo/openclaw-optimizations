#!/usr/bin/env node
/**
 * Browser Automation Tool
 * Usage: node browser.js <command> [args]
 * 
 * Commands:
 *   navigate <url>              - Navigate to a URL
 *   act "<action>"              - Perform action (click, type, etc.)
 *   extract "<instruction>"    - Extract data from page
 *   screenshot [path]           - Take screenshot
 *   observe                    - List available elements
 *   close                      - Close browser
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

let browser = null;
let page = null;

async function ensureBrowser() {
    if (!browser) {
        browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        page = await browser.newPage();
    }
    return { browser, page };
}

async function cmdNavigate(url) {
    const { page } = await ensureBrowser();
    console.log('Navigating to:', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Page loaded:', await page.title());
    return { success: true, url };
}

async function cmdAct(action) {
    const { page } = await ensureBrowser();
    console.log('Acting:', action);
    
    // Handle different action types
    const lowerAction = action.toLowerCase();
    
    if (lowerAction.startsWith('click ')) {
        const selector = action.substring(6);
        await page.click(selector);
    } else if (lowerAction.startsWith('type ')) {
        const parts = action.substring(5).split(' into ');
        if (parts.length === 2) {
            await page.type(parts[1], parts[0]);
        }
    } else if (lowerAction.startsWith('goto ') || lowerAction.startsWith('go to ')) {
        const url = action.replace(/^(goto|go to)\s+/i, '');
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    } else {
        // Try to find and click element by text
        const elements = await page.getByText(action, { exact: false }).all();
        if (elements.length > 0) {
            await elements[0].click();
        } else {
            // Try as CSS selector
            try {
                await page.click(action);
            } catch(e) {
                throw new Error(`Cannot find element: ${action}`);
            }
        }
    }
    
    return { success: true, action };
}

async function cmdExtract(instruction) {
    const { page } = await ensureBrowser();
    console.log('Extracting:', instruction);
    
    // Get full page content
    const text = await page.evaluate(() => document.body.innerText);
    const html = await page.content();
    
    // Try to find specific data based on instruction
    let result = text;
    
    if (instruction.includes('link') || instruction.includes('button')) {
        const elements = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a, button'));
            return links.map(el => ({
                tag: el.tagName,
                text: el.innerText?.trim().substring(0, 50),
                href: el.href
            })).filter(l => l.text);
        });
        result = JSON.stringify(elements, null, 2);
    } else if (instruction.includes('image')) {
        const elements = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt
            })).filter(i => i.src);
        });
        result = JSON.stringify(elements, null, 2);
    }
    
    console.log('Extracted result:');
    console.log(result.substring(0, 2000));
    
    return { success: true, data: result };
}

async function cmdObserve(query) {
    const { page } = await ensureBrowser();
    console.log('Observing:', query || 'all elements');
    
    const info = await page.evaluate(() => {
        const getSelectors = () => {
            const data = [];
            
            // Links
            const links = document.querySelectorAll('a');
            data.push({ type: 'links', count: links.length, sample: Array.from(links).slice(0,5).map(l => l.innerText?.trim().substring(0,30)) });
            
            // Buttons
            const buttons = document.querySelectorAll('button');
            data.push({ type: 'buttons', count: buttons.length, sample: Array.from(buttons).slice(0,5).map(b => b.innerText?.trim().substring(0,30)) });
            
            // Inputs
            const inputs = document.querySelectorAll('input, textarea');
            data.push({ type: 'inputs', count: inputs.length, sample: Array.from(inputs).slice(0,5).map(i => i.placeholder || i.type || 'input') });
            
            // Images
            const images = document.querySelectorAll('img');
            data.push({ type: 'images', count: images.length });
            
            // Headings
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            data.push({ type: 'headings', count: headings.length, sample: Array.from(headings).slice(0,5).map(h => h.innerText?.trim().substring(0,30)) });
            
            return data;
        };
        
        return {
            url: window.location.href,
            title: document.title,
            selectors: getSelectors()
        };
    });
    
    console.log(JSON.stringify(info, null, 2));
    return { success: true, info };
}

async function cmdScreenshot(outputPath) {
    const { page } = await ensureBrowser();
    const defaultPath = `screenshot-${Date.now()}.png`;
    const filePath = outputPath || defaultPath;
    
    await page.screenshot({ path: filePath, fullPage: true });
    console.log('Screenshot saved:', filePath);
    
    return { success: true, path: filePath };
}

async function cmdClose() {
    if (browser) {
        await browser.close();
        browser = null;
        page = null;
    }
    console.log('Browser closed');
    return { success: true };
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    try {
        let result;
        
        switch(command) {
            case 'navigate':
                result = await cmdNavigate(args[1]);
                break;
            case 'act':
                result = await cmdAct(args.slice(1).join(' '));
                break;
            case 'extract':
                result = await cmdExtract(args.slice(1).join(' '));
                break;
            case 'observe':
                result = await cmdObserve(args[1]);
                break;
            case 'screenshot':
                result = await cmdScreenshot(args[1]);
                break;
            case 'close':
                result = await cmdClose();
                break;
            case 'help':
            default:
                console.log(`
Browser Automation Tool

Usage: node browser.js <command> [args]

Commands:
  navigate <url>              Navigate to a URL
  act "<action>"              Perform action (click, type, goto)
  extract "<instruction>"     Extract data from page
  observe                     List available elements
  screenshot [path]          Take screenshot
  close                       Close browser

Examples:
  node browser.js navigate https://example.com
  node browser.js act "click the login button"
  node browser.js extract "all links"
  node browser.js observe
  node browser.js screenshot
                `);
                process.exit(0);
        }
        
        console.log('\nResult:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
