import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchCategory} from "../../redux/reducers/categorySlice.ts";
import CategoryUpdateForm from "./CategoryUpdateForm.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import Loading from "../../components/Loading.tsx";
import TextButton from "../../components/button/TextButton.tsx";
import DetailTitle from "../../components/title/DetailTitle.tsx";

interface Props {
    id: string;
}

const CategoryDetail: React.FC<Props> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();
    const fetchStatus = useSelector((state: RootState) => state.categories.fetchStatus);
    const fetchError = useSelector((state: RootState) => state.categories.fetchError); // Lấy thông tin lỗi
    const category = useSelector((state: RootState) => state.categories.category);

    const [isUpdate, setIsUpdate] = useState<boolean>(false)

    useEffect(() => {
        dispatch(fetchCategory({id}));
    }, [dispatch, id]);

    const handleUpdateSuccess = () => {
        dispatch(fetchCategory({id}));
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
                {isUpdate && category && (
                    <div className="absolute inset-0 bg-white z-10">
                        <CategoryUpdateForm
                            id={id}
                            name={category.name}
                            isActive={category.isActive}
                            onUpdateSuccess={handleUpdateSuccess}
                        />
                    </div>
                )}

                <div className="mb-3 size-full">
                    <div className={'w-full flex mb-3 justify-center'}>
                        <img
                            src={category?.thumbnail ? category.thumbnail.url : './logo/no_pictures.png'}
                            alt={category?.name}
                            className="me-5 w-72 h-72 rounded object-cover bg-gray-100"
                        />
                    </div>
                    <div className="flex flex-col">
                        <DetailTitle title={'Tên danh mục'} content={category ? category.name : 'trống'}/>
                        <DetailTitle title={'Trạng thái'} content={
                            category ? category.isActive ? ('Kinh doanh') : ('Ngừng kinh doanh') : 'trống'}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryDetail;
