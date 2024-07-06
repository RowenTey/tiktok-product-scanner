import { scrapeProductsFromAmazon } from "../services/products.js";

export const scrapeProducts = async (req, res) => {
    const { keywords } = req.body;
    const products = await scrapeProductsFromAmazon(keywords);
    console.log("Scraped products: ", products);
    return res.status(200).json(products);
};
