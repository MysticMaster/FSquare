import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true
});

export default axiosClient;
