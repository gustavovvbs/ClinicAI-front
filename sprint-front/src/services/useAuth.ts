import api from "./api";
import { handleApiRequest, handleApiError } from "./handler";
import { LoginFormData, LoginResponse } from "../types/authTypes";

interface UserPayload {
    user_id: string;
    username: string;
}

export const loginService = async (data: LoginFormData): Promise<LoginResponse> => {
    try {
        const response = await handleApiRequest(api.post<LoginResponse>("/auth/login", data));
        localStorage.setItem('token', response.access_token);
        return response
    }
    catch (error:any) {
       handleApiError(error);
    }
}

export const logoutService = async (): Promise<void> => {
    localStorage.removeItem('token');
}

export const validateToken = async (token: string | null): Promise<UserPayload> => {
    try {
        const response = await handleApiRequest(api.post<UserPayload>("/auth/verify", {
            token: token
        }));
        return response;
    }
    catch (error) {
        handleApiError(error);
    }
}


