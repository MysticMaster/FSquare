import React from "react";

interface Props {
    title: string;
    onClick: () => void;
}

const TextButton: React.FC<Props> = ({title, onClick}) => {
    return (
        <button className="text-2xl font-bold" onClick={onClick}>
            {title}
        </button>
    )
}

export default TextButton;
