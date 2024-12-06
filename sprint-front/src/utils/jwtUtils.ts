import {jwtDecode} from "jwt-decode";

export const getJwtPayload = (token: string) => {
    return jwtDecode(token);
}

export const getUserIdFromToken = (token: string) => {
    const payload = getJwtPayload(token);
    const userId = payload.sub;
    if (!userId) {
        throw new Error('User ID not found in token');
    }
    return userId;
}

