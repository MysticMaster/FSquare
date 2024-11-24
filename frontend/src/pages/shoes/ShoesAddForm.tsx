import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {createShoes, resetCreateStatus} from "../../redux/reducers/shoesSlice.ts";
import {AppDispatch, RootState} from "../../redux/store.ts";
import {fetchBrands} from "../../redux/reducers/brandSlice.ts";
import {fetchCategories} from "../../redux/reducers/categorySlice.ts";
import SelectorDropdown from "./SelectorDropdown.tsx";
import stateStatus from "../../utils/stateStatus.ts";
import ErrorNotification from "../../components/title/ErrorNotification.tsx";

interface Brand {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Props {
    onAddSuccess: () => void;
}

const ShoesAddForm: React.FC<Props> = ({onAddSuccess}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [name, setName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [brand, setBrand] = useState<Brand | null>(null);
    const [category, setCategory] = useState<Category | null>(null);
    const [describe, setDescribe] = useState<string>('');
    const [description, setDescription] = useState<string | null>(null);

    const brands = useSelector((state: RootState) => state.brands.brands);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const createError = useSelector((state: RootState) => state.shoes.createError);
    const createStatus = useSelector((state: RootState) => state.shoes.createStatus);

    const [nameError, setNameError] = useState<string | null>(null);
    const [brandError, setBrandError] = useState<string | null>(null);
    const [categoryError, setCategoryError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchBrands({}));
        dispatch(fetchCategories({}));
    }, [dispatch]);

    useEffect(() => {
        if (createStatus === stateStatus.succeededState) {
            alert('Tạo sản phẩm thành công!');
            dispatch(resetCreateStatus());
            setName('');
            setFile(null);
            setBrand(null);
            setCategory(null);
            setDescribe('');
            setDescription(null);
            onAddSuccess()
        }
    }, [createStatus,onAddSuccess, dispatch]);

    useEffect(() => {
        if (nameError) {
            setNameError(null);
        }
    }, [name]);

    useEffect(() => {
        if (brandError) {
            setBrandError(null);
        }
    }, [brand]);

    useEffect(() => {
        if (categoryError) {
            setCategoryError(null);
        }
    }, [category]);

    useEffect(() => {
        if (createError && createError.code !== 409) alert(createError.error)
        if (createError && createError.code === 409) setNameError(createError.error)
    }, [createError]);

    const handleBrandSelect = (selectedBrand: Brand | null) => {
        setBrand(selectedBrand);
    };

    const handleCategorySelect = (selectedCategory: Category | null) => {
        setCategory(selectedCategory);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name.trim()) {
            setNameError('Vui lòng nhập tên sản phẩm');
            return;
        }

        if (!brand) {
            setBrandError('Vui lòng chọn thương hiệu');
            return;
        }

        if (!category) {
            setCategoryError('Vui lòng chọn danh mục sản phẩm');
            return;
        }

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('brand', brand._id);
        formData.append('category', category._id);
        formData.append('describe', describe.trim());
        if (description) {
            formData.append('description', description.trim());
        }
        if (file) {
            formData.append('file', file);
        }

        dispatch(createShoes(formData));
    };

    const isLoading = createStatus === stateStatus.loadingState;

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Tên sản phẩm</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            {nameError && (
                <ErrorNotification message={nameError}/>
            )}
            <div className="mb-2">
                <label htmlFor="file" className="block text-gray-700">Hình ảnh sản phẩm</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded w-full"
                    accept="image/*"
                />
            </div>
            <div className="mb-2 flex justify-start items-center">
                <label className="block text-gray-700 me-3">Thương hiệu sản phẩm:</label>
                <SelectorDropdown item={brand} items={brands} onItemSelect={handleBrandSelect}/>
                {brandError && (
                    <div className={'ms-1'}><ErrorNotification message={brandError}/></div>
                )}
            </div>
            <div className="mb-2 flex justify-start items-center">
                <label className="block text-gray-700 me-3">Danh mục sản phẩm:</label>
                <SelectorDropdown item={category} items={categories} onItemSelect={handleCategorySelect}/>
                {categoryError && (
                    <div className={'ms-1'}><ErrorNotification message={categoryError}/></div>
                )}
            </div>
            <div className="mb-2">
                <label htmlFor="describe" className="block text-gray-700">Mô tả sản phẩm</label>
                <input
                    type="text"
                    id="describe"
                    value={describe}
                    onChange={(e) => setDescribe(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="description" className="block text-gray-700">Miêu tả sản phẩm</label>
                <textarea
                    id="description"
                    value={description || ''}
                    rows={6}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <button type="submit" className={`mt-1 text-white rounded p-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-500'}`}
                    disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : 'Tạo sản phẩm'}
            </button>
        </form>
    );
};

export default ShoesAddForm;
