"use client";

import React from "react";

interface SidebarItemProps {
    item: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, icon, active, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center px-3 py-2 text-lg ${active ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'} cursor-pointer`}
        >
            {icon}
            {item}
        </div>
    );
};

export default SidebarItem;
