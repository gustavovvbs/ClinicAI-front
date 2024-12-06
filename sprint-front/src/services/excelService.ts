import api from "./api";
import { BaseStudyType } from "@/types/studyTypes";
import { handleApiError } from "./handler";

export default {
    async getExcelFile(studies: BaseStudyType[]) {
        try {
            const response = await api.post('/excel/fetch', 
                { studies },
                { 
                    responseType: 'arraybuffer',
                }
            );
            return response;
        } catch (error) {
            handleApiError(error);
        }
    }
}