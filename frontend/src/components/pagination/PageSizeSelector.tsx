import React from 'react';

interface PageSizeSelectorProps {
    pageSize: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({ pageSize, onChange }) => {
    return (
        <div>
            <label htmlFor="pageSize">Hiển thị:</label>
            <select
                id="pageSize"
                value={pageSize}
                onChange={onChange}
                className="ml-2 border border-gray-300 px-2 text-sm rounded"
            >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
};

export default PageSizeSelector;
