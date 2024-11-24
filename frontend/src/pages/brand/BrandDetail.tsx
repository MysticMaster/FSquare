import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchBrand} from "../../redux/reducers/brandSlice.ts";
import BrandUpdateForm from "./BrandUpdateForm.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";

interface Props {
    id: string;
}

const CategoryDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.brands.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.brands.fetchError);
    const brand = useSelector((state: RootState) => state.brands.brand);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchBrand({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchBrand({id}));
    };

    if (fetchStatus === stateStatus.loadingState) return <Loading/>;
    if (fetchStatus === stateStatus.failedState) return <div>Error: {fetchError}</div>;

    const handleClick = () => {
        setIsUpdate(!isUpdate)
    }

    return (
        <div>
            <div className={'flex justify-end'}>
                <TextButton onClick={handleClick} title={isUpdate ? 'Hủy bỏ' : 'Cập nhật'}/>
            </div>
            <div className={'relative mt-3'}>
                {isUpdate && brand && (
                    <div className="absolute inset-0 bg-white z-10">
                        <BrandUpdateForm
                            id={id}
                            name={brand.name}
                            isActive={brand.isActive}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    </div>
                )}

                <div className="mb-3 size-full">
                    <div className={'w-full flex mb-3 justify-center'}>
                        <img
                            src={brand?.thumbnail ? brand.thumbnail.url : './logo/no_pictures.png'}
                            alt={brand?.name}
                            className="me-5 w-72 h-72 rounded object-cover bg-gray-100"
                        />
                    </div>
                    <div className="flex flex-col">
                        <DetailTitle title={'Tên danh mục'} content={brand ? brand.name : 'trống'}/>
                        <DetailTitle title={'Trạng thái'} content={
                            brand ? brand.isActive ? ('Kinh doanh') : ('Ngừng kinh doanh') : 'trống'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;
