import axios from 'axios';
import authService from './auth.api';

axios.defaults.withCredentials = true;

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token (401 Unauthorized)
        // and ensure we don't retry more than once
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite loop
            console.log("Token expired, attempting refresh");

            try {

                const response = await authService.refreshAccessToken();

                if (response?.success) {
                    const { accessToken } = response.data;
                    // Update the token in the original request's headers
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    return API(originalRequest);
                }

                console.error("Failed to refresh token:", response?.message || "Unknown error");
                return Promise.reject(response);
                
            } catch (error) {
                console.error("Error refreshing token:", error);
                return Promise.reject(error);

            }

        }

        return Promise.reject(error);
    }
)


export default API;
