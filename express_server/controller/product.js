import { scrapeProductsFromAmazon } from "../services/products.js";
import Product from "../models/product.js";

export const scrapeProducts = async (req, res) => {
    const { keywords } = req.body;
    const products = await scrapeProductsFromAmazon(keywords);
    console.log("Scraped products: ", products);
    return res.status(200).json(products);
};


export const getProductsByVideoId = async (req, res) => {
    try {
        const videoId = req.query.videoId;
        const products = await Product.find({ videoId: videoId });
        return res.status(200).json(products);
    } catch (error) {
        console.log("Error occured while fetching products with videoId: ", error);
        return res.status(500).json({ message: "Error occured while fetching products with videoId" });
    }
};
