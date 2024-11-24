import React from 'react';
import HomeContent from "../components/container/HomeContent.tsx";
import BrandTable from "./brand/BrandTable.tsx";

const BrandPage: React.FC = () => {
    return (
        <div className="relative h-screen max-h-[92.5%]">
            <HomeContent>
                <BrandTable/>
            </HomeContent>
        </div>
    );
};

export default BrandPage;
