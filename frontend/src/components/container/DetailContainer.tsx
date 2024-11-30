import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {CiCircleChevRight} from "react-icons/ci";
import {resetCategoryUpdateStatus, setCategoryIdDetail} from "../../redux/reducers/categorySlice.ts";
import {resetShoesUpdateStatus, setShoesIdDetail} from "../../redux/reducers/shoesSlice.ts";
import {resetBrandUpdateStatus, setBrandIdDetail} from "../../redux/reducers/brandSlice.ts";
import CategoryDetail from "../../pages/category/CategoryDetail.tsx";
import BrandDetail from "../../pages/brand/BrandDetail.tsx";
import ShoesDetail from "../../pages/shoes/ShoesDetail.tsx";
import {resetClassificationUpdateStatus, setClassificationDetailId} from "../../redux/reducers/classificationSlice.ts";
import ClassificationDetail from "../../pages/classification/ClassificationDetail.tsx";
import {resetSizeUpdateStatus, setSizeDetailId} from "../../redux/reducers/sizeSlice.ts";
import SizeDetail from "../../pages/size/SizeDetail.tsx";
import {setOrderDetailId} from "../../redux/reducers/orderSlice.ts";
import OrderDetail from "../../pages/order/OrderDetail.tsx";

const DetailContainer: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const categoryDetailId = useSelector((state: RootState) => state.categories.detailId);
    const brandDetailId = useSelector((state: RootState) => state.brands.detailId);
    const shoesDetailId = useSelector((state: RootState) => state.shoes.detailId);
    const classificationDetailId = useSelector((state: RootState) => state.classifications.detailId);
    const sizeDetailId = useSelector((state: RootState) => state.sizes.detailId);
    const orderDetailId = useSelector((state: RootState) => state.orders.detailId);

    const handleClose = () => {
        if (categoryDetailId) {
            dispatch(setCategoryIdDetail(null));
            dispatch(resetCategoryUpdateStatus());
        }
        if (brandDetailId) {
            dispatch(setBrandIdDetail(null));
            dispatch(resetBrandUpdateStatus());
        }
        if (shoesDetailId) {
            dispatch(setShoesIdDetail(null));
            dispatch(resetShoesUpdateStatus());
        }
        if (classificationDetailId) {
            dispatch(setClassificationDetailId(null));
            dispatch(resetClassificationUpdateStatus());
        }
        if (sizeDetailId) {
            dispatch(setSizeDetailId(null));
            dispatch(resetSizeUpdateStatus());
        }
        if(orderDetailId){
            dispatch(setOrderDetailId(null))
        }
    };

    const renderContent = () => {
        if (categoryDetailId) return <CategoryDetail id={categoryDetailId}/>;
        if (brandDetailId) return <BrandDetail id={brandDetailId}/>;
        if (shoesDetailId) return <ShoesDetail id={shoesDetailId}/>;
        if (classificationDetailId) return <ClassificationDetail id={classificationDetailId}/>;
        if (sizeDetailId) return <SizeDetail id={sizeDetailId}/>;
        if (orderDetailId) return <OrderDetail id={orderDetailId}/>;
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-20 z-40"
            ></div>

            <div
                className={`fixed shadow-lg shadow-gray-300 ${orderDetailId ? 'w-5/6' : 'w-2/5'} right-0 bg-white h-screen py-4 ps-4 pe-1 custom-overflow-y z-50`}
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
