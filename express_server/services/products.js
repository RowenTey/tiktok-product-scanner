import puppeteer from "puppeteer";
import Product from "../models/product.js";
import randomUseragent from "random-useragent";

export const scrapeProductsFromAmazon = async (keywords) => {
    console.log("Scraping products from Amazon: ", keywords);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const userAgent = randomUseragent.getRandom();
    page.setUserAgent(userAgent);

    const products = [];
    for (const keyword of keywords) {
        try {
            const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;
            await page.goto(url, { waitUntil: "load", timeout: 0 });

            const items = await page.$$(".s-result-item");
            console.log("Num elements found: ", items.length);

            if (items.length <= 5) {
                console.log("No products found for keyword: ", keyword);
                continue;
            }

            const scrapedProducts = items.slice(3, 5).map(async (item) => {
                const name = await item.$eval("span.a-text-normal", (el) => el.textContent.trim());
                const price = await item.$eval(".a-price-whole", (el) => el.textContent.trim());
                const image = await item.$eval("img.s-image", (el) => el.src);

                return {
                    name,
                    price,
                    image,
                    ratings: Number((2 + Math.random() * 3).toFixed(2)),
                    itemsSold: Math.floor(Math.random() * 2000),
                };
            });
            const scrapedProductsArray = await Promise.all(scrapedProducts);
            console.log("Scraped products: ", scrapedProductsArray);
            products.push(...scrapedProductsArray);
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