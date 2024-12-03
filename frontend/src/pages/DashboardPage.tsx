import React from 'react';
import HomeContent from "../components/container/HomeContent.tsx";
import CategoryTable from "./category/CategoryTable.tsx";

const DashboardPage: React.FC = () => {
    return (
        <div className="relative h-screen max-h-[92.5%]">
            <HomeContent>
                <CategoryTable/>
            </HomeContent>
        </div>
    );
};

export default DashboardPage;
