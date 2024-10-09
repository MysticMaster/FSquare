import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {createCategory, resetCreateStatus} from "../../redux/reducers/categorySlice.ts";
import { AppDispatch, RootState } from "../../redux/store.ts";
import ErrorNotification from "../title/ErrorNotification.tsx";

const CategoryAddForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [file, setThumbnail] = useState<File | null>(null);

    const createError = useSelector((state: RootState) => state.categories.createError);
    const createStatus = useSelector((state: RootState) => state.categories.createStatus);

    useEffect(() => {
        if (createStatus === "succeeded") {
            alert('Danh mục đã được tạo thành công!');

            // Reset form sau khi tạo thành công
            setName('');
            setThumbnail(null);
            dispatch(resetCreateStatus());
        }
    }, [createStatus]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        if (!file) {
            alert('Vui lòng chọn hình ảnh');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        dispatch(createCategory(formData));
    };

    const isLoading = createStatus === 'loading';

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-2">Thêm Danh Mục Mới</h2>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Tên Danh Mục</label>
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
                <label htmlFor="file" className="block text-gray-700">Hình Ảnh Danh Mục</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded w-full"
                    accept="image/*"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 mt-1 text-white rounded p-2" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo Danh Mục'}
            </button>
        </form>
    );
};

export default CategoryAddForm;
