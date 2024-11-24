import React, {useState} from "react";
import TextButton from "../button/TextButton.tsx";

interface Props {
    children: React.ReactNode;
    title: string;
    buttonTitle: string;
}

const PageHeader: React.FC<Props> = ({children, title, buttonTitle}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                <h1 className="text-2xl font-bold">{title}</h1>
                <TextButton onClick={handleClick} title={isOpen ? 'Hủy bỏ' : buttonTitle}/>
            </div>
            {isOpen && children}
        </div>
    )
}

export default PageHeader;
