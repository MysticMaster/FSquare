import React from "react";

interface SearchProps {
    search: string;
    onSearchChange: (search: string) => void;
}

const SearchBox: React.FC<SearchProps> = ({search, onSearchChange}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={handleInputChange}
            className="border border-gray-300 rounded mx-2"
        />
    );
};

export default SearchBox;
