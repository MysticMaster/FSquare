import React, {useEffect, useState} from "react";
import Loading from "../Loading";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchShoe} from "../../redux/reducers/shoesSlice.ts";

interface Props {
    id: string;
}

const ShoeDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.shoes.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.shoes.fetchError); // Lấy thông tin lỗi
    const shoe = useSelector((state: RootState) => state.shoes.shoe);

    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchShoe({id}));
    }, [dispatch, id]); // Thêm dependency để tránh cảnh báo và gọi lại khi id thay đổi

    const handleUpdateSuccess = () => {
        dispatch(fetchShoe({id}));
    };

    const handleUpdate = () => {
        setIsUpdate(!isUpdate);
    }

    // Kiểm tra trạng thái fetch
    if (fetchStatus === 'loading') return (
        <div className="w-96 h-96 flex items-center justify-center">
            <Loading/>
        </div>
    ); // Hiển thị Loading khi đang fetch
    if (fetchStatus === 'failed') return <div>Error: {fetchError}</div>; // Hiển thị thông báo lỗi nếu có

    // Nếu fetch thành công, hiển thị chi tiết danh mục
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">Chi tiết sản phẩm</h1>
            <div className="flex justify-start w-full">
                <div className="w-full h-full flex justify-start items-start mb-2">
                    <img
                        src={shoe?.thumbnail ? shoe.thumbnail.url : './logo/no_pictures.png'}
                        alt={shoe?.name}
                        className="w-[420px] h-[420px] me-10 object-cover rounded"
                    />
                    <div className="flex flex-col justify-between h-[420px]">
                        <div>
                            <h2 className="text-xl">Tên sản phẩm: <span className="font-bold">{shoe?.name}</span></h2>
                            <h2 className="text-xl">Thương hiệu: {shoe?.brand}</h2>
                            <h2 className="text-xl">Danh mục: {shoe?.category}</h2>
                            <h2 className="text-xl">Mô tả:</h2>
                            <p className="ms-3">{shoe?.describe || 'Trống'}</p>
                            <h2 className="text-xl">Miêu tả:</h2>
                            <p className="ms-3">{shoe?.description || 'Trống'}</p>
                            <h2 className="text-xl">Trạng thái: {shoe?.isActive ? (
                                <span className="text-green-500">Kinh doanh</span>
                            ) : (
                                <span className="text-red-500">Ngừng kinh doanh</span>
                            )}</h2>
                        </div>
                        <div className="flex w-full justify-start items-center">
                            <button className="text-2xl font-bold" onClick={handleUpdate}>
                                {isUpdate ? 'Đóng' : 'Cập nhật'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isUpdate && <div className="w-full h-96 bg-orange-500">
                ccc
            </div>}
        </div>
    );
}

export default ShoeDetail;
