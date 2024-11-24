import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {CiCircleChevRight} from "react-icons/ci";
import {setCategoryIdDetail} from "../../redux/reducers/categorySlice.ts";
import {setShoesIdDetail} from "../../redux/reducers/shoesSlice.ts";
import {setBrandIdDetail} from "../../redux/reducers/brandSlice.ts";
import CategoryDetail from "../../pages/category/CategoryDetail.tsx";
import BrandDetail from "../../pages/brand/BrandDetail.tsx";
import ShoesDetail from "../../pages/shoes/ShoesDetail.tsx";

const DetailContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const categoryDetailId = useSelector((state: RootState) => state.categories.detailId);
    const brandDetailId = useSelector((state: RootState) => state.brands.detailId);
    const shoesDetailId = useSelector((state: RootState) => state.shoes.detailId);

    const handleClose = () => {
        if (categoryDetailId) dispatch(setCategoryIdDetail(null));
        if (brandDetailId) dispatch(setBrandIdDetail(null));
        if (shoesDetailId) dispatch(setShoesIdDetail(null));
    };

    const renderContent = () => {
        if (categoryDetailId) return <CategoryDetail id={categoryDetailId} />;
        if (brandDetailId) return <BrandDetail id={brandDetailId} />;
        if (shoesDetailId) return <ShoesDetail id={shoesDetailId} />;
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-20 z-40"
            ></div>

            <div
                className={`fixed shadow-lg shadow-gray-300 w-2/5 right-0 bg-white h-screen py-4 ps-4 pe-1 custom-overflow-y z-50`}
            >
                <div className={"flex items-center justify-start mb-3"}>
                    <CiCircleChevRight
                        onClick={handleClose}
                        className={"text-black text-4xl me-2"}
                    />
                    <h1 className={"text-2xl text-black font-bold"}>Chi Tiết</h1>
                </div>
                {renderContent()}
            </div>
        </>
    );
};

export default DetailContainer;
