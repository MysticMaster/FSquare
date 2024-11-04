import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Category {
    _id: string;
    thumbnail: Thumbnail | null;
    name: string;
    shoesCount: number | null;
    createdAt: string;
    isActive: boolean;
}

interface CategoryItemProps {
    category: Category;
    onClick: () => void
}

const CategoryItem: React.FC<CategoryItemProps> = ({category, onClick}) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={category.thumbnail ? category.thumbnail.url : './logo/no_pictures.png'}
                    alt={category.name}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{category.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{category.shoesCount}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{formatDateTime(category.createdAt)}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {category.isActive ? (
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
