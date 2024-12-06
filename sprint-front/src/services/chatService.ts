import api from "@/services/api";
import { handleApiError, handleApiRequest } from "./handler";
import { ChatMessage } from "@/types/chatTypes";

export default {
    async sendMessage(message: ChatMessage): Promise<ChatMessage> {
        try {
            const response = await handleApiRequest(api.post("chatbot/workflow", message));

            return response
        }
        catch (error) {
            handleApiError(error);  
    }
}
}
