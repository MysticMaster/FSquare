import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBrands} from '../redux/reducers/brandSlice';
import {RootState, AppDispatch} from '../redux/store';
import BrandItem from "../components/brand/BrandItem";
import BrandForm from "../components/brand/BrandAddForm";

const Brand: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const brands = useSelector((state: RootState) => state.brands.brands);
    const pagination = useSelector((state: RootState) => state.brands.pagination);
    const fetchStatus = useSelector((state: RootState) => state.brands.fetchStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Mặc định là 5

    useEffect(() => {
        dispatch(fetchBrands({ page: currentPage, size: pageSize }));
    }, [currentPage, pageSize, dispatch]);

    const handleNextPage = () => {
        if (pagination?.hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (pagination?.hasPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1); // Reset về trang 1 khi thay đổi số lượng hiển thị
    };

    return (
        <div className="ps-3 pt-3 bg-gray-100">
            <div className="bg-white rounded-ss-xl p-3">
                <h1 className="text-2xl font-bold mb-4">Quản lý thương hiệu</h1>
                <BrandForm/> {/* Hiển thị form thêm thương hiệu mới */}
                {fetchStatus === 'loading' && <div className="text-lg">Loading...</div>}
                <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead>
                    <tr>
                        <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                        <th className="py-3 px-3 border-b border-gray-300 text-end">Tên thương hiệu</th>
                        <th className="py-3 px-3 border-b border-gray-300 text-end">Số giày có</th>
                        <th className="py-3 px-3 border-b border-gray-300 text-end">Thời gian tạo</th>
                        <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                        <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
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

                {/* Pagination Controls */}
                <div className="flex justify-between mt-4 items-center">
                    {/* Dropdown chọn số lượng hiển thị */}
                    <div>
                        <label htmlFor="pageSize">Hiển thị:</label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="ml-2 border border-gray-300 p-2 rounded"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    {/* Các nút chuyển trang */}
                    <div className="flex">
                        <button
                            onClick={handlePreviousPage}
                            disabled={!pagination?.hasPreviousPage}
                            className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={!pagination?.hasNextPage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Brand;
