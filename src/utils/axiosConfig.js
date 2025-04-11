import axios from "axios";
import { API_URL_8022 } from "../constants/app.constants";

const axiosInstance = axios.create({
  baseURL: API_URL_8022,
  withCredentials: true,
});

export const setupInterceptors = (navigate, setAccessToken) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      // Tự động set Content-Type nếu chưa đặt
      if (!config.headers["Content-Type"]) {
        if (config.data instanceof FormData) {
          config.headers["Content-Type"] = "multipart/form-data";
        } else {
          config.headers["Content-Type"] = "application/json";
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 410 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const data = await axios.get(`${API_URL_8022}/users/refresh-token`, {
            withCredentials: true,
          });
          setAccessToken(data.accessToken);
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token failed:", refreshError);
          setAccessToken(null);
          navigate("/login");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;
