import axios from "axios";
import { HOST_API } from "src/config-global";

// Buat instance axios dengan konfigurasi awal
const axiosInstance = axios.create({
  baseURL: HOST_API,
  withCredentials: true, // Untuk mengirimkan cookie (refresh token)
});

// Menyimpan status refresh token
let isRefreshing = false;
let failedQueue = [];

// Fungsi untuk memproses antrian request yang tertunda
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

// Interceptor request: Tambahkan access token ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response: Tangani error 401 (Unauthorized)
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
        // Panggil endpoint refresh token
        const { data } = await axiosInstance.post("/api/auth/refresh-token");

        // Gunakan nama yang sesuai dengan backend
        const { accessToken: newToken } = data;

        // Simpan token baru di sessionStorage
        sessionStorage.setItem("accessToken", newToken);

        // Perbarui header di request asli
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Perbarui default header axios
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Jalankan ulang antrian request yang tertunda
        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Hapus sesi jika refresh token gagal
        sessionStorage.removeItem("accessToken");
        window.location.href = "/auth/jwt/login"; // Redirect ke halaman login

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
  auth: {
    me: '/api/auth//profile',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    google: '/api/auth/google',
    googleCallback: 'api/auth/google/callback',
  },
  public: {
    fetchAllCategory: '/api/categories',
    fetchByIdCategory: '/api/categories',
  },
  statistik: {
    total_order: '/api/chart/total-orders',
    sale_weekly: '/api/chart/sales-weekly',
    products_sold: 'api/chart/products-sold',
    sales_by_gender: 'api/chart/sales-by-gender',
    sales_yearly: 'api/chart/sales-yearly',
  },
  banner: {
    list: '/api/banners',
    getByid: 'api/banners',
    create: '/api/banners/store',
    update: '/api/banners',
    delete: '/api/banners',
  },
  category: {
    list: '/api/categories',
    getByid: 'api/categories',
    getBySlug: 'api/categories',
    create: '/api/categories/store',
    update: '/api/categories',
    delete: '/api/categories',
  },
  product: {
    list: '/api/products/users/all',
    details: '/api/products/users',
    update: '/api/products',
    delete: '/api/products',
    create: '/api/products/store',
    search: '/api/product/search',
  },
  whishlist: {
    list: '/api/wishlist',
    details: '/api/wishlist',
    update: '/api/wishlist',
    delete: '/api/wishlist',
    create: '/api/wishlist/store',
  },
  cart: {
    list: '/api/cart',
    details: '/api/cart',
    update: '/api/cart',
    delete: '/api/cart',
    create: '/api/cart/store',
  },
  order: {
    list: '/api/order',
    details: '/api/order',
    update: '/api/order',
    delete: '/api/order',
    create: '/api/order/store',
  },
  payment: {
    buy: '/api/payments',
    nontification: '/api/payments/notification',
    status: '/api/payments',
  },
  shippings: {
    list: '/api/shippings',
    details: '/api/shippings',
    provinces: '/api/shippings/provinces',
    city: '/api/shippings/cities', // need id provinsi
    districts: '/api/shippings/districts', //need id city
    update: '/api/shippings',
    delete: '/api/shippings',
    deleteAll: '/api/shippings',
    create: '/api/shippings/store',
  },
  review: {
    list: '/api/reviews',
    details: '/api/reviews',
    update: '/api/reviews',
    delete: '/api/reviews',
    create: '/api/reviews/store',
  },
};
