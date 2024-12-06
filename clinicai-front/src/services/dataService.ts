import api from "./api";
import { handleApiError, handleApiRequest } from "./handler";
import { MainMetricsType } from "@/types/dataTypes";

export default {
    async fetchMetrics(): Promise<MainMetricsType> {
        try {
            const response = await handleApiRequest(api.get('/data/metrics'));
            return response;
        }
        catch (error) {
            handleApiError(error);
        }
    }
}