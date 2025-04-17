// shippingHooks.js - Consolidated hooks file
import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance, { endpoints } from 'src/utils/axios';

// Custom hook to handle all location data
export const useFetchLocationData = ({ provinceId, cityId, districtId }) => {
  // Fetch provinces
  const { 
    data: provinces = [], 
    isLoading: loadingProvinces 
  } = useQuery({
    queryKey: ['fetch.provinces'],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.shippings.provinces);
      return response.data.data;
    },
  });

  // Fetch cities
  const { 
    data: cities = [], 
    isLoading: loadingCities 
  } = useQuery({
    queryKey: ['city.id', provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const response = await axiosInstance.get(`${endpoints.shippings.city}/${provinceId}`);
      return response.data.data;
    },
    enabled: !!provinceId,
  });

  // Fetch districts
  const { 
    data: districts = [], 
    isLoading: loadingDistricts 
  } = useQuery({
    queryKey: ['districts.id', cityId],
    queryFn: async () => {
      if (!cityId) return [];
      const response = await axiosInstance.get(`${endpoints.shippings.districts}/${cityId}`);
      return response.data.data;
    },
    enabled: !!cityId,
  });

  // Fetch villages
  const { 
    data: villages = [], 
    isLoading: loadingVillages 
  } = useQuery({
    queryKey: ['village.id', districtId],
    queryFn: async () => {
      if (!districtId) return [];
      const response = await axiosInstance.get(`${endpoints.shippings.village}/${districtId}`);
      return response.data.data;
    },
    enabled: !!districtId,
  });

  return {
    provinces,
    cities,
    districts,
    villages,
    loadingProvinces,
    loadingCities,
    loadingDistricts,
    loadingVillages,
  };
};
