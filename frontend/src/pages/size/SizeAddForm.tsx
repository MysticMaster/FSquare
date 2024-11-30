import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "../../redux/store.ts";
import stateStatus from "../../utils/stateStatus.ts";
import ErrorNotification from "../../components/title/ErrorNotification.tsx";
import {createSize, resetCreateStatus} from "../../redux/reducers/sizeSlice.ts";

interface Props {
    classificationId: string;
    onAddSuccess: () => void;
}

const ClassificationAddForm: React.FC<Props> = ({classificationId, onAddSuccess}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [sizeNumber, setSizeNumber] = useState<string>('');
    const [weight, setWeight] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(0);

    const createError = useSelector((state: RootState) => state.sizes.createError);
    const createStatus = useSelector((state: RootState) => state.sizes.createStatus);

    const [sizeNumberError, setSizeNumberError] = useState<string | null>(null);
    const [weightError, setWeightError] = useState<string | null>(null);
    const [quantityError, setQuantityError] = useState<string | null>(null);

    useEffect(() => {
        if (createStatus === stateStatus.succeededState) {
            alert('Tạo kích cỡ thành công!');
            dispatch(resetCreateStatus());
            setSizeNumber('');
            setWeight(0);
            setQuantity(0);
            onAddSuccess()
        }
    }, [createStatus, onAddSuccess, dispatch]);

    useEffect(() => {
        if (sizeNumberError) {
            setSizeNumberError(null);
        }
    }, [sizeNumber]);

    useEffect(() => {
        if (weightError) {
            setWeightError(null);
        }
    }, [weight]);

    useEffect(() => {
        if (quantityError) {
            setQuantityError(null);
        }
    }, [quantity]);

    useEffect(() => {
        if (createError && createError.code !== 409) alert(createError.error)
        if (createError && createError.code === 409) setSizeNumberError(createError.error)
    }, [createError]);

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
            classification: classificationId,
            sizeNumber: sizeNumber.trim(),
            quantity: quantity,
            weight: weight,
        };

        dispatch(createSize(sizeData));
    };

    const isLoading = createStatus === stateStatus.loadingState;

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Kích cỡ</label>
                <input
                    type="text"
                    value={sizeNumber}
                    onChange={(e) => setSizeNumber(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            {sizeNumberError && (
                <ErrorNotification message={sizeNumberError}/>
            )}
            <div className="mb-2">
                <label htmlFor="describe" className="block text-gray-700">Trọng lượng</label>
                <input
                    type="text"
                    value={weight}
                    onChange={(e) => {
                        const input = e.target.value.trim();
                        if (input === '' || /^[0-9]+$/.test(input)) {
                            setWeight(Number(input));
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
                    value={quantity}
                    onChange={(e) => {
                        const input = e.target.value.trim();
                        if (input === '' || /^[0-9]+$/.test(input)) {
                            setQuantity(Number(input));
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
            <button type="submit" className={`mt-1 text-white rounded p-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                    disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo kích cỡ'}
            </button>
        </form>
    );
};

export default ClassificationAddForm
