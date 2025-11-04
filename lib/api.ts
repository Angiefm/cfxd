import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { socketClient } from '@/lib/socket';

class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    const port = process.env.NEXT_PUBLIC_API_PORT;
    const fullUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!port || !fullUrl) {
      throw new Error('You must define NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_PORT in the .env');
    }

    const isBrowser = typeof window !== 'undefined';
    let baseURL: string;

    if (isBrowser) {
      const hostname = window.location.hostname;

      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

      if (isIp) {
        baseURL = `http://${hostname}:${port}`;
      } else {
        baseURL = fullUrl;
      }
    } else {
      baseURL = `http://localhost:${port}`;
    }

    console.log(`[ApiClient] Base URL: ${baseURL}`);

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token && token !== 'undefined' && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Enviando token en header:", config.headers.Authorization);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.setupInterceptors();

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (originalRequest.url?.includes('/auth/logout')) {
          return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
          // Don't auto-refresh for image routes to avoid redirect loops
          if (originalRequest.url?.includes('/images/')) {
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshResponse = await this.axiosInstance.post('/auth/refresh');
            socketClient.connect();
            this.processQueue(null);
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const response = axiosError.response;
      if (response?.data && typeof response.data === 'object') {
        const data = response.data as any;
        const message = data.message || response.statusText || 'Unknown Axios error';
        console.log('API Error:', message);
        throw new Error(message);
      }

      console.log('API Error:', axiosError.message);
      throw new Error(axiosError.message || 'Network Error');
    }

    throw new Error('Unexpected error occurred');
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.get<T>(url, config);
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.post<T>(url, data, config);
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.put<T>(url, data, config);
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.patch<T>(url, data, config);
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const res: AxiosResponse<T> = await this.axiosInstance.delete<T>(url, config);
      return res.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiClient = new ApiClient();

export type { ApiClient };