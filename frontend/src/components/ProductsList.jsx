import Product from "./Product";

const ProductsList = ({ products, onHideProductsList }) => {
    return (
        <>
            <div className="flex flex-col h-[40rem] bg-[#efefef] w-full p-2.5 gap-y-3">
                <div className="flex items-center h-[2rem]">
                    <span className="font-bold text-[#e0486c]">
                        Relevant Products
                    </span>
                    <button
                        className="font-bold text-[#e0486c] bg-transparent p-0 ml-auto"
                        onClick={onHideProductsList}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-5"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-wrap box-border h-[38rem] overflow-y-auto">
                    {products.map((product, index) => {
                        return (
                            <div className="w-1/2" key={index}>
                                <Product
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    itemsSold={product.itemsSold}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ProductsList;
