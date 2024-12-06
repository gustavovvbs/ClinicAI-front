
export interface Contact {
    email: string;
    name: string;
    phone: string;
    role: string; 
  }
  
export interface Location {
City: string;
Country: string;
Facility: string;
State: string;
Status: string; 
}

export interface Researcher {
  name: string;
  affiliation: string;
  role: string;
}
export interface Date {
    date?: string;
    type?: string
}

export interface Intervention {
  description?: string;
  explanation?: string;
  interventionType?: string;
  label?: string;
  name?: string;
}

export interface BaseStudyType {
Conditions: string[];
Contacts: Contact[];
Description: string;
HasPublishedResults: boolean;
Interventions: Intervention[];
InterventionNames: string[];
Researchers: Researcher[];
Keywords: string[];
Location: Location[];
Restrictions: string;
Sponsor: string;
Title: string;
Organization:string;
StartDate: Date | string;
endDate: Date | string;
Phase: string[];
HealthyVolunteers: boolean;
Sex: string;
MinimumAge: string;
MaximumAge: string;
FunderType: string;
PrimaryCompletionDate: Date | string;
FirstSubmissionDate?: string;
FirstPostDate?: string;
LastUpdatePostDate?: string;
StudyType: string;
Status?: string[];
}

export interface InternalStudyType extends BaseStudyType {
    _id: string;
    sub_status: string;
}

export interface InternalStudyResponse {
  studies: InternalStudyType[];
}

export interface ExternalStudyResponse { 
  studies: BaseStudyType[];
  currentPage: number;
  totalPages: number;
}

export interface CreateStudy {
  Title: string;
  Description: string;
  Sponsor: string;
  FunderType: string;
  Organization: string;
  StartDate: string;
  endDate: string;
  MinimumAge: string;
  Keywords: string[];
  MaximumAge: string;
  Restrictions: string;
  Sex: string;
  StudyType: string;
  Phase: string[];
  Interventions: Intervention[];
  Location: Location[];
  InterventionNames: string[];
  HealthyVolunteers: boolean;
  PrimaryCompletionDate: string;
  LastUpdatedPostDate: string;
  HasPublishedResults: boolean;
  Conditions: string[];
  Contacts: Contact[];
  Researchers: Researcher[];
  Status: string[];

}
