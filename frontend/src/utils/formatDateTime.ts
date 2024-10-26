export const formatDateTime = (dateString: string, onlyDate: boolean = true): string => {
    const date = new Date(dateString);

    let options: Intl.DateTimeFormatOptions;

    if (onlyDate) {
        options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
    } else {
        options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
    }

    return new Intl.DateTimeFormat('vi-VN', options).format(date);
};
