import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchHeader from "@/components/SearchHeaderMedico";
import SearchFiltersMedico from "@/components/SearchFiltersMedico";
import  SearchResult  from "@/components/SearchResultsPaciente";
import { LandingNav } from "@/components/LandingNav";
import { Separator } from "@/components/ui/separator";
import ActionBar from "@/components/ActionBar";
import { useState } from "react";
import { MedicoQuery } from "@/types/medicoQueryType";
import SearchService from "@/services/searchService";
import { Icons } from "@/components/ui/icons";
import Pagination from "@/components/Pagination";
import { useSearch } from "@/contexts/searchContext";


export default function BuscaMedico() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const { medicoSearch, setMedicoSearch } = useSearch();
    const location = useLocation();

    useEffect(() => {
        return () => {
            if (!location.pathname.includes('studydetails')){
                setMedicoSearch({filters: {}, resultsData: [], page: '1', totalPages: 0});
            }
        }
    }, [location.pathname, setMedicoSearch]);

    const handlePageChange = (page: string) => {
        setMedicoSearch({...medicoSearch, page: page});
        const searchFilters = {...medicoSearch.filters, page: page};
        handleSearch(searchFilters);
    }

    const handleSearch = async (filters: MedicoQuery) => {
        setLoading(true);

        setMedicoSearch(prevState => {
            const page = filters.page || prevState.page || '1';
            const searchFilters = {...filters};
            return {
                ...prevState, 
                filters: searchFilters, 
                page: page
            };
        });

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
                    console.error(error);
                }
            });
            console.log(response)
            setMedicoSearch(prevState => ({
                ...prevState,
                resultsData: response.studies,
                totalPages: response.totalPages,
            }));

            setHasSearched(true);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen mx-auto">
            <LandingNav isLoggedIn={Boolean(localStorage.getItem('token'))} />
            <Separator className="bgColor-brandDark mt-5" />
            <div className="max-w-screen-xl mx-auto px-6 py-12">
                <SearchHeader />
                <main>
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
                            <SearchResult resultsData={medicoSearch.resultsData} />
                            <Pagination page={medicoSearch.page.toString()} handlePageChange={handlePageChange} totalPages={medicoSearch.totalPages} />
                            <ActionBar studies={medicoSearch.resultsData} />
                        </>
                    ) : null}
                </main>
            </div>
        </div>
    );
}
