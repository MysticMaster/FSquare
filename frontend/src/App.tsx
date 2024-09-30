import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { checkAuth } from './redux/reducers/authSlice';
import {AppDispatch, RootState} from './redux/store';
import LoginPage from './pages/Login';
import Home from './pages/Home';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
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
                    <Route path="/" element={authority ? <Home /> : <LoginPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;







