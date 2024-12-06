import { createContext, useContext, useState } from 'react';
import { ReactNode } from 'react';
import { ChatContextProps,  ChatMessage } from '@/types/chatTypes';

interface ChatProviderProps {
    children: ReactNode;
}

const SearchContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({children}) => {
    
    const [chatMessages, setChatMessages] = useState<ChatMessage>({
        chat_history: [],
        has_doenca: false,
        studies_list: {
            studies: [],
            currentPage: 1,
            totalPages: 1,
        },
        user_message: ''
    })

    return (
        <SearchContext.Provider value={{chatMessages, setChatMessages}}>
            {children}
        </SearchContext.Provider>
    );
}

export const useChat = () => {
const context = useContext(SearchContext);
if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
}
return context;
}