import React, { useState, useEffect } from "react";

interface OrderStatusItem {
    _id: string;
    name: string;
    status: string | null;
}

interface OrderStatusFilterSelectorProps {
    onItemSelect: (selectedStatus: string | null) => void;
}

const OrderStatusFilterSelector: React.FC<OrderStatusFilterSelectorProps> = ({ onItemSelect }) => {
    const [selectedItemId, setSelectedItemId] = useState<string>("all");
    const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({});
    const type = "status";

    const allItems: OrderStatusItem[] = [
        { _id: "all", name: "Tất cả", status: null },
        { _id: "pending", name: "Chờ xử lý", status: "pending" },
        { _id: "processing", name: "Đang xử lý", status: "processing" },
        { _id: "shipped", name: "Đã giao vận chuyển", status: "shipped" },
        { _id: "delivered", name: "Đã giao hàng", status: "delivered" },
        { _id: "confirmed", name: "Đã nhận hàng", status: "confirmed" },
        { _id: "cancelled", name: "Đã hủy", status: "cancelled" },
        { _id: "returned", name: "Hoàn trả", status: "returned" },
    ];

    const handleItemChange = (item: OrderStatusItem) => {
        setSelectedItemId(item._id);
        onItemSelect(item.status);
    };

    const toggleDropdown = () => {
        setDropdownStates((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (dropdownStates[type] && !target.closest(`#dropdownDefaultRadio${type}`) && !target.closest(`#dropdownRadioButton${type}`)) {
            setDropdownStates((prev) => ({ ...prev, [type]: false }));
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [dropdownStates[type]]);

    const isOpen = dropdownStates[type] || false;

    return (
        <div className="relative me-3">
            <button
                id={`dropdownRadioButton${type}`}
                onClick={toggleDropdown}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
            >
                Trạng thái đơn hàng
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    id={`dropdownDefaultRadio${type}`}
                    className="absolute z-50 w-full sm:w-72 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                >
                    <ul
                        className="p-3 text-sm text-gray-700 dark:text-gray-200 grid grid-cols-1 gap-2"
                        aria-labelledby={`dropdownRadioButton${type}`}
                    >
                        {allItems.map((item) => (
                            <li key={item._id}>
                                <div className="flex items-center my-1">
                                    <input
                                        id={item._id}
                                        type="radio"
                                        value={item._id}
                                        name="order-status-radio"
                                        checked={selectedItemId === item._id}
                                        onChange={() => handleItemChange(item)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <label
                                        htmlFor={item._id}
                                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                        {item.name}
                                    </label>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrderStatusFilterSelector;
