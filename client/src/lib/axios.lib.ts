import axios from "axios";

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
export const axiosInstance = axios.create({
    baseURL: `${backendUrl}/api`,
    withCredentials: true,
});
