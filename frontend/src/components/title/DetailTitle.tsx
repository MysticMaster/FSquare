import React from "react";

interface Props {
    title: string;
    content: string;
}

const DetailTitle: React.FC<Props> = ({title, content}) => {
    return (
        <div className={'mb-3'}>
            <h2 className="text-gray-400">{title}</h2>
            <span className="text-black">{content}</span>
        </div>
    )
}

export default DetailTitle;
