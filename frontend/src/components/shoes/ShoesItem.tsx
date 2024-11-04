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
    shoe: Shoes,
    onClick: () => void
}

const CategoryItem: React.FC<ShoesItemProps> = ({ shoe,onClick }) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={shoe.thumbnail ? shoe.thumbnail.url : './logo/no_pictures.png'}
                    alt={shoe.name}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.brand}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.category}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.classificationCount}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{formatDateTime(shoe.createdAt)}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {shoe.isActive ? (
                    <span className="text-green-500">Kinh doanh</span>
                ) : (
                    <span className="text-red-500">Ngừng kinh doanh</span>
                )}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <button className="text-blue-500 hover:underline" onClick={onClick}>Chi tiết</button>
            </td>
        </tr>
    );
};

export default CategoryItem;
