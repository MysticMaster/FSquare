import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchShoe} from "../../redux/reducers/shoesSlice.ts";
import ShoesUpdateForm from "./ShoesUpdateForm.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";

interface Props {
    id: string;
}

const ShoeDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.shoes.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.shoes.fetchError);
    const shoe = useSelector((state: RootState) => state.shoes.shoe);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchShoe({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchShoe({id}));
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
                {isUpdate && shoe && (
                    <div className="absolute inset-0 bg-white z-10">
                        <ShoesUpdateForm
                            id={id}
                            brand={shoe.brand}
                            category={shoe.category}
                            name={shoe.name}
                            describe={shoe.describe ? shoe.describe : ""}
                            description={shoe.description}
                            isActive={shoe.isActive}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    </div>
                )}
                <div className="mb-3 size-full">
                    <div className={'w-full flex mb-3 justify-center'}>
                        <img
                            src={shoe?.thumbnail ? shoe.thumbnail.url : './logo/no_pictures.png'}
                            alt={shoe?.name}
                            className="me-5 w-72 h-72 rounded object-cover bg-gray-100"
                        />
                    </div>
                    <div className="flex flex-col">
                        <DetailTitle title={'Tên sản phẩm'} content={shoe ? shoe.name : 'trống'}/>
                        <DetailTitle title={'Thương hiệu'} content={shoe ? shoe.brand.name : 'trống'}/>
                        <DetailTitle title={'Danh mục'} content={shoe ? shoe.category.name : 'trống'}/>
                        <DetailTitle title={'Mô tả'} content={shoe && shoe.describe ? shoe.describe : 'trống'}/>
                        <DetailTitle title={'Miêu tả'}
                                     content={shoe && shoe.description ? shoe.description : 'trống'}/>
                        <DetailTitle title={'Trạng thái'} content={
                            shoe ? shoe.isActive ? ('Kinh doanh') : ('Ngừng kinh doanh') : 'trống'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShoeDetail;
