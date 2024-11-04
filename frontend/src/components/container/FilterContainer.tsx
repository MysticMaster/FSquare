import React from "react";

interface Props {
    children: React.ReactNode;
    isVisible: boolean;
}

const FilterContainer: React.FC<Props> = ({ children, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="flex w-full my-2 justify-start">
            {children}
        </div>
    );
}

export default FilterContainer;
