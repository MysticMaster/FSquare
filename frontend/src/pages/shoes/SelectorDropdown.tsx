import React, { useState, useEffect } from "react";

interface Item {
    _id: string;
    name: string;
}

interface Props {
    item: Item | null; // Có thể không có item được truyền vào
    items: Item[]; // Danh sách các item để hiển thị trong Select Box
    onItemSelect: (selectedItem: Item | null) => void; // Hàm callback khi chọn item
}

const SelectorDropdown: React.FC<Props> = ({ item, items, onItemSelect }) => {
    const [selectedValue, setSelectedValue] = useState<Item|null>(null);

    useEffect(() => {
        setSelectedValue(item || null);
    }, [item]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;

        if (selectedId === "") {
            setSelectedValue(null);
            onItemSelect(null); // Callback với null
        } else {
            const selectedItem = items.find((i) => i._id === selectedId) || null;
            setSelectedValue(selectedItem);
            onItemSelect(selectedItem); // Callback với item được chọn
        }
    };

    return (
        <select
            value={selectedValue?._id}
            onChange={handleChange}
            className=" px-3 py-1 border rounded-lg shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
            {/* Giá trị mặc định */}
            <option value="">--Chọn--</option>
            {/* Hiển thị các item từ danh sách */}
            {items.map((i) => (
                <option key={i._id} value={i._id} className="text-gray-700">
                    {i.name}
                </option>
            ))}
        </select>
    );
};

export default SelectorDropdown;

