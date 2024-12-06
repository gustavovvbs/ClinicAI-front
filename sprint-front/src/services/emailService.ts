import api from "./api";
import { handleApiError, handleApiRequest } from "@/services/handler";
import { BaseStudyType } from "../types/studyTypes";


export default {
    async sendEmail(email:string, studies: BaseStudyType[]): Promise<void> {
        try {
            const response = await handleApiRequest(api.post('/email/send', {email, studies}));
            return response;
        }
        catch (error) {
            handleApiError(error);
        }
}
}