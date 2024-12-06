import api from "./api";
import { BaseStudyType, InternalStudyResponse } from "@/types/studyTypes";
import { handleApiRequest, handleApiError} from "@/services/handler";
import { ApiError } from "@/types/errors";

export default {
    async fetchStudies(): Promise<InternalStudyResponse> {
        try {
        const studies = await handleApiRequest(api.get<InternalStudyResponse>("/study/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        }));
            return studies;
        } catch (error) {
            handleApiError(error);
        }
    },

    async createStudy(study: BaseStudyType): Promise<void> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Unauthorized");
        }
        try {
           const response = await handleApiRequest(api.post("/study", study, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }));
            return response;
        } catch (error) {
            handleApiError(error);
        }
    },

    async approveStudy(studyId: string): Promise<void> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new ApiError("Unauthorized", 401);
        }
        try {
            await handleApiRequest(api.put(`study/approve/${studyId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }));
            
        } catch (error) {
            handleApiError(error);
        }
    },

    async rejectStudy(studyId: string): Promise<void> {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new ApiError("Unauthorized", 401);
        }
            try {
                await handleApiRequest(api.put(`study/reject/${studyId}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }));
                
            } catch (error) {
               handleApiError(error);
            }
        }
}