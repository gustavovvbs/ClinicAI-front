export interface MedicoQuery {
    keywords?: string, 
    condition?: string, 
    status?: string[], 
    location?: string,
    intervention?: string,
    sponsor?: string,
    age?: string,
    sex?: string,
    studyPhase?: string,
    studyType?: string,
    hasResults?: boolean,
    organization?: string,
    studyId?: string,
    acceptsHealthyVolunteers?: boolean,
    page?: string
}