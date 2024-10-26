import React from "react";

interface TableOptionsProps {
    children: React.ReactNode;
}

const TableOptions:React.FC<TableOptionsProps> = ({children}) => {
    return(
        <div className="flex mt-5 mb-3 justify-between">
            {children}
        </div>
    )
}

export default TableOptions;
