import React,{ useEffect }  from 'react';
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../redux/reducers/brandSlice';
import { RootState } from '../redux/store';

const Brand: React.FC = () => {
    const dispatch = useDispatch();
    const brands = useSelector((state: RootState) => state.brands.brands);
    const status = useSelector((state: RootState) => state.brands.status);
    const error = useSelector((state: RootState) => state.brands.error);

    useEffect(() => {
        dispatch(fetchBrands());
    }, []);

    return (
        <div>
            <h1>Brand Management</h1>
            {status === 'loading' && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <ul>
                {brands && brands.length > 0 ? (
                    brands.map((brand) => {
                        return (
                            <li key={brand._id}>
                                <img
                                    src={brand.thumbnail.url}
                                    alt={brand.name}
                                    style={{width: '100px', height: '100px'}}
                                />
                                <div>Name: {brand.name}</div>
                                <div>Created At: {brand.createdAt}</div>
                                <div>Status: {brand.isActive ? 'Active' : 'Inactive'}</div>
                            </li>
                        );
                    })
                ) : (
                    <p>No brands available.</p>
                )}
            </ul>
            <Link to="/">
                <button>Go to home Page</button>
            </Link>
        </div>
    );
};

export default Brand;
