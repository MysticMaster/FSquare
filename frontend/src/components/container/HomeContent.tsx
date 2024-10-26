import React from "react";

interface HomeContentProps {
    children: React.ReactNode;
}

const HomeContent: React.FC<HomeContentProps> = ({ children }) => {
    return (
        <div className="bg-white rounded-s-xl p-3">
            {children}
        </div>
    );
}

export default HomeContent;
