import React from 'react';
import HomeContent from "../components/container/HomeContent.tsx";
import OrderTable from "./order/OrderTable.tsx";

const OrderPage: React.FC = () => {
    return (
        <div className="relative h-screen max-h-[92.5%]">
            <HomeContent>
                <OrderTable/>
            </HomeContent>
        </div>
    );
};

export default OrderPage;
