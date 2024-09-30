import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../redux/reducers/brandSlice';
import { RootState, AppDispatch } from '../redux/store';
import BrandItem from "../components/brand/BrandItem";
import BrandForm from "../components/brand/BrandAddForm";

const Brand: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const brands = useSelector((state: RootState) => state.brands.brands);
    const status = useSelector((state: RootState) => state.brands.status);
    const error = useSelector((state: RootState) => state.brands.error);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quản lý thương hiệu</h1>
            <BrandForm /> {/* Hiển thị form thêm thương hiệu mới */}
            {status === 'loading' && <div className="text-lg">Loading...</div>}
            {error && <div className="text-red-500">Error: {error}</div>}
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="py-3 px-3 border-b border-gray-200 text-end"></th>
                    <th className="py-3 px-3 border-b border-gray-200 text-end">Tên thương hiệu</th>
                    <th className="py-3 px-3 border-b border-gray-200 text-end">Số giày có</th>
                    <th className="py-3 px-3 border-b border-gray-200 text-end">Thời gian tạo</th>
                    <th className="py-3 px-3 border-b border-gray-200 text-end">Trạng thái</th>
                    <th className="py-3 px-3 border-b border-gray-200 text-end"></th>
                </tr>
                </thead>
                <tbody>
                {brands && brands.length > 0 ? (
                    brands.map((brand) => (
                        <BrandItem key={brand._id} brand={brand}/>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center py-2">No brands available.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default Brand;
