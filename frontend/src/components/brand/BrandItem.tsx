import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Thumbnail {
    url: string;
    key: string;
}

interface Brand {
    _id: string;
    thumbnail: Thumbnail | null;
    name: string;
    shoesCount: number;
    createdAt: string;
    isActive: boolean;
}

interface BrandItemProps {
    brand: Brand;
}

const BrandItem: React.FC<BrandItemProps> = ({ brand }) => {
    return (
        <tr className="hover:bg-gray-100">
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={brand.thumbnail ? brand.thumbnail.url : './logo/no_pictures.png'}
                    alt={brand.name}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{brand.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{brand.shoesCount}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{formatDateTime(brand.createdAt)}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {brand.isActive ? (
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

export default BrandItem;
