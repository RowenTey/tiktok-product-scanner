import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	videoId: { type: String, required: true },
	imageSrc: { type: String, required: false },
	productUrl: { type: String, required: true },
	rating: { type: Number, required: false },
	itemsSold: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
