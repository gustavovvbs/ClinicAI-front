import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchHeader from "@/components/SearchHeaderPaciente";
import SearchFiltersPaciente from "@/components/SearchFiltersPaciente";
import SearchResult from "@/components/SearchResultsPaciente";
import { LandingNav } from "@/components/LandingNav";
import { Separator } from "@/components/ui/separator";
import ActionBar from "@/components/ActionBar";
import { PacientQuery } from "@/types/pacientQueryType";
import SearchService from "@/services/searchService";
import { Icons } from "@/components/ui/icons";
import Pagination from "@/components/Pagination";
import { useSearch } from "@/contexts/searchContext";

export default function BuscaPaciente() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const { generalSearch, setGeneralSearch } = useSearch();
    const location = useLocation();    

    useEffect(() => {
        return () => {
            if (!location.pathname.includes('studydetails') && !location.pathname.includes('busca-paciente')) {
                setGeneralSearch({
                    filters: {},
                    resultsData: [],
                    page: '1',
                    totalPages: 0
                });
            }
        };
    }, [location.pathname, setGeneralSearch]);

    const handlePageChange = (page: string) => {
        const searchFilters = { ...generalSearch.filters, page: page };
        handleSearch(searchFilters);
    };

    const handleSearch = async (filters: PacientQuery) => {
        setLoading(true);

        setGeneralSearch(prevState => {
            const page = filters.page || prevState.page || '1';
            const searchFilters = { ...filters };
            return {
                ...prevState,
                filters: searchFilters,
                page: page,
            };
        });

        const filteredFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => {
                if (value === "" || value === null) return false;
                if (Array.isArray(value)) return value[0].length > 0;
                return Boolean(value);                
            }
            )) as PacientQuery;

        try {
            const response = await SearchService.searchPaciente(filteredFilters);
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
            }
            );
            console.log(response)
            setGeneralSearch(prevState => ({
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

    console.log(generalSearch.resultsData)
    return (
        <div className="max-w-screen mx-auto">
            <LandingNav isLoggedIn={Boolean(localStorage.getItem('token'))} />
            <Separator className="bgColor-brandDark mt-5" />
            <div className="max-w-screen-xl mx-auto px-6 py-12 ">
                <SearchHeader />
                <main>
                    <SearchFiltersPaciente onSearch={handleSearch} />
                    {isLoading ? (
                        <div className="flex items-center justify-center py-10">
                            <Icons.spinner className="w-6 h-6 animate-spin" />
                        </div>
                    ) : hasSearched && generalSearch.resultsData.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-lg text-gray-500">
                                Nenhum resultado encontrado para os filtros selecionados.
                            </p>
                        </div>
                    ) : generalSearch.resultsData.length > 0 ? (
                        <>
                            <SearchResult resultsData={generalSearch.resultsData} />
                            <ActionBar studies={generalSearch.resultsData} />
                            <Pagination
                                page={generalSearch.page.toString()}
                                handlePageChange={handlePageChange}
                                totalPages={generalSearch.totalPages}
                            />
                        </>
                    ) : null}
                </main>
            </div>
        </div>
    );
}
