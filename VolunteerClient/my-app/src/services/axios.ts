import axios from 'axios';

const baseURL = 'https://localhost:7222/api';

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use((request) => {
    const token = localStorage.getItem("token");
  
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
  
    return request;
  });

axiosInstance.interceptors.response.use((response) => {
    if (response.status === 401) {
      location.href = '/login';
    }
    return response;
  });
  
export default axiosInstance;