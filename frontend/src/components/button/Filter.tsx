import React, {useState} from "react";

interface Props {
    onClick: () => void;
}

const Filter: React.FC<Props> = ({onClick}) => {
    const [isFilterActive, setIsFilterActive] = useState(false);

    const handleClick = () => {
        setIsFilterActive(!isFilterActive);
        onClick();
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            {isFilterActive ? (
                <img src="/logo/clear_filter.png" className="w-8 h-8" alt="clear_filter"/>
            ) : (
                <img src="/logo/filter.png" className="w-8 h-8" alt="filter"/>
            )}
        </div>
    );
};

export default Filter;
