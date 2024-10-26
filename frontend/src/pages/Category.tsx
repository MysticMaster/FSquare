import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCategories} from '../redux/reducers/categorySlice';
import {RootState, AppDispatch} from '../redux/store';
import CategoryItem from "../components/category/CategoryItem";
import CategoryForm from "../components/category/CategoryAddForm";
import Pagination from "../components/pagination/Pagination";
import PageSizeSelector from "../components/pagination/PageSizeSelector.tsx";
import HomeContent from "../components/container/HomeContent.tsx";
import SearchBox from "../components/pagination/SearchBox.tsx";
import TableOptions from "../components/container/TableOptions.tsx";
import PageHeader from "../components/container/PageHeader.tsx";

const Category: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector((state: RootState) => state.categories.categories);
    const pagination = useSelector((state: RootState) => state.categories.pagination);
    const fetchStatus = useSelector((state: RootState) => state.categories.fetchStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchCategories({page: currentPage, size: pageSize, search: searchTerm}));
    }, [currentPage, pageSize,searchTerm, dispatch]);

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

    return (
        <HomeContent>
            <PageHeader title="Quản lý danh mục">
                <CategoryForm/>
            </PageHeader>
            {fetchStatus === 'loading' && <div className="text-lg">Loading...</div>}

            <TableOptions>
                <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                <SearchBox search={searchTerm} onSearchChange={handleSearchChange}/>
            </TableOptions>

            <table className="min-w-full border border-gray-300 rounded-lg">
                <thead>
                <tr>
                    <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Tên danh mục</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Số lượng giày</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Ngày tạo</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                    <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                </tr>
                </thead>
                <tbody>
                {categories && categories.length > 0 ? (
                    categories.map((category) => (
                        <CategoryItem key={category._id} category={category}/>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center italic py-2">Không có danh mục nào</td>
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
};

export default Category;
