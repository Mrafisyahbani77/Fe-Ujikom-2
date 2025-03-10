import { useMutation } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useGoogleCallback = () =>
  useMutation(async (code) => {
    const response = await axiosInstance.post(endpoints.auth.googleCallback, { code });
    return response.data;
  });
