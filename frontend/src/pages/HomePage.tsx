import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import CustomSidebar from "../components/sidebar/Sidebar.tsx";
import Navbar from "../components/navbar/Navbar.tsx";
import BrandPage from './BrandPage.tsx';
import CategoryPage from "./CategoryPage.tsx";
import ShoesPage from "./ShoesPage.tsx";
import '../styles.scss'
import DetailContainer from "../components/container/DetailContainer.tsx";

const HomePage: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string | null>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mặc định sidebar hiển thị
    const authority = useSelector((state: RootState) => state.auth.authority);
    const admin = useSelector((state: RootState) => state.auth.admin);

    const categoryDetailId = useSelector((state: RootState) => state.categories.detailId);
    const brandDetailId = useSelector((state: RootState) => state.brands.detailId);
    const shoesDetailId = useSelector((state: RootState) => state.shoes.detailId);

    const [isDetail, setIsDetail] = useState<boolean>(false)

    useEffect(() => {
        if (categoryDetailId || brandDetailId || shoesDetailId) setIsDetail(true)
        else setIsDetail(false)
    }, [categoryDetailId, brandDetailId, shoesDetailId]);

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
                return <CategoryPage/>; // Nội dung cho Quản lý danh mục
            case 'brand':
                return <BrandPage/>; // Nội dung cho Quản lý thương hiệu
            case 'shoes':
                return <ShoesPage/>; // Nội dung cho Quản lý danh mục
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
        <div className={`bg-gray-100 w-screen fixed`}>
            <Navbar toggleSidebar={toggleSidebar}/>
            <div className={`flex transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                {isSidebarOpen && <CustomSidebar
                    activeItem={activeItem}
                    onItemClick={handleItemClick}
                    toggleSidebar={toggleSidebar}
                    isOpen={isSidebarOpen}
                />}
                <div className="flex-grow p-3 mt-16 h-screen">
                    {renderContent()}
                </div>
                {isDetail && <DetailContainer/>}
            </div>
        </div>
    );
};

export default HomePage;
