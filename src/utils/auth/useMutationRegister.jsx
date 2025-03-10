import { useMutation } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "src/utils/axios";

export const useMutationRegister = ({ onSuccess, onError}) => useMutation({
    mutationKey : ['register'],
    mutationFn : async (body) => {
        const response = await axiosInstance.post(endpoints.auth.register, body)
        return response.data
    },
    onSuccess,
    onError
})