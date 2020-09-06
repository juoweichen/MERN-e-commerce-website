const puppeteer = require('puppeteer');

describe('Register', () => {
	let browser, page;

	beforeEach(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.goto('http://localhost:5001/');
	})

	afterEach(async () => {
		await browser.close();
	})

	it('should do something cool', async () => {
		const title = await page.title();
		expect(title).toMatch(/clique/i);
	})
})