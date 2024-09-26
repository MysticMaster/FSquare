import {DarkThemeToggle} from "flowbite-react";

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Thay đổi từ Switch sang Routes
import { checkAuth } from './redux/reducers/authSlice';
import { RootState } from './redux/store';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import Brand from './pages/Brand'; // Import component Brand

const App: React.FC = () => {
    const dispatch = useDispatch();
    const authority = useSelector((state: RootState) => state.auth.authority);
    const status = useSelector((state: RootState) => state.auth.status);

    useEffect(() => {
        dispatch(checkAuth());
    }, []);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/brand" element={<Brand />} /> {/* Thay đổi từ component thành element */}
                    <Route path="/" element={authority ? <Home /> : <LoginPage />} /> {/* Thay đổi từ component thành element */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;







