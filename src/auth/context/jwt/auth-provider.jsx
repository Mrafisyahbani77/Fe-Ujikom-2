import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------
const initialState = {
  user: null,
  roles: [],
  admin: false,
  loading: true,
  accessToken: null,
  refreshToken: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        roles: action.payload.roles,
        admin: action.payload.admin,
      };
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        user: action.payload.user,
        roles: action.payload.roles,
        admin: action.payload.admin,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        roles: [],
        admin: false,
        accessToken: null,
        refreshToken: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------
const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();

  // Initialize the authentication state
  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const response = await axiosInstance.get(endpoints.auth.me);
        const user = response.data?.user || null;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
            roles: user?.role ? [user.role] : [],
            admin: user?.role === 'admin',
          },
        });
      } else {
        dispatch({ type: 'INITIAL', payload: { user: null, roles: [], admin: false } });
      }
    } catch (error) {
      console.error('Initialization Error:', error);
      dispatch({ type: 'INITIAL', payload: { user: null, roles: [], admin: false } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await axiosInstance.post(endpoints.auth.login, { email, password });
        const { accessToken, refreshToken, user } = response.data;

        sessionStorage.setItem('refreshToken', refreshToken);
        setSession(accessToken);

        dispatch({
          type: 'LOGIN',
          payload: {
            user,
            roles: user?.role, // Perbaikan disini
            admin: user?.role === 'admin',
            accessToken,
            refreshToken,
          },
        });

        await initialize(); // Panggil ulang agar state diperbarui

        return response.data; // Pastikan login() mengembalikan response
      } catch (error) {
        console.error('Login Error:', error);
        throw error;
      }
    },
    [initialize]
  );

  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = { email, password, firstName, lastName };

    try {
      const response = await axiosInstance.post(endpoints.auth.register, data);
      const { user } = response.data;

      dispatch({
        type: 'REGISTER',
        payload: { user, roles: user.role ? [user.role] : [], admin: user.role === 'admin' },
      });
    } catch (error) {
      console.error('Registration Error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = sessionStorage.getItem('refreshToken');

    try {
      await axiosInstance.post(endpoints.auth.logout, { refreshToken });
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  // Status management
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
