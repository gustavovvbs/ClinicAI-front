import { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import { ApiError } from "@/types/errors";

export function handleApiError(error: any): never {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status || 500;
        const message = axiosError.message || axiosError.message || "Erro inesperado";
        throw new ApiError(message, status);
    }
    throw new ApiError("Erro inesperado", 500);
}

export async function handleApiRequest<T>(request: Promise<AxiosResponse<T>>): Promise<T> {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}