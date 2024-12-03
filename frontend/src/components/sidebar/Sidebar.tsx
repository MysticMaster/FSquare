import React from 'react';
import {HiArrowSmRight, HiChartPie, HiViewBoards} from "react-icons/hi";
import { BiSolidCategory } from "react-icons/bi";
import {FaChartLine,FaShoppingCart } from "react-icons/fa";
import HiddenSwitch from "../button/HiddenSwitch.tsx";
import SidebarItem from "./SidebarItem.tsx";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store.ts";
import {setShoesOwn} from "../../redux/reducers/classificationSlice.ts";
import {setClassificationOwn} from "../../redux/reducers/sizeSlice.ts";
import {logout} from "../../redux/reducers/authSlice.ts";

interface CustomSidebarProps {
    activeItem: string | null;
    onItemClick: (item: string) => void;
    toggleSidebar: () => void;
    isOpen: boolean;
}

const CustomSidebar: React.FC<CustomSidebarProps> = ({activeItem, onItemClick, toggleSidebar, isOpen}) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleClose = () => {
        dispatch(setShoesOwn(null));
        dispatch(setClassificationOwn(null));
    };

    const handleLogout = () => {
        dispatch(logout())
        window.location.reload()
    }

    return (
        <div
            className={`fixed shadow inset-y-0 w-64 left-0 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} h-screen z-10`}>
            <nav className="">
                <HiddenSwitch toggleSidebar={toggleSidebar}/>
                <SidebarItem
                    item="Tổng quan"
                    icon={<HiChartPie className="mr-2"/>}
                    active={activeItem === 'dashboard'}
                    onClick={() => {
                        onItemClick('dashboard')
                        handleClose()
                    }}
                />
                <SidebarItem
                    item="Quản lý danh mục"
                    icon={<BiSolidCategory  className="mr-2"/>}
                    active={activeItem === 'category'}
                    onClick={() => {
                        onItemClick('category')
                        handleClose()
                    }}
                />
                <SidebarItem
                    item="Quản lý thương hiệu"
                    icon={<BiSolidCategory className="mr-2"/>}
                    active={activeItem === 'brand'}
                    onClick={() => {
                        onItemClick('brand')
                        handleClose()
                    }}
                />
                <SidebarItem
                    item="Quản lý sản phẩm"
                    icon={<HiViewBoards className="mr-2"/>}
                    active={activeItem === 'shoes'}
                    onClick={() => {
                        onItemClick('shoes')
                        handleClose()
                    }}
                />
                <SidebarItem
                    item="Đơn hàng"
                    icon={<FaShoppingCart className="mr-2"/>}
                    active={activeItem === 'orders'}
                    onClick={() => {
                        onItemClick('orders')
                        handleClose()
                    }}
                />
                <SidebarItem
                    item="Thống kê"
                    icon={<FaChartLine className="mr-2"/>}
                    active={activeItem === 'statistical'}
                    onClick={() => {
                        onItemClick('statistical')
                        handleClose()
                    }}
                />
            </nav>
            <div className="border-t mb-5 border-gray-200 text-gray-700">
                <div onClick={handleLogout}
                     className="flex items-center mt-5 hover:bg-gray-100 hover:text-gray-80 cursor-pointer p-2">
                    <HiArrowSmRight className="mr-2"/>
                    Đăng xuất
                </div>
            </div>
        </div>
    );
};

export default CustomSidebar;
