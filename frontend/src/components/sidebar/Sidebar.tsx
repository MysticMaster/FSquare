import React from 'react';
import { HiArrowSmRight, HiChartPie, HiShoppingBag, HiViewBoards } from "react-icons/hi";
import HiddenSwitch from "../button/HiddenSwitch.tsx";
import SidebarItem from "./SidebarItem.tsx";

interface CustomSidebarProps {
    activeItem: string | null;
    onItemClick: (item: string) => void;
    toggleSidebar: () => void;
    isOpen: boolean;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({ activeItem, onItemClick, toggleSidebar, isOpen }) => {
    return (
        <div className={`fixed shadow-xl inset-y-0 w-64 left-0 bg-white flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} h-screen z-10`}>
            <nav className="">
                <HiddenSwitch toggleSidebar={toggleSidebar} />
                <SidebarItem
                    item="Tổng quan"
                    icon={<HiChartPie className="mr-2" />}
                    active={activeItem === 'dashboard'}
                    onClick={() => onItemClick('dashboard')}
                />
                <SidebarItem
                    item="Quản lý danh mục"
                    icon={<HiViewBoards className="mr-2" />}
                    active={activeItem === 'category'}
                    onClick={() => onItemClick('category')}
                />
                <SidebarItem
                    item="Quản lý thương hiệu"
                    icon={<HiViewBoards className="mr-2" />}
                    active={activeItem === 'brand'}
                    onClick={() => onItemClick('brand')}
                />
                <SidebarItem
                    item="Quản lý giày"
                    icon={<HiViewBoards className="mr-2" />}
                    active={activeItem === 'shoes'}
                    onClick={() => onItemClick('shoes')}
                />
                <SidebarItem
                    item="Đơn hàng"
                    icon={<HiShoppingBag className="mr-2" />}
                    active={activeItem === 'orders'}
                    onClick={() => onItemClick('orders')}
                />
            </nav>
            <div className="border-t mt-10 border-gray-200 text-gray-700">
                <div className="flex items-center mt-5 hover:bg-gray-100 hover:text-gray-80 cursor-pointer p-2">
                    <HiArrowSmRight className="mr-2" />
                    Đăng xuất
                </div>
            </div>
        </div>
    );
};

export default CustomSidebar;
