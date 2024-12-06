import { Location } from "./studyTypes";

export interface pesquisaCreate {
    Title: string;
    Description: string;
    complemento?: string;
    Location: Location[];
    Intervation:Intervention[];
    InterventionNames:string[];
    Sponsor:string;
    FunderType:string;
    Organization:string;
    StartDate:Date | null;
    EndDate:Date | null;
    Keywords:string;
    Conditions:string[];
    MinimumAge:string;
    MaximumAge:string;
    Restrictions:string;
    HealhyVolunteers:boolean;
    HasPublishedResults:boolean
}

export interface Intervention {
    description: string;
    interventionType:string;
    explanation:string;
    label:string;
    }


