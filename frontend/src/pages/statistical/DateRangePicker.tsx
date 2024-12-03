import React from 'react';

interface Props {
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<Props> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    const formatDateToInput = (date: string) => {
        if (!date) return '';
        const [day, month, year] = date.split('-');
        return `${year}-${month}-${day}`;
    };

    const formatDateFromInput = (date: string) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex flex-col">
                <label htmlFor="start-date" className="font-semibold text-sm mb-1">Ngày bắt đầu</label>
                <input
                    id="start-date"
                    type="date"
                    value={formatDateToInput(startDate)}
                    onChange={(e) => onStartDateChange(formatDateFromInput(e.target.value))}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
                />
            </div>

            <div className="flex flex-col">
                <label htmlFor="end-date" className="font-semibold text-sm mb-1">Ngày kết thúc</label>
                <input
                    id="end-date"
                    type="date"
                    value={formatDateToInput(endDate)}
                    onChange={(e) => onEndDateChange(formatDateFromInput(e.target.value))}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
        </div>
    );
};

export default DateRangePicker;
