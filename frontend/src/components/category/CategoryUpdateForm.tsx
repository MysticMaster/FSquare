import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateCategory, resetUpdateStatus} from "../../redux/reducers/categorySlice.ts";
import {AppDispatch, RootState} from "../../redux/store.ts";
import ErrorNotification from "../title/ErrorNotification.tsx";

interface Props {
    id: string;
    name: string; // Nhận giá trị name từ props
    isActive: boolean; // Nhận giá trị isActive từ props
    onUpdateSuccess: () => void;
}

const CategoryUpdateForm: React.FC<Props> = ({id, name, isActive, onUpdateSuccess}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [categoryName, setCategoryName] = useState(name); // Khởi tạo với giá trị name
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<boolean | null>(isActive); // Khởi tạo trạng thái dựa trên isActive

    const updateError = useSelector((state: RootState) => state.categories.updateError);
    const updateStatus = useSelector((state: RootState) => state.categories.updateStatus);

    // Biến để theo dõi xem form có thay đổi không
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        // Reset form sau khi cập nhật thành công
        if (updateStatus === "succeeded") {
            alert('Danh mục đã được cập nhật!');
            setCategoryName(name);
            setFile(null);
            setStatus(isActive);
            dispatch(resetUpdateStatus());
            onUpdateSuccess();
        }
    }, [updateStatus, name, isActive, onUpdateSuccess, dispatch]);

    useEffect(() => {
        // Kiểm tra xem có bất kỳ giá trị nào đã thay đổi để bật/tắt nút submit
        setIsChanged(
            categoryName !== name ||
            file !== null || // Giả sử có file mới có nghĩa là đã thay đổi
            status !== isActive
        );
    }, [categoryName, file, status, name, isActive]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            alert('Vui lòng nhập tên danh mục');
            return;
        }

        const formData = new FormData();
        formData.append('name', categoryName);
        if (file) formData.append('file', file);
        if (status !== null) formData.append('isActive', status.toString());

        dispatch(updateCategory({id: id, categoryData: formData}));
    };

    const isLoading = updateStatus === 'loading';

    return (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-2">Cập Nhật Danh Mục</h2>
            <div className="mb-2">
                <label htmlFor="name" className="block text-gray-700">Tên danh mục</label>
                <input
                    type="text"
                    id="name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full"
                    required
                />
                {
                    updateError && <ErrorNotification message={updateError}/>
                }
            </div>
            <div className="mb-2">
                <label htmlFor="file" className="block text-gray-700">Hình ảnh danh mục</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="border border-gray-300 rounded w-full"
                    accept="image/*"
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
                    {isLoading ? 'Đang xử lý...' : 'Cập Nhật Danh Mục'}
                </button>
            )}
        </form>
    );
};

export default CategoryUpdateForm;
