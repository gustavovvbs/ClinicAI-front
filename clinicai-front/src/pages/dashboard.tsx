import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {MedicoQuery} from "@/types/medicoQueryType";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";
import { DashSideBar } from "@/components/AdminSideBar";   
import { DashBoardStudies } from "@/pages/dashboard-studies";
import  DashboardDados  from "@/pages/dashboard-dados";
import  SearchFiltersMedico  from "@/components/SearchFiltersMedico";
import  SearchResultsMedico  from "@/components/SearchResultsMedico";
import Pagination from "@/components/Pagination";
import  SearchService  from "@/services/searchService";
import ActionBar from "@/components/ActionBar";
import CreateStudyForm from "@/pages/dashboard-create";
import { ValidScreens } from "@/components/AdminSideBar";
import { useSearch } from "@/contexts/searchContext";
import { validateToken } from "@/services/useAuth";
import { handleApiError } from "@/services/handler";

const PAGE_NAMES: Record<ValidScreens, string> = {
    submitted: 'Estudos Submetidos',
    search: 'Pesquisar Estudos',
    create: 'Criar Estudos',
    dados: 'dados',
    home: 'Home'
}

export default function AdminDashboard() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [activeScreen, setActiveScreen] = useState<ValidScreens>("submitted");
    const [filters, setFilters] = useState<MedicoQuery>({});
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [page, setPage] = useState<string>('1');
    const { medicoSearch, setMedicoSearch } = useSearch();
    const navigate = useNavigate();

    const checkLogin = () => {
        try {
            const token = localStorage.getItem('token');
            const response = validateToken(token);
            return response;
        } catch (error) {
            handleApiError(error)
        }
    }

    useEffect(() => {
       if (localStorage.getItem('token')) {
           setLoading(false);
            checkLogin();
        }
    }
    , [activeScreen]);

    const renderScreen = (screen: string) => {
        console.log(screen)
        switch(screen) {
            case 'submitted':
                return <DashBoardStudies />

            case 'dados':
                return <DashboardDados />

            case 'search':
                const handleSearch = async (filters: MedicoQuery) => {
                    setLoading(true);
                    const searchFilters = {...filters, page: page};
                    setFilters(searchFilters);
            
                    const filteredFilters = Object.fromEntries(
                        Object.entries(filters).filter(([_, value]) => {
                            if (value === "" || value === null) return false;
                            if (Array.isArray(value)) return value[0].length > 0;
                            return Boolean(value);                
                        }
                        )) as MedicoQuery;

                    try { 
                        const response = await SearchService.searchMedico(filteredFilters);
                        response.studies.forEach((study) => {
                            try {
                                if (typeof study.Location === 'string') {
                                    const parsedLocation = JSON.parse(study.Location);
                                    study.Location = Array.isArray(parsedLocation) ? parsedLocation : [parsedLocation];
                                }
                                if (typeof study.Contacts === 'string') {
                                    study.Contacts = JSON.parse(study.Contacts);
                                }
                                if (typeof study.Researchers === 'string') {
                                    study.Researchers = JSON.parse(study.Researchers);
                                }
                                if (typeof study.Interventions === 'string') {
                                    study.Interventions = JSON.parse(study.Interventions);
                                }
                                if (typeof study.Conditions === 'string') {
                                    study.Conditions = JSON.parse(study.Conditions);
                                }
                                if (typeof study.InterventionNames === 'string') {
                                    study.InterventionNames = JSON.parse(study.InterventionNames);
                                }
                                if (typeof study.Phase === 'string') {
                                    study.Phase = JSON.parse(study.Phase);
                                }
                            } catch (error) {
                                handleApiError(error);
                            }
                        });
                        console.log(response)
                        setMedicoSearch(prevState => ({
                            ...prevState,
                            resultsData: response.studies,
                            totalPages: response.totalPages,
                        }));

                        setHasSearched(true);
                    } 
                    catch (err: any) {
                        handleApiError(err);
                    } finally {
                        setLoading(false);
                    }
                };


        
                const handlePageChange = (page: string) => {
                    setPage(page);
                    const searchFilters = {...filters, page: page};
                    handleSearch(searchFilters);
                }


                return (
                    <div className="max-w-screen mx-auto">
                        <SearchFiltersMedico onSearch={handleSearch} />
                        {isLoading ? (
                        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                            <Icons.spinner className="w-8 h-8 animate-spin text-white mb-4" />
                        <span className="text-white text-lg">Carregando resultados...</span>
                        </div>
                        ) : hasSearched && medicoSearch.resultsData.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-lg text-gray-500">
                                    Nenhum resultado encontrado para os filtros selecionados.
                                </p>
                            </div>
                        ) : medicoSearch.resultsData.length > 0 ? (
                            <>
                                <SearchResultsMedico resultsData={medicoSearch.resultsData} />
                                <Pagination page={medicoSearch.page.toString()} handlePageChange={handlePageChange} totalPages={medicoSearch.totalPages} />
                                <ActionBar studies={medicoSearch.resultsData} />
                            </>
                        ) : null}
                    </div>
                )

            
            case 'create':
                return <CreateStudyForm />;
        }
    }

    const handleScreenChange = (screen: ValidScreens) => {
        setActiveScreen(screen);
        localStorage.setItem('activeScreen', screen);
    }

    useEffect(() => {
        const screen = localStorage.getItem('activeScreen') as ValidScreens;
        if (screen) {
            setActiveScreen(screen);
        }
    }
    , []);

    useEffect(() => {
        let isMounted = true;

        async function fetchUser() {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    navigate('/login');
                    throw new Error("Token not found");
                }

            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchUser();

        return () => {
            isMounted = false;
        };
    }
    , []);
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Icons.spinner className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
       <SidebarProvider>
        <DashSideBar 
            activeScreen={activeScreen as ValidScreens}
            onNavigate={handleScreenChange}
        />

        <SidebarInset>
           <header className="flex h-16 shrink-0 items-center gap-2 border-brandDarkBlue">
                <div className="flex items-center gap-2 px-3">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink >Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{PAGE_NAMES[activeScreen]}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>                    
                </div>
           </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
            {renderScreen(activeScreen)}
        </div>


        </SidebarInset>
       </SidebarProvider>

    );
}
