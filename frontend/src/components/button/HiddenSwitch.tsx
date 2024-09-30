"use client";
import React from "react";
import { FiMenu } from "react-icons/fi";

interface HiddenSwitchProps {
    toggleSidebar: () => void;
}

const HiddenSwitch: React.FC<HiddenSwitchProps> = ({ toggleSidebar }) => {
    return (
        <div className="flex items-center h-16 px-5" onClick={toggleSidebar}>
            <FiMenu className="mr-5 h-6 w-6" />
            <img src="/logo/fsquare_light.webp" className="w-9 h-9 rounded-lg" alt="logo" />
            <h1 className="text-xl font-bold text-gray-700 ml-2">FSquare</h1>
        </div>
    );
}

export default HiddenSwitch;
