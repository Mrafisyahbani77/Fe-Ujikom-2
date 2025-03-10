import axios from 'axios';
import { register } from 'numeral';
// config
import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API, withCredentials: true });

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 dan request belum dicoba ulang
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request untuk mendapatkan refresh token
        const token = sessionStorage.getItem('token');
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('Sesi anda telah berakhir, Silahkan login');
        }

        const { data } = await axiosInstance.post(
          '/api/auth/refresh-token',
          {
            refreshToken: refreshToken,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newToken = data.new_access_token;
        const newRefreshToken = data.new_refresh_token;

        sessionStorage.setItem('accessToken', newToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        alert(err);
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/auth/jwt/login'; // Redirect ke halaman login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  // auth: {
  //   login: '/api/auth/login',
  //   register: '/api/auth/register',
  // },
  auth: {
    me: '/api/auth//profile',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    google: '/api/auth/google',
    googleCallback: 'api/auth/google/callback',
  },
  banner: {
    list: '/api/banner/',
    create: '/api/banner/create',
    update: '/api/banner',
    delete: '/api/banner',
  },
  category: {
    list: '/api/categories',
    create: '/api/categories/store',
    update: '/api/categories',
    delete: '/api/categories',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
