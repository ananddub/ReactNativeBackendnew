const puppeteer = require('puppeteer');

async function createPDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent('<h1>Hello, Puppeteer!</h1>');
    await page.pdf({ path: 'example.pdf', format: 'A4' });
    await browser.close();
}

createPDF();