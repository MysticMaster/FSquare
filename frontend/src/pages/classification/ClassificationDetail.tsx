import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";

import ClassificationUpdateForm from "./ClassificationUpdateForm.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";
import {fetchClassification, resetClassificationUpdateStatus} from "../../redux/reducers/classificationSlice.ts";

interface Props {
    id: string;
}

const ClassificationDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.classifications.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.classifications.fetchError);
    const classification = useSelector((state: RootState) => state.classifications.classification);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchClassification({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchClassification({id}));
    };

    if (fetchStatus === stateStatus.loadingState) return <Loading/>;
    if (fetchStatus === stateStatus.failedState) return <div>Error: {fetchError}</div>;

    const handleClick = () => {
        setIsUpdate(!isUpdate)
        if (!isUpdate) dispatch(resetClassificationUpdateStatus())
    }

    return (
        <div>
            <div className={'flex justify-end'}>
                <TextButton onClick={handleClick} title={isUpdate ? 'Hủy bỏ' : 'Cập nhật'}/>
            </div>
            <div className={'relative mt-3'}>
                {isUpdate && classification && (
                    <div className="absolute inset-0 bg-white z-10">
                        <ClassificationUpdateForm
                            id={id}
                            isActive={classification.isActive}
                            onUpdateSuccess={handleUpdateSuccess}
                            color={classification.color}
                            country={classification.country}
                            price={classification.price}/>
                    </div>
                )}
                <div className="mb-3 size-full">
                    <div className={'w-full flex mb-3 justify-center'}>
                        <div className="w-full flex mb-5 justify-center">
                            <img
                                src={classification?.thumbnail ? classification.thumbnail.url : "./logo/no_pictures.png"}
                                alt={classification?.color}
                                className="w-72 h-72 rounded object-cover bg-gray-100"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <DetailTitle title={'Phân lọại thuộc sản phẩm'}
                                     content={classification ? classification.shoes.name : 'trống'}/>
                        <DetailTitle title={'Màu sắc'} content={classification ? classification.color : 'trống'}/>
                        <DetailTitle title={'Xuất xứ'} content={classification ? classification.country : 'trống'}/>
                        <DetailTitle title={'Giá'} content={classification ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                        }).format(classification.price) : 'trống'}/>
                        <DetailTitle title={'Trạng thái'} content={
                            classification ? classification.isActive ? ('Kinh doanh') : ('Ngừng kinh doanh') : 'trống'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClassificationDetail;
