import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";

import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";
import {fetchClassification, resetClassificationUpdateStatus} from "../../redux/reducers/classificationSlice.ts";
import {fetchOrder} from "../../redux/reducers/orderSlice.ts";
import {formatDateTime} from "../../utils/formatDateTime.ts";

interface Props {
    id: string;
}

interface StatusTimestamps {
    pending: string;
    processing: string;
    shipped: string;
    delivered: string;
    confirmed: string;
    cancelled: string;
    returned: string
}

const formatStatusTimestamps = (statusTimestamps: StatusTimestamps) => {
    console.log(statusTimestamps)
    const statusLabels: { [key: string]: string } = {
        pending: "Thời gian đặt hàng",
        processing: "Thời gian xử lý",
        shipped: "Thời gian giao đơn vị vận chuyển",
        delivered: "Thời gian giao cho khách",
        confirmed: "Thời gian khách xác nhận",
        cancelled: "Thời gian hủy đơn",
        returned: "Thời gian hoàn trả",
    };

    return Object.entries(statusTimestamps)
        .filter(([, timestamp]) => timestamp)
        .map(([status, timestamp]) => {

            return {
                label: statusLabels[status] || status,
                formattedTimestamp: formatDateTime(timestamp, false),
            };
        });
};

const orderStatusMapping: Record<string, string> = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    shipped: "Đã giao cho vận chuyển",
    delivered: "Đã giao khách hàng",
    confirmed: "Đã nhận hàng",
    cancelled: "Đã hủy",
    returned: "Đã trả lại",
};

const ClassificationDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.orders.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.orders.fetchError);
    const order = useSelector((state: RootState) => state.orders.order);

    useEffect(() => {
        dispatch(fetchOrder({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchOrder({id}));
    };

    useEffect(() => {
        console.log(order)
    }, [order]);

    const handleClick = () => {

    }

    if (fetchStatus === stateStatus.loadingState) return <div
        className="w-full h-screen max-h-[90%] flex items-center justify-center">
        <svg aria-hidden="true"
             className="inline w-12 h-12 text-gray-300 animate-spin fill-orange-500"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"/>
        </svg>
    </div>;
    if (fetchStatus === stateStatus.failedState) return <div>Error: {fetchError}</div>;

    return (
        <div>
            <div className={'relative mt-3'}>
                <div className="mb-3 size-full">
                    <div className={'w-full flex justify-between'}>
                        <div className={'border w-full border-gray-300 p-3 me-3 rounded'}>
                            <p className={'text-gray-600'}>Tên khách hàng: <span className={'text-black font-semibold'}>
                                {`${order ? order.customer.lastName : 'Trống'} ${order ? order.customer.firstName : 'Trống'}`}
                            </span></p>
                            <p className={'text-gray-600'}>Email: <span className={'text-black font-semibold'}>
                                {`${order ? order.customer.email : 'Trống'}`}
                            </span></p>
                            <p className={'text-gray-600'}>Số điện thoại: <span className={'text-black font-semibold'}>
                                {`${order ? order.customer.phone : 'Trống'}`}
                            </span></p>
                        </div>
                        <div className={'border w-full border-gray-300 p-3 rounded'}>
                            <p className={'text-gray-600'}>Tên người nhận: <span className={'text-black font-semibold'}>
                                {`${order ? order.shippingAddress.toName : 'Trống'}`}
                            </span></p>
                            <p className={'text-gray-600'}>Địa chỉ nhận hàng: <span
                                className={'text-black font-semibold'}>
                                {`${order ? order.shippingAddress.toAddress : 'Trống'} ${order ? order.shippingAddress.toWardName : 'Trống'} ${order ? order.shippingAddress.toDistrictName : 'Trống'} ${order ? order.shippingAddress.toProvinceName : 'Trống'} `}
                            </span></p>
                            <p className={'text-gray-600'}>Số điện thoại nhận hàng: <span
                                className={'text-black font-semibold'}>
                                {`${order ? order.shippingAddress.toPhone : 'Trống'}`}
                            </span></p>
                        </div>
                    </div>
                    <div className={'w-full border border-gray-300 p-3 mt-3 rounded'}>
                        <h2 className="text-gray-400">Thông tin đơn hàng</h2>
                        <p className={'text-gray-600'}>Số mặt hàng: <span
                            className={'text-black font-semibold'}>
                                {`${order ? order.orderItems.length + ' mặt hàng' : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Trọng lượng: <span
                            className={'text-black font-semibold'}>
                                {`${order ? order.weight + ' g' : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Giá trị đơn hàng: <span
                            className={'text-black font-semibold'}>
                                {`${order ? new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(order.codAmount) : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Phí vận chuyển: <span
                            className={`text-black font-semibold ${order && order.isFreeShip ? 'line-through' : 'Trống'}`}>
                                {`${order ? new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(order.shippingFee) : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Nội dung đơn hàng: <span
                            className={'text-black font-semibold'}>
                                {`${order ? order.content : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Trạng thái thanh toán: {order && order.isPayment ? (
                            <span className="text-green-500">Đã thanh toán online</span>
                        ) : (
                            <span className="text-red-500">Thanh toán khi nhận hàng</span>
                        )}</p>
                        <p className={'text-gray-600'}>Ghi chú: <span
                            className={'text-black font-semibold'}>
                                {`${order && order.note ? order.note : 'Trống'}`}
                            </span></p>
                        <p className={'text-gray-600'}>Trạng thái hiện tại: <span
                            className={'text-black font-semibold'}>
                                {`${order ? orderStatusMapping[order.status] : 'Trống'}`}
                            </span></p>
                    </div>
                    <div className={'w-full border border-gray-300 p-3 mt-3 rounded'}>
                        {order && order.statusTimestamps ? (
                            <ul className={'list-disc pl-5'}>
                                {formatStatusTimestamps(order.statusTimestamps).map((status, index) => (
                                    <li key={index} className={'text-gray-600'}>
                                        <span className="font-semibold text-black">{status.label}:</span>{" "}
                                        {status.formattedTimestamp}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={'text-gray-600'}>Chưa có thông tin trạng thái</p>
                        )}
                    </div>
                    <h2 className="text-lg font-semibold mb-2 mt-2">Danh sách mặt hàng</h2>
                    <table className="table-auto border-collapse border rounded-lg border-gray-300 w-full text-left">
                        <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">#</th>
                            <th className="border border-gray-300 p-2">Tên giày</th>
                            <th className="border border-gray-300 p-2">Phân loại</th>
                            <th className="border border-gray-300 p-2">Kích cỡ</th>
                            <th className="border border-gray-300 p-2">Đơn giá</th>
                            <th className="border border-gray-300 p-2">Số lượng</th>
                            <th className="border border-gray-300 p-2">Tổng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order && order.orderItems.map((item, index) => (
                            <tr key={item._id}>
                                <td className="border border-gray-300 p-2">{index + 1}</td>
                                <td className="border border-gray-300 p-2">
                                    {item.shoes ? item.shoes.name : "N/A"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {item.classification ? item.classification.color : "N/A"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {item.size ? item.size.sizeNumber : "N/A"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.price)}
                                </td>
                                <td className="border border-gray-300 p-2">{item.quantity}</td>
                                <td className="border border-gray-300 p-2">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(item.price * item.quantity)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ClassificationDetail;
