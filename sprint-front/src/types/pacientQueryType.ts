

export interface PacientQuery {
    keywords?: string, 
    condition?: string, 
    status?: Array<string>, 
    location?: any,
    intervention?: string,
    sponsor?: string,
    age?: string,
    page?: string
}