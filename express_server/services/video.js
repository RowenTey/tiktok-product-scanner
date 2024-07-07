import Video from "../models/video.js";
import { saveProducts, scrapeProductsFromAmazon, scrapeProductsFromEbay } from "./products.js";

const updateVideo = async (id, keywords) => {
    const result = await Video.findByIdAndUpdate(
        id,
        { $set: { keywords: keywords } },
        { new: true } // Return the updated document
    );

    if (result) {
        console.log("Updated video successfully: ", result);
    }
}

export const onKeywordsExtracted = async (payload) => {
    console.log("Received payload from Kafka: ", payload);
    const payloadObj = JSON.parse(payload);
    console.log(payloadObj);
    console.log(typeof payload);
    const { id, keywords } = JSON.parse(payloadObj);
    console.log(id, keywords);

    await updateVideo(id, keywords);
    // const products = await scrapeProductsFromAmazon(keywords);
    const products = await scrapeProductsFromEbay(keywords);
    const res = await saveProducts(products.map((product) => ({ ...product, videoId: id })));
    console.log("Products saved successfully: ", res);
}