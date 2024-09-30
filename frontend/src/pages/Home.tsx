import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CustomSidebar from "../components/sidebar/Sidebar.tsx";
import Navbar from "../components/navbar/Navbar.tsx";
import Brand from '../pages/Brand';

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
            case 'brand':
                return <Brand />;
            case 'dashboard':
                return <div>Dashboard Content</div>; // Nội dung cho Dashboard
            case 'category':
                return <div>Category Management Content</div>; // Nội dung cho Quản lý danh mục
            default:
                return (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
                        <div>Current Authority: {authority}</div>
                        {admin ? (
                            <div className="mt-4">
                                <h2 className="text-xl font-bold">Admin Information</h2>
                                <img src={admin.avatar} alt={`${admin.firstName}`} className="w-40 h-40 rounded-full" />
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
        <div className=" h-screen overflow-hidden">
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
                <div className="flex-grow overflow-y-auto">
                    <div className="ps-4 pt-4 bg-gray-200 h-screen overflow-y-auto">
                        <div className="bg-white h-full">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
