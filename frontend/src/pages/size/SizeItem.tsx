import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Classification {
    _id: string;
    color: string;
}

interface Size {
    _id: string;
    classification: Classification;
    sizeNumber: string;
    weight: number;
    quantity: number;
    createdAt: string;
    isActive: boolean;
}

interface Props {
    size: Size;
    onDetail: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const SizeItem: React.FC<Props> = ({size, onDetail, onSelect, isSelected}) => {
    return (
        <tr className={isSelected ? "bg-blue-100" : "hover:bg-gray-100"}
            onClick={onSelect}>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{size.classification.color}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{size.sizeNumber}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{size.quantity}</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">{size.weight} g</td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {formatDateTime(size.createdAt)}
            </td>
            <td className="py-2 px-3 border-b border-gray-300 text-end">
                {size.isActive ? (
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

export default SizeItem;
