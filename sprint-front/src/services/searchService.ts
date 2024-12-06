import api from "./api";
import { handleApiError, handleApiRequest } from "./handler";	
import { PacientQuery } from "@/types/pacientQueryType";
import { MedicoQuery } from "@/types/medicoQueryType";
import { ExternalStudyResponse } from "@/types/studyTypes";

export default {
    async searchPaciente(query: PacientQuery): Promise<ExternalStudyResponse> {
        try {
            const pacient = await handleApiRequest(api.post<ExternalStudyResponse>("/search/paciente", query));
            return pacient;
        } catch (error) {
            handleApiError(error);
        }
    },
    async searchMedico(query: MedicoQuery): Promise<ExternalStudyResponse> {
        try {
            const medico = await handleApiRequest(api.post<ExternalStudyResponse>("/search/medico", query));
            return medico;
        } catch (error) {
            handleApiError(error);
        }
    },

};