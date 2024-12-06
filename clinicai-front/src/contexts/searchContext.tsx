import React, {createContext, useContext, useState} from 'react';
import { ReactNode } from 'react';
import { MedicoSearchState, SearchContextProps } from '@/types/searchTypes';
import { GeneralSearchState } from '@/types/searchTypes';


const SearchContext = createContext<SearchContextProps | undefined>(undefined);

interface SearchProviderProps {
    children: ReactNode;
}


export const SearchProvider: React.FC<SearchProviderProps> = ({children}) => {

    const [generalSearch, setGeneralSearch] = useState<GeneralSearchState>({
        filters: {},
        resultsData: [],
        page: '1',
        totalPages: 0
    })

    const [medicoSearch, setMedicoSearch] = useState<MedicoSearchState>({
        filters: {},
        resultsData: [],
        page: '1',
        totalPages: 0
    })
    

    return (
        <SearchContext.Provider value={{generalSearch, setGeneralSearch, medicoSearch, setMedicoSearch}}>
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

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
}

