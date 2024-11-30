import React from "react";

interface SearchProps {
    search: string;
    placeholder: string;
    onSearchChange: (search: string) => void;
}

const SearchBox: React.FC<SearchProps> = ({search, placeholder, onSearchChange}) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={handleInputChange}
            className="border border-gray-300 rounded mx-2"
        />
    );
};

export default SearchBox;
