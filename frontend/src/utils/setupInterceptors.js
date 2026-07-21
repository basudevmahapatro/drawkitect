import { api } from "@/store/AuthProvider.jsx";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = (setAccessToken, logout) => {
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refreshToken') || originalRequest.url?.includes('/auth/logout')) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                return new Promise((resolve, reject) => {
                    api.post('/auth/refreshToken')
                        .then((res) => {
                            const { accessToken } = res.data;
                            setAccessToken(accessToken);
                            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                            processQueue(null, accessToken);
                            resolve(api(originalRequest));
                        })
                        .catch((err) => {
                            processQueue(err, null);
                            logout();
                            reject(err);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                });
            }

            return Promise.reject(error);
        }
    );
};