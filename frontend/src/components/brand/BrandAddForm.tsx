import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {createBrand} from "../../redux/reducers/brandSlice.ts";
import {AppDispatch} from "../../redux/store.ts";

const BrandAddForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState('');
    const [file, setThumbnail] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (name && file) {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('file', file);

            dispatch(createBrand(formData));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-200 bg-white rounded">
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
            </div>
            <div className="mb-2">
                <label htmlFor="file" className="block text-gray-700">Hình Ảnh Thương Hiệu</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setThumbnail(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded p-2 w-full"
                    accept="image/*"
                    required
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded p-2">Tạo Thương Hiệu</button>
        </form>
    );
};

export default BrandAddForm;
