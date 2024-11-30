import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import ErrorNotification from "../../components/title/ErrorNotification.tsx";
import {createClassification, resetCreateStatus} from "../../redux/reducers/classificationSlice.ts";

interface Props {
    shoesId: string;
    onAddSuccess: () => void;
}

const ClassificationAddForm: React.FC<Props> = ({shoesId, onAddSuccess}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [color, setColor] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [country, setCountry] = useState<string>('');
    const [price, setPrice] = useState<number>(0);

    const createError = useSelector((state: RootState) => state.classifications.createError);
    const createStatus = useSelector((state: RootState) => state.classifications.createStatus);

    const [colorError, setColorError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);

    useEffect(() => {
        if (createStatus === stateStatus.succeededState) {
            alert('Tạo phân loại thành công!');
            dispatch(resetCreateStatus());
            setColor('');
            setFile(null);
            setCountry('');
            setPrice(0);
            onAddSuccess()
        }
    }, [createStatus, onAddSuccess, dispatch]);

    useEffect(() => {
        if (colorError) {
            setColorError(null);
        }
    }, [color]);

    useEffect(() => {
        if (priceError) {
            setPriceError(null);
        }
    }, [price]);

    useEffect(() => {
        if (createError && createError.code !== 409) alert(createError.error)
        if (createError && createError.code === 409) setColorError(createError.error)
    }, [createError]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (price <= 0) {
            setPriceError('Giá phải lớn hơn 0');
            return;
        }

        const formData = new FormData();
        formData.append('shoes', shoesId);
        formData.append('color', color.trim());
        formData.append('country', country);
        formData.append('price', String(price));
        if (file) {
            formData.append('file', file);
        }

        dispatch(createClassification(formData));
    };

    const isLoading = createStatus === stateStatus.loadingState;

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Màu sắc</label>
                <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            {colorError && (
                <ErrorNotification message={colorError}/>
            )}
            <div className="mb-2">
                <label htmlFor="file" className="block text-gray-700">Hình ảnh phân loại</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded w-full"
                    accept="image/*"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="describe" className="block text-gray-700">Xuất xứ</label>
                <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="description" className="block text-gray-700">Giá</label>
                <input
                    type="text"
                    value={price}
                    onChange={(e) => {
                        const input = e.target.value.trim();
                        if (input === '' || /^[0-9]+$/.test(input)) {
                            setPrice(Number(input));
                            setPriceError(null);
                        } else {
                            setPriceError('Giá phải là số');
                        }
                    }}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
                {priceError && (
                    <ErrorNotification message={priceError}/>
                )}
            </div>
            <button type="submit" className={`mt-1 text-white rounded p-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                    disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo phân loại'}
            </button>
        </form>
    );
};

export default ClassificationAddForm
