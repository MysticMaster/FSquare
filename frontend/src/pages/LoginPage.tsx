import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login, checkAuth} from '../redux/reducers/authSlice';
import {RootState, AppDispatch} from '../redux/store';
import {useNavigate} from 'react-router-dom';
import ErrorNotification from "../components/title/ErrorNotification.tsx";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const status = useSelector((state: RootState) => state.auth.status);
    const uError = useSelector((state: RootState) => state.auth.uError);
    const pError = useSelector((state: RootState) => state.auth.pError);

    useEffect(() => {
        setIsButtonDisabled(!username || !password);
    }, [username, password]);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        if (event && event.preventDefault) {
            event.preventDefault();
        }
        try {
            const resultAction = await dispatch(login({username, password})).unwrap();
            if (resultAction.status === 'success') {
                setUsername('');
                setPassword('');
                await dispatch(checkAuth()).unwrap();
                navigate('/');
            } else {
                console.log('LoginPage failed: ', resultAction.status);
            }
        } catch (err) {
            console.error('Failed to log in: ', err);
        }
    };

    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-3xl font-semibold text-gray-900">
                    <img className="w-10 h-10 mr-2 rounded-lg" src="/logo/fsquare_light.webp" alt="logo"/>
                    FSquare
                </a>
                <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-orange-500 md:text-2xl">
                            Đăng nhập tài khoản
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                                    Tên đăng nhập
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                />
                                {
                                    uError && <ErrorNotification message={uError}/>
                                }
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                    Mật khẩu
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="••••••••"
                                    required
                                />
                                {
                                    pError && <ErrorNotification message={pError}/>
                                }
                            </div>
                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-bold text-primary-600 hover:underline">
                                    Quên mật khẩu?
                                </a>
                            </div>
                            <button type="submit"
                                    className={`w-full text-white ${isButtonDisabled ? 'bg-gray-300' : 'bg-orange-500'} hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm py-2.5 text-center`}
                                    disabled={isButtonDisabled}>
                                {status === 'loading' ? 'Logging in...' : 'Đăng nhập'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
