import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoes } from '../redux/reducers/shoesSlice';
import { fetchBrands } from "../redux/reducers/brandSlice";
import { fetchCategories } from "../redux/reducers/categorySlice";
import { RootState, AppDispatch } from '../redux/store';
import ShoesItem from "../components/shoes/ShoesItem";
import Pagination from "../components/pagination/Pagination";
import PageSizeSelector from "../components/pagination/PageSizeSelector.tsx";
import HomeContent from "../components/container/HomeContent.tsx";
import SearchBox from "../components/pagination/SearchBox.tsx";
import TableOptions from "../components/container/TableOptions.tsx";
import ShoesFilterSelector from "../components/pagination/ShoesFilterSelector.tsx";
import PageHeader from "../components/container/PageHeader.tsx";

interface Item {
    _id: string;
    name: string;
}

const Shoes: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const shoes = useSelector((state: RootState) => state.shoes.shoes);
    const pagination = useSelector((state: RootState) => state.shoes.pagination);
    const fetchStatus = useSelector((state: RootState) => state.shoes.fetchStatus);

    const brands = useSelector((state: RootState) => state.brands.brands);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const [filters, setFilters] = useState<{ brandId: string; categoryId: string }>({
        brandId: "",
        categoryId: ""
    });

    useEffect(() => {
        dispatch(fetchBrands({}));
        dispatch(fetchCategories({}));
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchShoes({
            page: currentPage,
            size: pageSize,
            search: searchTerm,
            brandId: filters.brandId,
            categoryId: filters.categoryId
        }));
    }, [currentPage, pageSize, searchTerm, filters, dispatch]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (search: string) => {
        setSearchTerm(search);
        setCurrentPage(1);
    };

    const handleBrandSelect = (selectedBrand: Item | null) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            brandId: selectedBrand ? selectedBrand._id : ""
        }));
        setCurrentPage(1);
    };

    const handleCategorySelect = (selectedCategory: Item | null) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            categoryId: selectedCategory ? selectedCategory._id : ""
        }));
        setCurrentPage(1);
    };

    return (
        <HomeContent>
            <PageHeader title="Quản lý giày">
                <div></div>
            </PageHeader>

            {fetchStatus === 'loading' && <div className="text-lg">Loading...</div>}

            <TableOptions>
                <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange} />
                <div className="flex items-start">
                    <ShoesFilterSelector title="Thương hiệu" type={1} items={brands} onItemSelect={handleBrandSelect} />
                    <ShoesFilterSelector title="Danh mục" type={2} items={categories} onItemSelect={handleCategorySelect} />
                    <SearchBox search={searchTerm} onSearchChange={handleSearchChange} />
                </div>
            </TableOptions>

            <table className="min-w-full border border-gray-300 rounded-lg">
                <thead>
                <tr>
                    <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Thương hiệu</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Danh mục</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Tên giày</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Phân loại</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Ngày tạo</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                </tr>
                </thead>
                <tbody>
                {shoes && shoes.length > 0 ? (
                    shoes.map((shoe) => (
                        <ShoesItem key={shoe._id} shoes={shoe} />
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center italic py-2">Không có sản phẩm nào</td>
                    </tr>
                )}
                </tbody>
            </table>

            <Pagination
                options={{
                    size: pageSize,
                    page: currentPage,
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 1,
                    hasNextPage: pagination?.hasNextPage || false,
                    hasPreviousPage: pagination?.hasPreviousPage || false,
                    nextPage: pagination?.nextPage || null,
                    prevPage: pagination?.prevPage || null,
                }}
                onPageChange={handlePageChange}
            />
        </HomeContent>
    );
}

export default Shoes;
