import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useFetchRefreshToken = () => useQuery({
    queryKey : ['fetch.token'],
    queryFn : async () => {
        const response = await axiosInstance.get(endpoints.auth.refreshToken)
        console.log(response.data)
        return response.data.data
    }
})