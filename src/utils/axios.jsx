import axios from 'axios';
import { HOST_API } from 'src/config-global';

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
    const token = localStorage.getItem('accessToken');
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

    if (error.response?.status === 403) {
      window.location.href = '/403';
      return Promise.reject(error);
    }

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
        const { data } = await axiosInstance.post('/api/auth/refresh-token');

        // Gunakan nama yang sesuai dengan backend
        const { accessToken: newToken } = data;

        // Simpan token baru di localStorage
        localStorage.setItem('accessToken', newToken);

        // Perbarui header di request asli
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Perbarui default header axios
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

        // Jalankan ulang antrian request yang tertunda
        processQueue(null, newToken);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // Hapus sesi jika refresh token gagal
        localStorage.removeItem('accessToken');
        window.location.href = '/auth/login'; // Redirect ke halaman login

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
    me: '/api/auth/profile',
    updateProfile: '/api/auth/profile/update',
    updatePassword: '/api/auth/profile/update-password',
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refreshToken: '/api/auth/refresh-token',
    google: '/api/auth/google',
    googleCallback: 'api/auth/google/callback',
    forgotpassword: 'api/auth/forgot-password',
    verifyotp: 'api/auth/verify-otp',
    resetpassword: 'api/auth/reset-password',
  },
  public: {
    fetchAllCategory: '/api/categories',
    fetchByIdCategory: '/api/categories', //need id
  },
  statistik: {
    total_order: '/api/chart/total-orders',
    sale_weekly: '/api/chart/sales-weekly',
    products_sold: 'api/chart/products-sold',
    sales_by_gender: 'api/chart/sales-by-gender',
    sales_yearly: 'api/chart/sales-yearly',
    total_user: 'api/chart/total-users',
    total_produk: 'api/chart/total-products',
  },
  banner: {
    public: {
      list: '/api/banners/public',
      detail: '/api/banners/public', //need id
    },
    list: '/api/banners',
    getByid: 'api/banners', //need id
    create: '/api/banners/store',
    update: '/api/banners', //need id
    delete: '/api/banners', //need id
  },
  category: {
    list: '/api/categories',
    getByid: 'api/categories', //need id
    getBySlug: 'api/categories/slug', //need slug
    create: '/api/categories/store',
    update: '/api/categories', //need id
    delete: '/api/categories', //need id
  },
  discount: {
    user: {
      checkValidate: '/api/discounts/validate',
    },
    public: {
      GetAllDiscount: '/api/discounts/public',
      GetDiscountSlug: '/api/discounts/slug', //need slug
      Available: '/api/discounts/available',
    },
    list: '/api/discounts',
    getByid: 'api/discounts', //need id
    getBySlug: 'api/discounts', //need slug
    create: '/api/discounts/store',
    update: '/api/discounts', //need id
    delete: '/api/discounts', //need id
  },
  product: {
    list: '/api/products/users/all',
    listAdmin: '/api/products/admin/all',
    detailAdmin: '/api/products/admin', //need id
    details: '/api/products/users', //need id
    update: '/api/products', //need id
    delete: '/api/products', //need id
    create: '/api/products/store',
    search: '/api/product/search',
    chartNew: '/api/products/newest',
    shareProduct:'/api/products/share'
  },
  whishlist: {
    list: '/api/wishlist',
    details: '/api/wishlist', //need id
    update: '/api/wishlist', //need id
    delete: '/api/wishlist', //need id
    create: '/api/wishlist/store',
  },
  cart: {
    list: '/api/cart',
    details: '/api/cart', //need id
    update: '/api/cart', //need id
    delete: '/api/cart', //need id
    create: '/api/cart/store',
  },
  order: {
    list: '/api/order',
    details: '/api/order', //need id
    update: '/api/order', //need id
    delete: '/api/order', //need id
    create: '/api/order/from-cart',
    exportInvoice: '/api/order', //need id
    downloadInvoice: '/api/order', // need  id
    cancelOrder: '/api/order/cancellation-requests', //need id
    cancel: '/api/order', //need id
  },
  payment: {
    buy: '/api/payments',
    nontification: '/api/payments/notification',
    status: '/api/payments',
  },
  shippings: {
    list: '/api/shippings',
    details: '/api/shippings', //need id
    provinces: '/api/shippings/provinces',
    city: '/api/shippings/cities', // need id provinsi
    districts: '/api/shippings/districts', //need id city
    village: '/api/shippings/villages', //need id districts
    update: '/api/shippings', //need id
    delete: '/api/shippings', //need id
    deleteAll: '/api/shippings', //need id
    create: '/api/shippings/store',
  },
  review: {
    public: {
      // list: '/api/reviews',
      details: '/api/reviews/product', //need id
    },
    list: '/api/reviews',
    details: '/api/reviews', //need id
    update: '/api/reviews', //need id
    delete: '/api/reviews', //need id
    create: '/api/reviews/store',
  },
  user: {
    getAllUser: '/api/users',
    getById: '/api/users', //need id
    banUser: '/api/users', //need id
    unbanUser: '/api/users', //need id
  },
  nontification: {
    getNontification: '/api/notifications',
    getUnReadNontification: '/api/notifications/unread/count',
    updateNontificationReadAll: '/api/notifications/read/all',
    updateNontificationById: '/api/notifications/read', //need id
  },
};
