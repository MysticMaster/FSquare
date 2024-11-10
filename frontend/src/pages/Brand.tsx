import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchBrands} from '../redux/reducers/brandSlice';
import {RootState, AppDispatch} from '../redux/store';
import BrandItem from "../components/brand/BrandItem";
import BrandForm from "../components/brand/BrandAddForm";
import Pagination from "../components/pagination/Pagination";
import PageSizeSelector from "../components/pagination/PageSizeSelector.tsx";
import HomeContent from "../components/container/HomeContent.tsx";
import TableOptions from "../components/container/TableOptions.tsx";
import SearchBox from "../components/filter/SearchBox.tsx";
import PageHeader from "../components/container/PageHeader.tsx";
import Filter from "../components/button/Filter.tsx";
import FilterContainer from "../components/container/FilterContainer.tsx";
import StatusFilterSelector from "../components/filter/StatusFilterSelector.tsx";
import {resetUpdateStatus} from "../redux/reducers/brandSlice.ts";
import ModalContainer from "../components/container/ModalContainer.tsx";
import BrandDetail from "../components/brand/BrandDetail.tsx";
import Loading from "../components/Loading.tsx";

const Brand: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const brands = useSelector((state: RootState) => state.brands.brands);
    const pagination = useSelector((state: RootState) => state.brands.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.brands.fetchAllStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<boolean | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [isModal, setIsModal] = useState(false);

    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBrands({page: currentPage, size: pageSize, search: searchTerm, status: status}));
    }, [currentPage, pageSize, searchTerm, status, dispatch]);

    useEffect(() => {
        if (isModal) document.body.style.overflow = "hidden"; // Ngăn cuộn trang
        else document.body.style.overflow = "unset"; // Khôi phục cuộn trang

        return () => {
            document.body.style.overflow = "unset"; // Đảm bảo khôi phục trạng thái cuộn khi component bị gỡ bỏ
        };
    }, [isModal]);

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
    }

    const handleVisibleFilter = () => {
        setIsFilters(!isFilter)
        if (isFilter) {
            setStatus(null)
        }
    }

    const handleStatusSelect = (selectedStatus: boolean | null) => {
        setStatus(selectedStatus);
        setCurrentPage(1);
    };

    const handleDetail = (id: string) => {
        setId(id)
        setIsModal(true)
    }

    const handleClose = () => {
        setIsModal(false)
        dispatch(resetUpdateStatus());
    }

    return (
        <HomeContent>
            <PageHeader title="Quản lý thương hiệu">
                <BrandForm/>
            </PageHeader>
            {fetchAllStatus === 'loading' && <div className="text-lg">Loading...</div>}

            <TableOptions>
                <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                <div className="flex items-center">
                    <SearchBox search={searchTerm} onSearchChange={handleSearchChange}/>
                    <Filter onClick={handleVisibleFilter}/>
                </div>
            </TableOptions>

            <FilterContainer isVisible={isFilter}>
                <StatusFilterSelector onItemSelect={handleStatusSelect}/>
            </FilterContainer>

            {
                fetchAllStatus === 'loading' ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <Loading />
                    </div>
                ) : (
                    <table className="min-w-full border border-gray-300 rounded-lg">
                        <thead>
                        <tr>
                            <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                            <th className="py-3 px-3 border-b border-gray-300 text-end">Tên thương hiệu</th>
                            <th className="py-3 px-3 border-b border-gray-300 text-end">Mẫu hiện có</th>
                            <th className="py-3 px-3 border-b border-gray-300 text-end">Ngày tạo</th>
                            <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                            <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {brands && brands.length > 0 ? (
                            brands.map((brand) => (
                                <BrandItem key={brand._id} brand={brand} onClick={() => {
                                    handleDetail(brand._id)
                                }}/>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center italic py-2">Không có thượng hiệu nào</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )
            }

            <ModalContainer isOpen={isModal} onClose={handleClose}>
                {id !== null && <BrandDetail id={id}/>}
            </ModalContainer>

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

export default Brand;
