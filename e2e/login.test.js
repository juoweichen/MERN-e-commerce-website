const puppeteer = require('puppeteer');

jest.setTimeout(100000);

describe('Login', () => {
	let browser, page;

	beforeEach(async () => {
		browser = await puppeteer.launch({
			headless: false,
			slowMo: 250 // slow down by 250ms
		});
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

	it('should move to login page', async () => {
		await page.waitForSelector('button[name="login"]');
		await page.click('button[name="login"]');
		await page.screenshot({ path: 'login.png' });
	})
})