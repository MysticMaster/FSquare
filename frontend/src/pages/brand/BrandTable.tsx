import React, {useEffect, useState} from "react";
import BrandAddForm from "./BrandAddForm.tsx";
import BrandItem from "./BrandItem.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchBrands, setBrandIdDetail} from "../../redux/reducers/brandSlice.ts";
import stateStatus from "../../utils/stateStatus.ts";
import TextButton from "../../components/button/TextButton.tsx";
import TableOptions from "../../components/container/TableOptions.tsx";
import PageSizeSelector from "../../components/pagination/PageSizeSelector.tsx";
import SearchBox from "../../components/filter/SearchBox.tsx";
import Filter from "../../components/button/Filter.tsx";
import FilterContainer from "../../components/container/FilterContainer.tsx";
import StatusFilterSelector from "../../components/filter/StatusFilterSelector.tsx";
import Loading from "../../components/Loading.tsx";
import Pagination from "../../components/pagination/Pagination.tsx";

const BrandTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const brands = useSelector((state: RootState) => state.brands.brands);
    const pagination = useSelector((state: RootState) => state.brands.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.brands.fetchAllStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<boolean | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [isAddBrand, setIsAddBrand] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBrands({page: currentPage, size: pageSize, search: searchTerm, status: status}));
    }, [currentPage, pageSize, searchTerm, status, dispatch]);

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

    const handleAdd = () => {
        setIsAddBrand(true)
    }

    const handleCancelAdd = () => {
        setIsAddBrand(false)
    }

    const handleDetail = (id: string) => {
        dispatch(setBrandIdDetail(id))
    }

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    return (
        <div className={"relative"}>
            <div>
                <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                    <h1 className="text-2xl font-bold">Quản lý thương hiệu</h1>
                    <TextButton onClick={handleAdd} title="Thêm mới"/>
                </div>
                <TableOptions>
                    <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                    <div className="flex items-center">
                        <SearchBox search={searchTerm} placeholder={'Tìm kiếm theo tên...'} onSearchChange={handleSearchChange}/>
                        <Filter onClick={handleVisibleFilter}/>
                    </div>
                </TableOptions>

                <FilterContainer isVisible={isFilter}>
                    <StatusFilterSelector onItemSelect={handleStatusSelect}/>
                </FilterContainer>

                {
                    fetchAllStatus === stateStatus.loadingState ? (
                        <Loading/>
                    ) : (
                        <div>
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
                                        <BrandItem
                                            key={brand._id}
                                            brand={brand}
                                            onClick={() => handleDetail(brand._id)}
                                            onSelect={() => handleSelect(brand._id)}
                                            isSelected={selectedId === brand._id}/>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center italic py-2">Không có thượng hiệu nào
                                        </td>
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
                        </div>
                    )
                }
            </div>
            {
                isAddBrand && <div className="absolute inset-0 bg-white z-10">
                    <div className={"w-full flex justify-between items-center mb-4"}>
                        <h1 className="text-2xl font-bold">Thêm thương hiệu</h1>
                        <TextButton onClick={handleCancelAdd} title="Hủy bỏ"/>
                    </div>
                    <BrandAddForm onAddSuccess={handleCancelAdd}/>
                </div>
            }
        </div>
    )
}

export default BrandTable
