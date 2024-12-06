import api from "./api";
import { BaseStudyType } from "@/types/studyTypes";

export default {
    /**
     * Envia os estudos para o backend e obtém o PDF gerado.
     * @param studies Lista de estudos a serem incluídos no PDF
     */
    async getPdfFile(studies: BaseStudyType[]) {
        try {
            const response = await api.post(
                '/pdf/generate', // Endpoint do backend para geração do PDF
                { studies }, // Payload enviado ao backend
                { 
                    responseType: 'arraybuffer', // Necessário para manipular o arquivo binário (PDF)
                }
            );
            return response;
        } catch (error) {
            console.error('PDF export error:', error);
            throw new Error("Erro ao exportar para PDF");
        }
    }
};
