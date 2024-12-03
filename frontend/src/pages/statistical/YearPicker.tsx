import React from "react";

interface Props {
    selectedYear: number | null;
    onYearChange: (year: number) => void;
}

const YearPicker: React.FC<Props> = ({ selectedYear, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <div className="w-32 flex flex-col">
            <label htmlFor="year-picker" className="font-semibold mb-1">Chọn năm</label>
            <select
                id="year-picker"
                value={selectedYear ?? ''}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="py-2 px-4 border border-gray-400 rounded-md shadow-sm"
            >
                <option value="">Chọn năm</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default YearPicker;
