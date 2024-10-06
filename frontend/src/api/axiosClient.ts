import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
    validateStatus: function (status) {
        return (status >= 200 && status < 300) ||
            [400, 401, 403, 404, 409, 500, 503].indexOf(status) !== -1;
    }
});

export default axiosClient;
