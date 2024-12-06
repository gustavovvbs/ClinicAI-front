import { User } from "@/types/userTypes";
import api from "./api";

export const UserService = {

    async getUserById(id: string | null): Promise<User> {
        const user = await api.get<User>(`/user/${id}`);
        if (user.status === 200) {
            return user.data;
        }
        throw new Error("Unexpected error");
    },

}