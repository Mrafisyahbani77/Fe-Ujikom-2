// routes
import { paths } from 'src/routes/paths';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

function jwtDecode(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp) => {
  let expiredTimer;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime - 5000; // Refresh 5 detik sebelum expired

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(async () => {
    try {
      await refreshAccessToken();
    } catch (error) {
      console.error('Gagal memperbarui token:', error);
      // logoutUser();
    }
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken, refreshToken) => {
  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    // logoutUser();
  }
};

// ----------------------------------------------------------------------

export const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('Refresh token tidak tersedia');
  }

  try {
    const response = await axios.post('/api/auth/refresh-token', { refreshToken });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    setSession(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

// export const logoutUser = () => {
//   sessionStorage.removeItem('accessToken');
//   sessionStorage.removeItem('refreshToken');
//   delete axios.defaults.headers.common.Authorization;
//   window.location.href = paths.auth.jwt.login;
// };

// ----------------------------------------------------------------------
// Interceptor untuk auto-refresh token saat request gagal
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
