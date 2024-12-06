export interface LoginFormData {
    email: string,
    password: string 
}

export interface LoginResponse {
    access_token: string, 
    tokenType: string 
}

export interface LoginError {
    message: string,
    status?: number
}
