import React, { useState, useEffect } from "react";

interface Item {
    _id: string;
    name: string;
}

interface ShoesFilterProps {
    title: string;
    type: number;
    items: Item[];
    onItemSelect: (selectedItem: Item | null) => void;
}

const ShoesFilterSelector: React.FC<ShoesFilterProps> = ({ title, type, items, onItemSelect }) => {
    const [selectedItemId, setSelectedItemId] = useState<string>(`${type}`);
    const [dropdownStates, setDropdownStates] = useState<{ [key: number]: boolean }>({});

    const allItems: Item[] = [
        { _id: `${type}`, name: "Tất cả" },
        ...items
    ];

    const handleItemChange = (item: Item) => {
        setSelectedItemId(item._id);

        if (item._id === `${type}`) {
            onItemSelect(null);
        } else {
            onItemSelect(item);
        }
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
                {title}
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
                        className="p-3 text-sm text-gray-700 dark:text-gray-200 grid grid-cols-2 gap-2"
                        aria-labelledby={`dropdownRadioButton${type}`}
                    >
                        {allItems.map((item) => (
                            <li key={item._id}>
                                <div className="flex items-center my-1">
                                    <input
                                        id={item._id}
                                        type="radio"
                                        value={item._id}
                                        name="item-radio"
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

export default ShoesFilterSelector;
