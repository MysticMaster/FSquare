import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import CustomSidebar from "../components/sidebar/Sidebar.tsx";
import Navbar from "../components/navbar/Navbar.tsx";
import Brand from '../pages/Brand';
import Category from "./Category.tsx";
import Shoes from "./Shoes.tsx";

const HomePage: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string | null>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định sidebar hiển thị
    const authority = useSelector((state: RootState) => state.auth.authority);
    const admin = useSelector((state: RootState) => state.auth.admin);

    const handleItemClick = (item: string) => {
        setActiveItem(item);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const renderContent = () => {
        switch (activeItem) {
            case 'dashboard':
                return <div>Dashboard Content</div>; // Nội dung cho Dashboard
            case 'category':
                return <Category/>; // Nội dung cho Quản lý danh mục
            case 'brand':
                return <Brand/>; // Nội dung cho Quản lý thương hiệu
            case 'shoes':
                return <Shoes/>; // Nội dung cho Quản lý danh mục
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
                        <div>Current Authority: {authority}</div>
                        {admin ? (
                            <div className="mt-4">
                                <h2 className="text-xl font-bold">Admin Information</h2>
                                <img src={admin.avatar} alt={`${admin.firstName}`} className="w-40 h-40 rounded-full"/>
                                <p>ID: {admin._id}</p>
                                <p>Name: {admin.lastName} {admin.firstName}</p>
                                <p>Phone: {admin.phone}</p>
                                <p>FCM Token: {admin.fcmToken}</p>
                            </div>
                        ) : (
                            <p>No admin information available.</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="h-screen">
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`flex transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {isSidebarOpen && (
                    <CustomSidebar
                        activeItem={activeItem}
                        onItemClick={handleItemClick}
                        toggleSidebar={toggleSidebar}
                        isOpen={isSidebarOpen}
                    />
                )}
                <div className="flex-grow ">
                    <div className="bg-gray-100 h-screen mt-16">
                        <div className="ps-3 py-3 bg-gray-100">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
