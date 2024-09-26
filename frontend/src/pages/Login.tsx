import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/reducers/authSlice';
import { RootState } from '../redux/store';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const status = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(login({ username, password }));
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-label="Username"
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Password"
                />
                <button type="submit" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Logging in...' : 'Login'}
                </button>
                {error && <p>Error: {error}</p>}
            </form>
        </div>
    );
};

export default Login;
