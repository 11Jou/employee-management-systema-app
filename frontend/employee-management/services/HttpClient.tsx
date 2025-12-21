import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_NAME_KEY = "user_name";
const USER_ROLE_KEY = "user_role";

// Create axios instance
export const HttpClient = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

// Token management functions
export const TokenManager = {
    getAccessToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(ACCESS_TOKEN_KEY);
        }
        return null;
    },

    getRefreshToken: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(REFRESH_TOKEN_KEY);
        }
        return null;
    },

    setTokens: (accessToken: string, refreshToken: string): void => {
        if (typeof window !== "undefined") {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
    },

    clearTokens: (): void => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            localStorage.removeItem(USER_NAME_KEY);
            localStorage.removeItem(USER_ROLE_KEY);
        }
    },

    getUserName: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(USER_NAME_KEY);
        }
        return null;
    },

    getUserRole: (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(USER_ROLE_KEY);
        }
        return null;
    },

    setUserInfo: (name: string, role: string): void => {
        if (typeof window !== "undefined") {
            localStorage.setItem(USER_NAME_KEY, name);
            localStorage.setItem(USER_ROLE_KEY, role);
        }
    },
};

// Request interceptor - Add access token to requests
HttpClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = TokenManager.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: string) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token || undefined);
        }
    });
    failedQueue = [];
};

HttpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise<string | undefined>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers && token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return HttpClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = TokenManager.getRefreshToken();

            if (!refreshToken) {
                TokenManager.clearTokens();
                processQueue(error, null);
                // Redirect to login page if needed
                if (typeof window !== "undefined") {
                    window.location.href = "/";
                }
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the token
                const response = await axios.post(
                    `${HttpClient.defaults.baseURL}/auth/token/refresh/`,
                    {
                        refresh: refreshToken,
                    }
                );

                const { access, refresh } = response.data;

                // Store new tokens
                TokenManager.setTokens(access, refresh || refreshToken);

                // Update the original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                }

                // Process queued requests
                processQueue(null, access);
                isRefreshing = false;

                // Retry the original request
                return HttpClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                TokenManager.clearTokens();
                processQueue(refreshError as AxiosError, null);
                isRefreshing = false;

                if (typeof window !== "undefined") {
                    window.location.href = "/";
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth service methods
export const AuthService = {
    /**
     * Login with email and password
     * @param email - User email
     * @param password - User password
     * @returns Promise with access and refresh tokens
     */
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(
                `${HttpClient.defaults.baseURL}/auth/token/`,
                {
                    email,
                    password,
                }
            );

            const { access, refresh, name, role } = response.data;

            // Store tokens
            TokenManager.setTokens(access, refresh);

            // Store user info (name and role) if available
            if (name && role) {
                TokenManager.setUserInfo(name, role);
            }

            return {
                success: true,
                data: {
                    access,
                    refresh,
                    name,
                    role,
                },
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    error: error.response?.data || error.message,
                };
            }
            return {
                success: false,
                error: "An unexpected error occurred",
            };
        }
    },

    /**
     * Refresh access token using refresh token
     * @returns Promise with new access and refresh tokens
     */
    refreshToken: async () => {
        try {
            const refreshToken = TokenManager.getRefreshToken();

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await axios.post(
                `${HttpClient.defaults.baseURL}/auth/token/refresh/`,
                {
                    refresh: refreshToken,
                }
            );

            const { access, refresh } = response.data;

            // Store new tokens
            TokenManager.setTokens(access, refresh || refreshToken);

            return {
                success: true,
                data: {
                    access,
                    refresh: refresh || refreshToken,
                },
            };
        } catch (error) {
            TokenManager.clearTokens();
            if (axios.isAxiosError(error)) {
                return {
                    success: false,
                    error: error.response?.data || error.message,
                };
            }
            return {
                success: false,
                error: "An unexpected error occurred",
            };
        }
    },

    /**
     * Logout - Clear tokens
     */
    logout: () => {
        TokenManager.clearTokens();
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    },

    /**
     * Check if user is authenticated
     * @returns boolean
     */
    isAuthenticated: (): boolean => {
        return !!TokenManager.getAccessToken();
    },

    /**
     * Get user name from storage
     * @returns string | null
     */
    getUserName: (): string | null => {
        return TokenManager.getUserName();
    },

    /**
     * Get user role from storage
     * @returns string | null
     */
    getUserRole: (): string | null => {
        return TokenManager.getUserRole();
    },
};

export default HttpClient;
