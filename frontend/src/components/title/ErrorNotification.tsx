import React from "react";

interface Props {
    message: string;
}

const ErrorNotification: React.FC<Props> = ({message}) => {
    return (
        <span className="text-red-500 italic">{message}</span>
    )
}

export default ErrorNotification;
