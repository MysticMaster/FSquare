import React, {useEffect, useState} from "react";
import ShoesItem from "./ShoesItem.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchBrands} from "../../redux/reducers/brandSlice.ts";
import {fetchCategories} from "../../redux/reducers/categorySlice.ts";
import {fetchShoes, setShoesIdDetail} from "../../redux/reducers/shoesSlice.ts";
import stateStatus from "../../utils/stateStatus.ts";
import ShoesAddForm from "./ShoesAddForm.tsx";
import {setShoesOwn} from "../../redux/reducers/classificationSlice.ts";
import TextButton from "../../components/button/TextButton.tsx";
import TableOptions from "../../components/container/TableOptions.tsx";
import PageSizeSelector from "../../components/pagination/PageSizeSelector.tsx";
import SearchBox from "../../components/filter/SearchBox.tsx";
import Filter from "../../components/button/Filter.tsx";
import FilterContainer from "../../components/container/FilterContainer.tsx";
import StatusFilterSelector from "../../components/filter/StatusFilterSelector.tsx";
import ShoesFilterSelector from "../../components/filter/ShoesFilterSelector.tsx";
import Loading from "../../components/Loading.tsx";
import Pagination from "../../components/pagination/Pagination.tsx";

interface Item {
    _id: string;
    name: string;
}

const ShoesTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const shoes = useSelector((state: RootState) => state.shoes.shoes);
    const pagination = useSelector((state: RootState) => state.shoes.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.shoes.fetchAllStatus);

    const brands = useSelector((state: RootState) => state.brands.brands);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<boolean | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [isAddShoes, setIsAddShoes] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);

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
            status: status,
            brandId: filters.brandId,
            categoryId: filters.categoryId
        }));
    }, [currentPage, pageSize, searchTerm, status, filters, dispatch]);

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

    const handleVisibleFilter = () => {
        setIsFilters(!isFilter)
        if (isFilter) {
            setStatus(null)
            setFilters({brandId: '', categoryId: ''});
        }
    }

    const handleStatusSelect = (selectedStatus: boolean | null) => {
        setStatus(selectedStatus);
        setCurrentPage(1);
    };

    const handleAdd = () => {
        setIsAddShoes(true)
    }

    const handleCancelAdd = () => {
        setIsAddShoes(false)
    }

    const handleDetail = (id: string) => {
        dispatch(setShoesIdDetail(id))
    }

    const handleShowClassifications = (id: string, name: string) => {
        dispatch(setShoesOwn({_id: id, name: name}));
    }

    const handleSelect = (id: string) => {
        setSelectedId(id)
    };

    return (
        <div className={"relative"}>
            <div>
                <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                    <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                    <TextButton onClick={handleAdd} title="Thêm mới"/>
                </div>
                <TableOptions>
                    <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                    <div className="flex items-center">
                        <SearchBox search={searchTerm} onSearchChange={handleSearchChange}/>
                        <Filter onClick={handleVisibleFilter}/>
                    </div>
                </TableOptions>

                <FilterContainer isVisible={isFilter}>
                    <StatusFilterSelector onItemSelect={handleStatusSelect}/>
                    <ShoesFilterSelector title="Thương hiệu" type={1} items={brands}
                                         onItemSelect={handleBrandSelect}/>
                    <ShoesFilterSelector title="Danh mục" type={2} items={categories}
                                         onItemSelect={handleCategorySelect}/>
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
                                        <ShoesItem
                                            key={shoe._id}
                                            shoe={shoe}
                                            onDetail={() => handleDetail(shoe._id)}
                                            onSelect={() => handleSelect(shoe._id)}
                                            onShowClassifications={() => handleShowClassifications(shoe._id, shoe.name)}
                                            isSelected={selectedId === shoe._id}/>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center italic py-2">Không có sản phẩm nào
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
                isAddShoes && (<div className="absolute inset-0 bg-white z-10">
                    <div className={"w-full flex justify-between items-center mb-4"}>
                        <h1 className="text-2xl font-bold">Thêm sản phẩm</h1>
                        <TextButton onClick={handleCancelAdd} title="Hủy bỏ"/>
                    </div>
                    <ShoesAddForm onAddSuccess={handleCancelAdd}/>
                </div>)
            }
        </div>
    )
}

export default ShoesTable
