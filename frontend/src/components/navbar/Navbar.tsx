"use client";
import React from "react";
import HiddenSwitch from "../button/HiddenSwitch.tsx";

interface NavbarProps {
    toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    return (
        <nav className="navbar fixed w-full navbar-expand-lg bg-white h-15 flex items-center px-3 shadow justify-between">
            <HiddenSwitch toggleSidebar={toggleSidebar} />
            <img src="/logo/fsquare_light.webp" alt="admin-avatar" className="w-8 h-8 rounded-3xl" />
        </nav>
    );
}

export default Navbar;
