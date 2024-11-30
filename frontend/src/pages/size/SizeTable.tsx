import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
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
import {fetchSizes, setClassificationOwn, setSizeDetailId} from "../../redux/reducers/sizeSlice.ts";
import {setShoesOwn, updateSizeCount} from "../../redux/reducers/classificationSlice.ts";
import SizeItem from "./SizeItem.tsx";
import SizeAddForm from "./SizeAddForm.tsx";

const SizeTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const classificationOwn = useSelector((state: RootState) => state.sizes.classificationOwn);
    const sizes = useSelector((state: RootState) => state.sizes.sizes);
    const pagination = useSelector((state: RootState) => state.sizes.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.sizes.fetchAllStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<boolean | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [isAddSize, setIsAddSize] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (classificationOwn) {
            dispatch(fetchSizes({
                page: currentPage,
                size: pageSize,
                search: searchTerm,
                status: status,
                classificationId: classificationOwn._id
            }))
        }
    }, [classificationOwn, dispatch, currentPage, pageSize, searchTerm, status]);

    const id = useSelector((state:RootState)=> state.sizes.detailId);

    useEffect(() => {
        console.log('table: '+id)
    }, [id]);

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
        setIsAddSize(true)
    }

    const handleCancelAdd = () => {
        setIsAddSize(false)
    }

    const handleAddSuccess = () => {
        if (classificationOwn) dispatch(updateSizeCount(classificationOwn._id));
        handleCancelAdd()
    }

    const handleDetail = (id: string) => {
        dispatch(setSizeDetailId(id))
    }

    const handleSelect = (id: string) => {
        setSelectedId(id)
    };

    const handleBackToShoes = () => {
        dispatch(setShoesOwn(null))
        dispatch(setClassificationOwn(null))
    }

    const handleBackToClassification = () => {
        dispatch(setClassificationOwn(null))
    }

    return (
        <div>
            <div className={'flex justify-start items-center mb-3'}>
                    <span className={'text-lg text-black'}>
                        <button className={'underline underline-offset-2 me-1 text-blue-500'}
                                onClick={handleBackToShoes}>
                            Quản lý sản phẩm</button>
                        /
                         <button className={'underline underline-offset-2 mx-1 text-blue-500'}
                                 onClick={handleBackToClassification}>
                            Quản lý phân loại</button>
                        /  Quản lý kích cỡ
                    </span>
            </div>
            <div className={"relative"}>
                <div>
                    <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                        <h1 className="text-2xl font-bold">Danh sách kích cỡ
                            - {classificationOwn ? `${classificationOwn.name} - ${classificationOwn.color}` : ''}</h1>
                        <TextButton onClick={handleAdd} title="Thêm mới"/>
                    </div>
                    <TableOptions>
                        <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                        <div className="flex items-center">
                            <SearchBox search={searchTerm} placeholder={'Tìm kiếm theo kích cỡ...'}
                                       onSearchChange={handleSearchChange}/>
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
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Phân loại</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Kích cỡ</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Số lượng</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Trọng lượng</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Ngày tạo</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end">Trạng thái</th>
                                        <th className="py-3 px-3 border-b border-gray-300 text-end"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sizes && sizes.length > 0 ? (
                                        sizes.map((size) => (
                                            <SizeItem
                                                key={size._id}
                                                size={size}
                                                onDetail={() => handleDetail(size._id)}
                                                onSelect={() => handleSelect(size._id)}
                                                isSelected={selectedId === size._id}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="text-center italic py-2">Không có kích cỡ nào
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
                    isAddSize && classificationOwn && (<div className="absolute inset-0 bg-white z-10">
                        <div className={"w-full flex justify-between items-center mb-4"}>
                            <h1 className="text-2xl font-bold">Thêm kích cỡ</h1>
                            <TextButton onClick={handleCancelAdd} title="Hủy bỏ"/>
                        </div>
                        <SizeAddForm classificationId={classificationOwn._id} onAddSuccess={handleAddSuccess}/>
                    </div>)
                }
            </div>
        </div>
    )
}

export default SizeTable;
