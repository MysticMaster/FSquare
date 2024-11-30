import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";
import {fetchSize, resetSizeUpdateStatus} from "../../redux/reducers/sizeSlice.ts";
import SizeUpdateForm from "./SizeUpdateForm.tsx";

interface Props {
    id: string;
}

const SizeDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.sizes.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.sizes.fetchError);
    const size = useSelector((state: RootState) => state.sizes.size);
    const classificationOwn = useSelector((state: RootState) => state.sizes.classificationOwn);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchSize({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchSize({id}));
    };

    if (fetchStatus === stateStatus.loadingState) return <Loading/>;
    if (fetchStatus === stateStatus.failedState) return <div>Error: {fetchError}</div>;

    const handleClick = () => {
        setIsUpdate(!isUpdate)
        if (!isUpdate) dispatch(resetSizeUpdateStatus())
    }

    return (
        <div>
            <div className={'flex justify-end'}>
                <TextButton onClick={handleClick} title={isUpdate ? 'Hủy bỏ' : 'Cập nhật'}/>
            </div>
            <div className={'relative mt-3'}>
                {isUpdate && size && (
                    <div className="absolute inset-0 bg-white z-10">
                        <SizeUpdateForm
                            id={id}
                            sizeNumber={size.sizeNumber}
                            weight={size.weight}
                            quantity={size.quantity}
                            isActive={size.isActive}
                            onUpdateSuccess={handleUpdateSuccess}/>
                    </div>
                )}
                <div className="mb-3 size-full">
                    <div className="flex flex-col">
                        <DetailTitle title={'Kích cỡ thuộc phân loại'}
                                     content={classificationOwn ? `${classificationOwn.name} - ${classificationOwn.color}` : 'trống'}/>
                        <DetailTitle title={'Kích cỡ'} content={size ? size.sizeNumber : 'trống'}/>
                        <DetailTitle title={'Trọng lượng'} content={size ? String(size.weight) : 'trống'}/>
                        <DetailTitle title={'Số lượng'} content={size ? String(size.quantity) : 'trống'}/>
                        <DetailTitle title={'Trạng thái'} content={
                            size ? size.isActive ? ('Kinh doanh') : ('Ngừng kinh doanh') : 'trống'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SizeDetail;
