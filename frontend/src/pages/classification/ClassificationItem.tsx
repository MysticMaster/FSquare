import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Media {
    url: string;
    key: string;
}

interface Shoes {
    _id: string;
    name: string;
}

interface Classification {
    _id: string;
    shoes: Shoes;
    color: string;
    thumbnail: Media | null;
    price: number;
    sizeCount: number | null;
    createdAt: string;
    isActive: boolean
}

interface Props {
    classification: Classification;
    onDetail: () => void;
    onSelect: () => void;
    onShowSizes: () => void;
    isSelected: boolean;
}

const ClassificationItem: React.FC<Props> = ({classification, onDetail, onSelect, onShowSizes, isSelected}) => {
    return (
        <tr className={isSelected ? "bg-blue-100" : "hover:bg-gray-100"}
            onClick={onSelect}>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <img
                    src={classification.thumbnail ? classification.thumbnail.url : './logo/no_pictures.png'}
                    alt={classification.color}
                    className="w-12 h-12 object-cover rounded"
                />
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{classification.shoes.name}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{classification.color}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(classification.price)}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                <button className="text-blue-500 hover:underline" onClick={() => {
                    onShowSizes();
                    onSelect();
                }}>{classification.sizeCount} kích cỡ
                </button>
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {formatDateTime(classification.createdAt)}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {classification.isActive ? (
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

export default ClassificationItem;
