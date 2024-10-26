import React, {useState} from "react";

interface Props {
    children: React.ReactNode;
    title: string;
}

const PageHeader: React.FC<Props> = ({children, title}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h1 className="text-2xl font-bold">{title}</h1>
                <button className="text-2xl font-bold"
                        onClick={handleClick}>
                    {isOpen ? 'Đóng' : 'Thêm mới'}
                </button>
            </div>
            {isOpen && children}
        </div>
    )
}

export default PageHeader;
