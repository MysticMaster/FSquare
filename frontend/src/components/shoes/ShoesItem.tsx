import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Shoes {
    _id: string;
    brand: string;
    category: string;
    thumbnail: Thumbnail | null;
    name: string;
    classificationCount: number | null;
    createdAt: string;
    isActive: boolean;
}

interface ShoesItemProps {
    shoes: Shoes
}

const CategoryItem: React.FC<ShoesItemProps> = ({ shoes }) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={shoes.thumbnail ? shoes.thumbnail.url : './logo/no_pictures.png'}
                    alt={shoes.name}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoes.brand}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoes.category}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoes.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoes.classificationCount}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{formatDateTime(shoes.createdAt)}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {shoes.isActive ? (
                    <span className="text-green-500">Kinh doanh</span>
                ) : (
                    <span className="text-red-500">Ngừng kinh doanh</span>
                )}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <button className="text-blue-500 hover:underline">Chi tiết</button>
            </td>
        </tr>
    );
};

export default CategoryItem;
