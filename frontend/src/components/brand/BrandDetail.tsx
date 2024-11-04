import React, {useEffect} from "react";
import Loading from "../Loading";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchBrand} from "../../redux/reducers/brandSlice.ts";
import BrandUpdateForm from "./BrandUpdateForm.tsx";

interface Props {
    id: string;
}

const CategoryDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.brands.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.brands.fetchError); // Lấy thông tin lỗi
    const brand = useSelector((state: RootState) => state.brands.brand);

    useEffect(() => {
        dispatch(fetchBrand({id}));
    }, [dispatch, id]); // Thêm dependency để tránh cảnh báo và gọi lại khi id thay đổi

    const handleUpdateSuccess = () => {
        dispatch(fetchBrand({id}));
    };

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
            <h1 className="text-2xl font-bold mb-2">Chi tiết thương hiệu</h1>
            <div className="flex justify-start w-full">
                <div className="w-auto h-full me-10">
                    <img
                        src={brand?.thumbnail ? brand.thumbnail.url : './logo/no_pictures.png'}
                        alt={brand?.name}
                        className="w-96 h-96 mb-2 object-cover rounded"
                    />
                    <h2 className="text-xl">Tên danh mục: <span className="font-bold">{brand?.name}</span></h2>
                    <h2 className="text-xl">Trạng thái: {brand?.isActive ? (
                        <span className="text-green-500">Kinh doanh</span>
                    ) : (
                        <span className="text-red-500">Ngừng kinh doanh</span>
                    )}</h2>
                </div>
                <div>
                    {brand ? (
                        <BrandUpdateForm
                            id={id}
                            name={brand.name}
                            isActive={brand.isActive}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    ) : (
                        <Loading/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;
