import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchClassifications, setShoesOwn} from "../../redux/reducers/classificationSlice.ts";
import TextButton from "../../components/button/TextButton.tsx";
import TableOptions from "../../components/container/TableOptions.tsx";
import PageSizeSelector from "../../components/pagination/PageSizeSelector.tsx";
import SearchBox from "../../components/filter/SearchBox.tsx";
import Filter from "../../components/button/Filter.tsx";
import FilterContainer from "../../components/container/FilterContainer.tsx";
import StatusFilterSelector from "../../components/filter/StatusFilterSelector.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import Pagination from "../../components/pagination/Pagination.tsx";
import ClassificationItem from "./ClassificationItem.tsx";

const ClassificationTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const shoesOwn = useSelector((state: RootState) => state.classifications.shoesOwn);
    const classifications = useSelector((state: RootState) => state.classifications.classifications);
    const pagination = useSelector((state: RootState) => state.classifications.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.classifications.fetchAllStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<boolean | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [isAddClassification, setIsAddClassification] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (shoesOwn) {
            dispatch(fetchClassifications({
                page: currentPage,
                size: pageSize,
                search: searchTerm,
                status: status,
                shoesId: shoesOwn._id
            }))
        }
    }, [shoesOwn, dispatch, currentPage, pageSize, searchTerm, status]);

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
        setIsAddClassification(true)
    }

    const handleCancelAdd = () => {
        setIsAddClassification(false)
    }

    const handleDetail = (id: string) => {
        // dispatch(setShoesIdDetail(id))
    }

    const handleShowSizes = (id: string) => {
        // dispatch(setShoesId(id))
    }

    const handleSelect = (id: string) => {
        setSelectedId(id)
    };

    const handleBack = () => {
        dispatch(setShoesOwn(null))
    }

    return (
        <div>
            <div className={'flex justify-start items-center mb-3'}>
                    <span className={'text-lg text-black'}>
                        <button className={'underline underline-offset-2 me-1 text-blue-500'}
                                onClick={handleBack}>
                            Quản lý sản phẩm</button>
                        / Quản lý phân loại
                    </span>
            </div>
            <div className={"relative"}>
                <div>
                    <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                        <h1 className="text-2xl font-bold">Danh sách phân loại - {shoesOwn ? shoesOwn.name : ''}</h1>
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
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Sản phẩm</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Màu sắc</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Giá</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Kích cỡ</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Ngày tạo</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {classifications && classifications.length > 0 ? (
                                        classifications.map((classification) => (
                                            <ClassificationItem
                                                key={classification._id}
                                                classification={classification}
                                                onDetail={() => handleDetail(classification._id)}
                                                onSelect={() => handleSelect(classification._id)}
                                                onShowSizes={() => {
                                                }}
                                                isSelected={selectedId === classification._id}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center italic py-2">Không có phân loại nào
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
                    isAddClassification && (<div className="absolute inset-0 bg-white z-10">
                        <div className={"w-full flex justify-between items-center mb-4"}>
                            <h1 className="text-2xl font-bold">Thêm phân loại</h1>
                            <TextButton onClick={handleCancelAdd} title="Hủy bỏ"/>
                        </div>

                    </div>)
                }
            </div>
        </div>
    )
}

export default ClassificationTable;
