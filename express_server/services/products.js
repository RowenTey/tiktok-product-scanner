import puppeteer from "puppeteer";
import Product from "../models/product.js";
import randomUseragent from "random-useragent";
import * as fs from 'fs';

export const scrapeProductsFromAmazon = async (keywords) => {
    console.log("Scraping products from Amazon: ", keywords);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"',
            '--enable-ipv6'
        ]
    });
    const page = await browser.newPage();

    const products = [];
    for (const keyword of keywords) {
        try {
            const userAgent = randomUseragent.getRandom();
            page.setUserAgent(userAgent);

            const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
            await page.goto(url, { waitUntil: "load", timeout: 0 });

            const items = await page.$$(".s-result-item");
            console.log("Num elements found: ", items.length);

            if (items.length <= 5) {
                console.log("No products found for keyword: ", keyword);
                continue;
            }

            const itemPromises = items.map(async (item) => {
                try {
                    const name = await item.$eval("span.a-text-normal", (el) => el.textContent.trim());
                    const price = await item.$eval("span.a-price-whole", (el) => el.textContent.trim().replace(/./g, ""));
                    const image = await item.$eval("img.s-image", (el) => el.src);
                    const url = await item.$eval("a.a-link-normal", (el) => el.href);

                    return {
                        name,
                        price,
                        image,
                        url,
                        ratings: Number((2 + Math.random() * 3).toFixed(2)),
                        itemsSold: Math.floor(Math.random() * 2000),
                    };
                } catch (error) {
                    console.error("Error occured while scraping product: ", error);
                    return null;  // Handle error by returning null
                }
            });

            const scrapedProducts = [];
            let collectedCount = 0;

            while (collectedCount < 2 && itemPromises.length > 0) {
                const result = await Promise.race(itemPromises.map((p, index) =>
                    p.then(value => ({ index, value }))
                        .catch(() => ({ index, value: null }))
                ));
                console.log(`Promise ${result.index} resolved with value ${result.value}`);

                // Remove the resolved promise from the array
                itemPromises.splice(result.index, 1);

                if (result.value === null) {
                    continue;
                }

                scrapedProducts.push(result.value);
                collectedCount++;
            }

            console.log("Scraped products: ", scrapedProducts);
            products.push(...scrapedProducts);
        } catch (error) {
            console.log("Error occured while scraping products: ", error);
            continue;
        }
    }

    await browser.close();
    return products;
}

export const scrapeProductsFromEbay = async (keywords) => {
    console.log("Scraping products from Ebay: ", keywords);
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--host-resolver-rules="MAP * ~NOTFOUND , EXCLUDE 127.0.0.1"',
            '--enable-ipv6'
        ]
    });
    const page = await browser.newPage();

    const products = [];
    for (const keyword of keywords) {
        try {
            const userAgent = randomUseragent.getRandom();
            page.setUserAgent(userAgent);

            const url = `https://www.ebay.com.sg/sch/i.html?_from=R40&_nkw=${encodeURIComponent(keyword)}&_sacat=0`;
            await page.goto(url, { waitUntil: "load", timeout: 0 });

            const items = await page.$$(".s-item__wrapper");
            console.log("Num elements found: ", items.length);

            if (items.length <= 5) {
                console.log("No products found for keyword: ", keyword);
                continue;
            }

            const itemPromises = items.map(async (item) => {
                try {
                    const name = await item.$eval("div.s-item__title", (el) => el.textContent.trim());
                    const price = await item.$eval("span.s-item__price > span.ITALIC", (el) =>
                        el.textContent.trim().replace(/^S\$ /, "").replace(/,/g, ""));
                    const image = await item.$eval("img", (el) => el.src);
                    const url = await item.$eval("a.s-item__link", (el) => el.href);

                    return {
                        name,
                        price,
                        image,
                        url,
                        ratings: Number((2 + Math.random() * 3).toFixed(2)),
                        itemsSold: Math.floor(Math.random() * 2000),
                    };
                } catch (error) {
                    // console.error("Error occured while scraping product: ", error);
                    return null;
                }
            });

            const scrapedProducts = [];
            let collectedCount = 0;

            while (collectedCount < 2 && itemPromises.length > 0) {
                const result = await Promise.race(itemPromises.map((p, index) =>
                    p.then(value => ({ index, value }))
                        .catch(() => ({ index, value: null }))
                ));
                console.log(`Promise ${result.index} resolved with value ${result.value}`);

                // Remove the resolved promise from the array
                itemPromises.splice(result.index, 1);

                if (result.value === null) {
                    continue;
                }

                scrapedProducts.push(result.value);
                collectedCount++;
            }

            console.log("Scraped products: ", scrapedProducts);
            products.push(...scrapedProducts);
        } catch (error) {
            console.log("Error occured while scraping products: ", error);
            continue;
        }
    }

    await browser.close();
    return products;
}

export const saveProducts = async (products) => {
    try {
        if (products.length <= 0) {
            return true;
        }

        for (const product of products) {
            const newProduct = new Product({
                name: product.name,
                price: product.price,
                videoId: product.videoId,
                imageSrc: product.image,
                // productUrl: "https://www.amazon.com" + product.url,
                productUrl: product.url,
                ratings: product.ratings,
                itemsSold: product.itemsSold,
            });
            await newProduct.save();
        }
        return true;
    } catch (error) {
        console.log("Error occured while saving product: ", error);
        return false;
    }
}