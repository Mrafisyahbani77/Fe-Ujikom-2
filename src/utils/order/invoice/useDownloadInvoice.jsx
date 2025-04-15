// useDownloadInvoice.js
// import { useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

export const useDownloadInvoice = async (id) => {
  if (!id) {
    throw new Error('Invoice ID is required');
  }

  const response = await axiosInstance.get(
    `${endpoints.order.downloadInvoice}/${id}/invoice/download`,
    {
      responseType: 'blob',
    }
  );

  return response.data;
};
