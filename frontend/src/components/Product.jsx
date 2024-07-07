/* eslint-disable react/prop-types */
const Product = ({ name, price, image, url, rating, itemsSold }) => {
    return (
        <>
            <div className="flex flex-col m-1 p-2 gap-y-5 bg-white rounded-xl curosor-pointer" onClick={() => window.open(url, "_blank")}>
                <div className="flex w-full h-[5rem] m-auto">
                    <img
                        src={image || "https://picsum.photos/200/300"}
                        className="object-contain w-full h-full"
                    />
                </div>
                <div className="flex flex-col gap-y-2">
                    <span className="text-stone-900 text-base line-clamp-3">{name}</span>
                    <span className="text-[#d94365] font-bold text-base">
                        ${price}
                    </span>
                    <div className="flex flex-row gap-x-1 items-center flex-wrap">
                        <div className="flex flex-row gap-x-0.5 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#f0d101"
                                className="size-4"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-[#a3a2a3] text-sm">
                                {rating}
                            </span>
                        </div>
                        <span className="text-[#e9e7e8]"> | </span>
                        <span className="text-[#8d8d8d] text-sm">
                            {itemsSold} Items sold
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Product;
