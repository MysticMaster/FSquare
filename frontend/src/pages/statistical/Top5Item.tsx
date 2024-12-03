import React from "react";

interface Thumbnail {
    url: string;
}

interface Top5Shoes{
    _id: string;
    name: string;
    totalSales: number;
    totalRevenue: number;
    thumbnail: Thumbnail | null;
}

interface Props {
   top5Shoes: Top5Shoes;
   onClick: () => void;
}

const Top5Item:React.FC<Props> = ({top5Shoes,onClick})=>{
    return (
        <div
            onClick={onClick}
            className={'w-full p-5 shadow-lg mx-2 border border-gray-300 rounded-lg flex flex-col justify-center items-center'}>
            <img
                src={top5Shoes.thumbnail ? top5Shoes.thumbnail.url : './logo/no_pictures.png'}
                alt={top5Shoes.name}
                className="w-24 h-24 object-cover rounded mb-3"
            />
            <h1 className={'text-black font-semibold mb-1'}>Tên: {top5Shoes.name}</h1>
            <h1 className={'text-black font-semibold mb-1'}>Doanh số: {top5Shoes.totalSales}</h1>
            <h1 className={'text-black font-semibold mb-1'}>Doanh thu:
                {' '+new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                }).format(top5Shoes.totalRevenue)}</h1>
        </div>
    )
}

export default Top5Item;
