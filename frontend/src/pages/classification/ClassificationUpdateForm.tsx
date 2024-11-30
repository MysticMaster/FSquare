import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    updateClassification,
    resetClassificationUpdateStatus
} from "../../redux/reducers/classificationSlice.ts";
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import ErrorNotification from "../../components/title/ErrorNotification.tsx";

interface Props {
    id: string;
    color: string;
    country: string;
    price: number;
    isActive: boolean;
    onUpdateSuccess: () => void;
}

const ClassificationUpdateForm: React.FC<Props> = ({
                                                       id,
                                                       color,
                                                       country,
                                                       price,
                                                       isActive,
                                                       onUpdateSuccess,

                                                   }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [updateColor, setUpdateColor] = useState(color);
    const [file, setFile] = useState<File | null>(null); // Thumbnail file
    const [updateCountry, setUpdateCountry] = useState(country);
    const [updatePrice, setUpdatePrice] = useState(price);
    const [status, setStatus] = useState<boolean | null>(isActive);

    const updateError = useSelector((state: RootState) => state.classifications.updateError);
    const updateStatus = useSelector((state: RootState) => state.classifications.updateStatus);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (updateStatus === stateStatus.succeededState) {
            alert("Phân loại đã được cập nhật!");
            dispatch(resetClassificationUpdateStatus());
            onUpdateSuccess();
        }
    }, [updateStatus, onUpdateSuccess, dispatch]);

    useEffect(() => {
        const hasChanges =
            updateColor !== color ||
            file !== null ||
            status !== isActive ||
            updateCountry !== country ||
            updatePrice !== price;

        setIsDisabled(!hasChanges);
    }, [updateColor, file, status, updateCountry, updatePrice, isActive, color, country, price]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        if (updateColor !== color) formData.append("color", updateColor);
        if (updateCountry !== country) formData.append("country", updateCountry);
        if (updatePrice !== price) formData.append("price", String(updatePrice));
        if (status !== isActive) formData.append("isActive", String(status));
        if (file) formData.append("file", file);

        dispatch(updateClassification({id, classificationData: formData}));
    };

    const isLoading = updateStatus === stateStatus.loadingState;

    return (
        <div className="mb-4 p-4 border border-gray-300 rounded">
            <form onSubmit={handleSubmit} className={'mb-5'}>
                <h2 className="text-xl font-bold mb-2">Cập Nhật Phân Loại</h2>

                <div className="mb-2">
                    <label className="block text-gray-700">Màu sắc</label>
                    <input
                        type="text"
                        value={updateColor}
                        onChange={(e) => setUpdateColor(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    {
                        updateError && <ErrorNotification message={updateError.error}/>
                    }
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700">Hình ảnh phân loại</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="border border-gray-300 rounded w-full"
                        accept="image/*"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700">Xuất xứ</label>
                    <input
                        type="text"
                        value={updateCountry}
                        onChange={(e) => setUpdateCountry(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700">Giá</label>
                    <input
                        type="number"
                        value={updatePrice}
                        onChange={(e) => setUpdatePrice(parseFloat(e.target.value))}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Trạng thái:</label>
                    <label className="inline-flex items-center mr-4">
                        <input
                            type="radio"
                            className="form-radio"
                            value="true"
                            checked={status === true}
                            onChange={() => setStatus(true)}
                        />
                        <span className="ml-2">Kinh doanh</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            value="false"
                            checked={status === false}
                            onChange={() => setStatus(false)}
                        />
                        <span className="ml-2">Ngừng kinh doanh</span>
                    </label>
                </div>

                <div className={'w-full flex justify-end'}>
                    <button type="submit"
                            className={`bg-blue-500 mt-1 w-1/4 text-white rounded p-2 ${isDisabled ? 'bg-gray-300' : ''}`}
                            disabled={isDisabled}>
                        {isLoading ? 'Đang xử lý...' : 'Cập Nhật'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClassificationUpdateForm;

