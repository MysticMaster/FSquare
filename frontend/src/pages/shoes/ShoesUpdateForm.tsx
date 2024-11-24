import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateShoes, resetUpdateStatus} from "../../redux/reducers/shoesSlice.ts";
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
    id: string;
    brand: Brand;
    category: Category;
    name: string;
    describe: string;
    description: string | null;
    isActive: boolean;
    onUpdateSuccess: () => void;
}

const ShoesUpdateForm: React.FC<Props> = ({
                                              id,
                                              brand,
                                              category,
                                              name,
                                              describe,
                                              description,
                                              isActive,
                                              onUpdateSuccess
                                          }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [updateName, setUpdateName] = useState(name); // Khởi tạo với giá trị name
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<boolean | null>(isActive);
    const [updateBrand, setUpdateBrand] = useState<Brand | null>(brand);
    const [updateCategory, setUpdateCategory] = useState<Category | null>(category);
    const [updateDescribe, setUpdateDescribe] = useState<string>(describe);
    const [updateDescription, setUpdateDescription] = useState<string | null>(description);

    const brands = useSelector((state: RootState) => state.brands.brands);
    const categories = useSelector((state: RootState) => state.categories.categories);

    const updateError = useSelector((state: RootState) => state.shoes.updateError);
    const updateStatus = useSelector((state: RootState) => state.shoes.updateStatus);

    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        dispatch(fetchBrands({}));
        dispatch(fetchCategories({}));
    }, [dispatch]);

    useEffect(() => {
        if (updateStatus === stateStatus.succeededState) {
            alert('Sản phẩm đã được cập nhật!');
            dispatch(resetUpdateStatus());
            onUpdateSuccess();
        }
    }, [updateStatus, onUpdateSuccess, dispatch]);

    useEffect(() => {
        const hasChanges =
            updateName !== name ||
            file !== null ||
            status !== isActive ||
            updateBrand?._id !== brand?._id ||
            updateCategory?._id !== category?._id ||
            updateDescribe !== describe ||
            updateDescription !== description;

        setIsChanged(hasChanges);
    }, [
        updateName,
        file,
        status,
        updateBrand,
        updateCategory,
        updateDescribe,
        updateDescription,
        name,
        isActive,
        brand,
        category,
        describe,
        description,
    ]);

    const handleBrandSelect = (selectedBrand: Brand | null) => {
        setUpdateBrand(selectedBrand);
    };

    const handleCategorySelect = (selectedCategory: Category | null) => {
        setUpdateCategory(selectedCategory);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!updateName.trim()) {
            alert('Vui lòng nhập tên sản phẩm')
            return;
        }

        if (!updateBrand) {
            alert('Vui lòng chọn thương hiệu');
            return;
        }

        if (!updateCategory) {
            alert('Vui lòng chọn danh mục sản phẩm');
            return;
        }

        const formData = new FormData();
        formData.append('name', updateName);
        formData.append('brand', updateBrand._id);
        formData.append('category', updateCategory._id);
        formData.append('describe', updateDescribe);
        if (updateDescription) {
            formData.append('description', updateDescription);
        }
        formData.append('isActive', String(status));
        if (file) {
            formData.append('file', file);
        }

        dispatch(updateShoes({id: id, shoesData: formData}))
    }
    const isLoading = updateStatus === stateStatus.loadingState;
    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-2">Cập Nhật Sản Phẩm</h2>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Tên sản phẩm</label>
                <input
                    type="text"
                    id="name"
                    value={updateName}
                    onChange={(e) => {
                        setUpdateName(e.target.value)
                        dispatch(resetUpdateStatus());
                    }}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
                {
                    updateError && <ErrorNotification message={updateError.error}/>
                }
            </div>
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
            <div className="mb-3 flex justify-start items-center">
                <label className="block text-gray-700 me-3">Danh mục sản phẩm:</label>
                <SelectorDropdown item={updateBrand} items={brands} onItemSelect={handleBrandSelect}/>
            </div>
            <div className="mb-3 flex justify-start items-center">
                <label className="block text-gray-700 me-3">Thương hiệu sản phẩm:</label>
                <SelectorDropdown item={updateCategory} items={categories} onItemSelect={handleCategorySelect}/>
            </div>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Mô tả sản phẩm</label>
                <input
                    type="text"
                    id="describe"
                    value={updateDescribe}
                    onChange={(e) => setUpdateDescribe(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
            </div>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Miêu tả sản phẩm</label>
                <textarea
                    id="description"
                    value={updateDescription ? updateDescription : ''}
                    rows={6}
                    onChange={(e) => setUpdateDescription(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 mb-2">Trạng Thái:</label>
                <label className="inline-flex items-center mr-4">
                    <input
                        type="radio"
                        className="form-radio"
                        value="true"
                        checked={status === true}
                        onChange={() => setStatus(true)}
                    />
                    <span className="ml-2">Kinh Doanh</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        className="form-radio"
                        value="false"
                        checked={status === false}
                        onChange={() => setStatus(false)}
                    />
                    <span className="ml-2">Ngừng Kinh Doanh</span>
                </label>
            </div>
            {isChanged && (
                <button type="submit" className="bg-blue-500 mt-1 text-white rounded p-2" disabled={isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Cập Nhật'}
                </button>
            )}
        </form>
    )
}

export default ShoesUpdateForm;
