import axios from 'axios';
import {resetAuthority} from "../redux/reducers/authSlice.ts";

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: true,
    validateStatus: function (status) {
        return (status >= 200 && status < 300) ||
            [400, 403, 404, 409, 500, 503].indexOf(status) !== -1;
    }
});

export const setupInterceptors = (store: any) => {
    axiosClient.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                store.dispatch(resetAuthority());
                //window.location.reload();
            }
            return Promise.reject(error);
        }
    );
};

export default axiosClient;
