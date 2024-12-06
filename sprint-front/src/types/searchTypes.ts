import React from "react";
import { MedicoQuery } from "./medicoQueryType";
import { PacientQuery } from "./pacientQueryType";
import { BaseStudyType } from "./studyTypes";

export interface GeneralSearchState {
    filters: PacientQuery;
    resultsData:BaseStudyType[];
    page: string;
    totalPages: number;
}

export interface MedicoSearchState {
    filters: MedicoQuery;
    resultsData: BaseStudyType[];
    page: string;
    totalPages: number;
}

export interface SearchContextProps {
    generalSearch: GeneralSearchState;
    medicoSearch: MedicoSearchState;
    setGeneralSearch: React.Dispatch<React.SetStateAction<GeneralSearchState>>;
    setMedicoSearch: React.Dispatch<React.SetStateAction<MedicoSearchState>>;
}