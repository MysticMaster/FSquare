import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import TableOptions from "../../components/container/TableOptions.tsx";
import PageSizeSelector from "../../components/pagination/PageSizeSelector.tsx";
import SearchBox from "../../components/filter/SearchBox.tsx";
import Filter from "../../components/button/Filter.tsx";
import FilterContainer from "../../components/container/FilterContainer.tsx";
import Loading from "../../components/Loading.tsx";
import Pagination from "../../components/pagination/Pagination.tsx";
import {fetchOrders, setOrderDetailId} from "../../redux/reducers/orderSlice.ts";
import OrderStatusFilterSelector from "./OrderStatusFilterSelector.tsx";
import OrderItem from "./OrderItem.tsx";

const OrderTable: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector((state: RootState) => state.orders.orders);
    const pagination = useSelector((state: RootState) => state.orders.pagination);
    const fetchAllStatus = useSelector((state: RootState) => state.orders.fetchAllStatus);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<string | null>(null);

    const [isFilter, setIsFilters] = useState(false);

    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchOrders({page: currentPage, size: pageSize, search: searchTerm, status: status}));
    }, [currentPage, pageSize, searchTerm, status, dispatch]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (search: string) => {
        const sanitizedSearch = search.trim().replace(/\s+/g, ' ');
        setSearchTerm(sanitizedSearch);
        setCurrentPage(1);
    }

    const handleVisibleFilter = () => {
        setIsFilters(!isFilter)
        if (isFilter) {
            setStatus(null)
        }
    }

    const handleOrderStatusSelect = (selectedStatus: string | null) => {
        setStatus(selectedStatus);
        setCurrentPage(1);
    };

    const handleDetail = (id: string) => {
        dispatch(setOrderDetailId(id))
    }

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    return (
        <div className={"relative"}>
            <div>
                <div className="flex justify-between items-center mb-2 overflow-y-hidden">
                    <h1 className="text-2xl font-bold">Danh sách đơn hàng</h1>
                </div>
                <TableOptions>
                    <PageSizeSelector pageSize={pageSize} onChange={handlePageSizeChange}/>
                    <div className="flex items-center">
                        <SearchBox search={searchTerm} placeholder={'Tìm kiếm mã đơn...'}
                                   onSearchChange={handleSearchChange}/>
                        <Filter onClick={handleVisibleFilter}/>
                    </div>
                </TableOptions>

                <FilterContainer isVisible={isFilter}>
                    <OrderStatusFilterSelector onItemSelect={handleOrderStatusSelect}/>
                </FilterContainer>

                {
                    fetchAllStatus === stateStatus.loadingState ? (
                        <Loading/>
                    ) : (
                        <div>
                            <table className="min-w-full border border-gray-300 rounded-lg">
                                <thead>
                                <tr>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Mã đơn</th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Người dùng
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Địa chỉ nhận
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Mặt hàng</th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Giá trị</th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Trọng lượng
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Phí vận
                                        chuyển
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Trạng thái
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">
                                        Thanh toán
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start">Thời gian
                                        đặt
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 text-sm text-start"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders && orders.length > 0 ? (
                                    orders.map((order) => (
                                        <OrderItem
                                            key={order._id}
                                            order={order}
                                            onClick={() => handleDetail(order._id)}
                                            onSelect={() => handleSelect(order._id)}
                                            isSelected={selectedId === order._id}/>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="text-center italic py-2">Không có đơn hàng nào
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
        </div>
    )
}

export default OrderTable
