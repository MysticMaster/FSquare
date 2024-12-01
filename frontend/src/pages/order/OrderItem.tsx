import React from 'react';
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Customer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ShippingAddress {
    toName: string;
    toAddress: string;
    toProvinceName: string;
    toDistrictName: string;
    toWardName: string;
    toPhone: string;
}

interface Order {
    _id: string;
    clientOrderCode: string;
    customer: Customer;
    shippingAddress: ShippingAddress;
    orderItems: number;
    weight: number;
    codAmount: number;
    shippingFee: number;
    isPayment: boolean;
    isFreeShip: boolean;
    status: string;
    createdAt: string;
}

interface Props {
    order: Order;
    onClick: () => void;
    onSelect: () => void;
    isSelected: boolean;
}

const orderStatusMapping: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã giao cho vận chuyển",
    delivered: "Đã giao khách hàng",
    confirmed: "Đã nhận hàng",
    cancelled: "Đã hủy",
    returned: "Đã trả lại",
};

const getStatusClass = (status: string): string => {
    switch (status) {
        case "pending":
            return "text-green-500";
        case "cancelled":
            return "text-red-500";
        case "returned":
            return "text-orange-500";
        default:
            return "text-blue-500";
    }
};

const BrandItem: React.FC<Props> = ({order, onClick, onSelect, isSelected}) => {

    return (
        <tr className={isSelected ? "bg-blue-100" : "hover:bg-gray-100"}
            onClick={onSelect}>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">{order.clientOrderCode}</td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">
                Tên: {order.customer.firstName} {order.customer.lastName} <br/>
                Email: {order.customer.email} <br/>
                SĐT: {order.customer.phone}
            </td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">
                Người nhận: {order.shippingAddress.toName} <br/>
                Địa chỉ: {order.shippingAddress.toAddress},
                {' '+order.shippingAddress.toWardName},
                {' '+order.shippingAddress.toDistrictName},
                {' '+order.shippingAddress.toProvinceName} <br/>
                SĐT: {order.shippingAddress.toPhone}
            </td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">{order.orderItems} Mặt hàng</td>
            <td className="py-2 px-2 border-b border-gray-300 text-red-500 text-sm text-start">
                {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(order.codAmount)}
            </td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">{order.weight} g</td>
            <td className={`py-2 px-2 border-b border-gray-300 text-red-500 text-sm text-start ${order.isFreeShip ? 'line-through' : ''}`}>
                {new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(order.shippingFee)}
            </td>
            <td className={`py-2 px-2 border-b border-gray-300 text-sm text-start ${getStatusClass(order.status)}`}>
                {orderStatusMapping[order.status] || "Không xác định"}
            </td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">
                {order.isPayment ? (
                    <span className="text-green-500">Đã thanh toán<br/>online</span>
                ) : (
                    <span className="text-red-500">Thanh toán<br/>khi nhận hàng</span>
                )}
            </td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">{formatDateTime(order.createdAt,false)}</td>
            <td className="py-2 px-2 border-b border-gray-300 text-sm text-start">
                <button className="text-blue-500 hover:underline" onClick={() => {
                    onClick();
                    onSelect();
                }}>Chi tiết
                </button>
            </td>
        </tr>
    );
};

export default BrandItem;
