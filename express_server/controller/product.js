import puppeteer from "puppeteer";

export const scrapeProducts = async (req, res) => {
    const keyword = req.query.keyword;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = `https://www.amazon.com/s?k=${keyword}`;
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll(".s-result-item"));

        return items.slice(1, 3).map((item) => {
            const name = item
                .querySelector("span.a-text-normal")
                ?.textContent.trim();
            const price = item
                .querySelector(".a-price-whole")
                ?.textContent.trim();
            const image = item.querySelector(".s-image")?.src;

            return {
                name,
                price,
                image,
                ratings: Number((2 + Math.random() * 3).toFixed(2)),
                itemsSold: Math.floor(Math.random() * 2000),
            };
        });
    });

    await browser.close();
    return res.status(200).json(products);
};
