import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('CartManager Tests', () => {
    let browser;
    let page;

    before(async () => {
        browser = await puppeteer.launch({
            headless: false,
            args: ['--window-size=1920,1080']
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
    });

    beforeEach(async () => {
        await page.goto('http://localhost:3000');
        await page.evaluate(() => localStorage.clear());
    });

    after(async () => {
        await browser.close();
    });

    it('devrait ajouter un produit au panier', async () => {
        await page.waitForSelector('.product-card');

        await page.click('.add-to-cart');

        const badgeText = await page.$eval('#cart-badge', el => el.textContent);
        expect(badgeText).to.equal('1');

        await page.click('#toggle-cart-btn');

        await page.waitForSelector('.cart-item');
        const cartItemCount = await page.$$eval('.cart-item', items => items.length);
        expect(cartItemCount).to.equal(1);
    });

    it('devrait modifier la quantité dans le panier', async () => {

        await page.waitForSelector('.product-card');
        await page.click('.add-to-cart');
        await page.click('#toggle-cart-btn');

        await page.waitForSelector('.qty-btn[data-action="increase"]');
        await page.click('.qty-btn[data-action="increase"]');

        const quantity = await page.$eval('.qty span', el => el.textContent);
        expect(quantity).to.equal('2');
    });

    it('devrait supprimer un produit du panier', async () => {

        await page.waitForSelector('.product-card');
        await page.click('.add-to-cart');
        await page.click('#toggle-cart-btn');

        await page.waitForSelector('.delete-btn');
        await page.click('.delete-btn');

        const badgeVisible = await page.$eval('#cart-badge', el =>
            !el.classList.contains('hidden')
        );
        expect(badgeVisible).to.be.false;
    });
});