import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Brand {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Shoes {
    _id: string;
    brand: Brand;
    category: Category;
    thumbnail: Thumbnail | null;
    name: string;
    classificationCount: number | null;
    createdAt: string;
    isActive: boolean;
}

interface ShoesItemProps {
    shoe: Shoes;
    onDetail: () => void;
    onSelect: () => void;
    onShowClassifications: () => void;
    isSelected: boolean;
}

const ShoesItem: React.FC<ShoesItemProps> = ({shoe, onDetail, onSelect, onShowClassifications, isSelected}) => {
    return (
        <tr className={isSelected ? "bg-blue-100" : "hover:bg-gray-100"}
            onClick={onSelect}>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={shoe.thumbnail ? shoe.thumbnail.url : './logo/no_pictures.png'}
                    alt={shoe.name}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.brand.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.category.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{shoe.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <button className="text-blue-500 hover:underline" onClick={() => {
                    onShowClassifications();
                    onSelect();
                }}>{shoe.classificationCount} phân loại
                </button>
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{formatDateTime(shoe.createdAt)}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {shoe.isActive ? (
                    <span className="text-green-500">Kinh doanh</span>
                ) : (
                    <span className="text-red-500">Ngừng kinh doanh</span>
                )}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <button className="text-blue-500 hover:underline" onClick={() => {
                    onDetail();
                    onSelect();
                }}>Chi tiết
                </button>
            </td>
        </tr>
    );
};

export default ShoesItem;
