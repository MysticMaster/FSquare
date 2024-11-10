import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createBrand, resetCreateStatus} from "../../redux/reducers/brandSlice.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";
import ErrorNotification from "../title/ErrorNotification.tsx";

const BrandAddForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [file, setThumbnail] = useState<File | null>(null);
    const [fileKey, setFileKey] = useState(Date.now());

    const createError = useSelector((state: RootState) => state.brands.createError);
    const createStatus = useSelector((state: RootState) => state.brands.createStatus);

    useEffect(() => {
        if (createStatus === "succeeded") {
            alert('Thương hiệu đã được tạo thành công!');

            // Reset form sau khi tạo thành công
            setName('');
            setThumbnail(null);
            setFileKey(Date.now());
            dispatch(resetCreateStatus());
        }
    }, [createStatus]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Vui lòng nhập tên thương hiệu');
            return;
        }

        if (!file) {
            alert('Vui lòng chọn hình ảnh');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        dispatch(createBrand(formData));
    };

    const isLoading = createStatus === 'loading';

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-2">Thêm Thương Hiệu Mới</h2>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Tên Thương Hiệu</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
                {
                    createError && <ErrorNotification message={createError} />
                }
            </div>
            <div className="mb-2">
                <label htmlFor="file" className="block text-gray-700">Hình Ảnh Thương Hiệu</label>
                <input
                    type="file"
                    id="file"
                    key={fileKey}
                    onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded w-full"
                    accept="image/*"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 mt-1 text-white rounded p-2" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo Thương Hiệu'}
            </button>
        </form>
    );
};

export default BrandAddForm;
