import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import ErrorNotification from "../../components/title/ErrorNotification.tsx";
import {resetSizeUpdateStatus, updateSize} from "../../redux/reducers/sizeSlice.ts";

interface Props {
    id: string;
    sizeNumber: string;
    weight: number;
    quantity: number;
    isActive: boolean;
    onUpdateSuccess: () => void;
}

const SizeUpdateForm: React.FC<Props> = ({
                                             id,
                                             sizeNumber,
                                             weight,
                                             quantity,
                                             isActive,
                                             onUpdateSuccess,

                                         }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [updateSizeNumber, setUpdateSizeNumber] = useState<string>(sizeNumber);
    const [updateWeight, setUpdateWeight] = useState<number>(weight);
    const [updateQuantity, setUpdateQuantity] = useState<number>(quantity);
    const [status, setStatus] = useState<boolean | null>(isActive);

    const updateError = useSelector((state: RootState) => state.sizes.updateError);
    const updateStatus = useSelector((state: RootState) => state.sizes.updateStatus);

    const [sizeNumberError, setSizeNumberError] = useState<string | null>(null);
    const [weightError, setWeightError] = useState<string | null>(null);
    const [quantityError, setQuantityError] = useState<string | null>(null);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(() => {
        if (updateStatus === stateStatus.succeededState) {
            alert(" Kích cỡ đã được cập nhật!");
            dispatch(resetSizeUpdateStatus());
            onUpdateSuccess();
        }
    }, [updateStatus, onUpdateSuccess, dispatch]);


    useEffect(() => {
        const hasChanges =
            updateSizeNumber !== sizeNumber ||
            status !== isActive ||
            updateWeight !== weight ||
            updateQuantity !== quantity;

        setIsDisabled(!hasChanges);

    }, [updateSizeNumber, status, updateWeight, updateQuantity, isActive, sizeNumber, weight, quantity]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (weight <= 0) {
            setWeightError('Trọng lượng phải lớn hơn 0');
            return;
        }

        if (quantity < 0) {
            setQuantityError('Số lượng không thể âm');
            return;
        }

        const sizeData = {
            sizeNumber : updateSizeNumber !== sizeNumber ? updateSizeNumber : null,
            quantity : updateQuantity !== quantity ? updateQuantity : null,
            weight : updateWeight !== weight ? updateWeight : null,
            isActive : status !== isActive ? status : null,
        }

        dispatch(updateSize({id, sizeData: sizeData}));
    };

    useEffect(() => {
        if (updateError && updateError.code !== 409) alert(updateError.error)
        if (updateError && updateError.code === 409) setSizeNumberError(updateError.error)
    }, [updateError]);

    const isLoading = updateStatus === stateStatus.loadingState;

    return (
        <div className="mb-4 p-4 border border-gray-300 rounded">
            <form onSubmit={handleSubmit} className={'mb-5'}>
                <h2 className="text-xl font-bold mb-2">Cập Nhật Kích Cỡ</h2>

                <div className="mb-2">
                    <label className="block text-gray-700">Kích cỡ</label>
                    <input
                        type="text"
                        value={updateSizeNumber}
                        onChange={(e) => setUpdateSizeNumber(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    {
                        sizeNumberError && <ErrorNotification message={sizeNumberError}/>
                    }
                </div>

                <div className="mb-2">
                    <label htmlFor="describe" className="block text-gray-700">Trọng lượng</label>
                    <input
                        type="text"
                        value={updateWeight}
                        onChange={(e) => {
                            const input = e.target.value.trim();
                            if (input === '' || /^[0-9]+$/.test(input)) {
                                setUpdateWeight(Number(input));
                                setWeightError(null);
                            } else {
                                setWeightError('Trọng lượng phải là số');
                            }
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    {weightError && (
                        <ErrorNotification message={weightError}/>
                    )}
                </div>

                <div className="mb-2">
                    <label htmlFor="description" className="block text-gray-700">Số lượng</label>
                    <input
                        type="text"
                        value={updateQuantity}
                        onChange={(e) => {
                            const input = e.target.value.trim();
                            if (input === '' || /^[0-9]+$/.test(input)) {
                                setUpdateQuantity(Number(input));
                                setQuantityError(null);
                            } else {
                                setQuantityError('Số lượng phải là số');
                            }
                        }}
                        className="border border-gray-300 rounded p-2 w-full"
                        required
                    />
                    {quantityError && (
                        <ErrorNotification message={quantityError}/>
                    )}
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

export default SizeUpdateForm;

