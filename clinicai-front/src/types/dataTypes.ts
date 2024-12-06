export type Disease = {
    disease: string;
    count: number;
}

export type Treatment = {
    treatment: string;
    count: number;
}

export type PhasePercentage = {
    phase: string;
    percentage: number;
}

export type TypesPerCenter = {

    [key: string]: {
  
      count: number;
      type: string;
    };
};

export type TopCenter = {
    facility: string;
    count: number;
}

export type Representatividade = {
    representatividade: number;
    total_brazil_studies: number;
    total_global_studies: number;
}

export interface MainMetricsType {
    main_diseases: Disease[];
    representatividade: Representatividade;
    top_centers: TopCenter[];
    types_per_centers: TypesPerCenter;
    main_treatments: Treatment[];
    phase_percentages: PhasePercentage[];
}