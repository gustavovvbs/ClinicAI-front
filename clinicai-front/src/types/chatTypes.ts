import { BaseStudyType, ExternalStudyResponse} from "./studyTypes";
import React from "react";

export interface Message {
    sender: string;
    text: string;
    studies_list?: BaseStudyType[]
}
export interface ChatMessage {
    user_message: string;
    has_doenca: boolean;
    studies_list: ExternalStudyResponse;
    chat_history: Message[];
}

export interface ChatContextProps {
    chatMessages: ChatMessage;
    setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage>>;
}