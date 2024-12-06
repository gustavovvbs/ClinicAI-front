import React, { useState, useRef } from 'react';
import { PacientQuery } from '@/types/pacientQueryType';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useSearch } from "@/contexts/searchContext"

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface SearchFiltersPacienteProps {
  onSearch: (query: PacientQuery) => void;
}

const SearchFiltersPaciente: React.FC<SearchFiltersPacienteProps> = ({ onSearch }) => {
    const [localFilters, setLocalFilters] = useState<PacientQuery>({
      keywords: "",
      condition: "",
      status: [""],
      location: ""
    });

    const { generalSearch, setGeneralSearch } = useSearch();
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
      autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        setLocalFilters((prev) => ({
          ...prev,
          location: place.formatted_address || '',
        }));
      }
    };

    const clearFilters = () => {
      setGeneralSearch({...generalSearch, filters: {
        keywords: "",
        condition: "",
        status: [""],
        location: "",
        intervention: "",
        sponsor: "",
      }});
      onSearch({
        keywords: "",
        condition: "",
        status:[""],
        location: "",
        intervention: "",
        sponsor: "",
      });
    };

    const handleSearchClick = () => {
      setGeneralSearch({...generalSearch, filters: localFilters});
      onSearch(localFilters);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalFilters(prev => ({
        ...prev,
        [name]: name === 'status' ? [value] : value,
      }));
    };

    return (
      <>
        <div className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brandGray"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            name="keywords"
            value={localFilters.keywords}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-brandLightBlue focus:ring-4 focus:ring-brandLightBlue/20"
            placeholder="Busque por condição, tratamento ou palavra-chave"
            onChange={handleFilterChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brandDark">Condição</label>
            <input
              type="text"
              name="condition"
              className="appearance-none py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brandLightBlue focus:ring-4 focus:ring-brandLightBlue/20"
              value={localFilters.condition}
              onChange={handleFilterChange}
              placeholder="Digite a condição para buscar"
            >
            </input>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brandDark">Status</label>
            <select
              name="status"
              className="appearance-none py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brandLightBlue focus:ring-4 focus:ring-brandLightBlue/20"
              value={localFilters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos os status</option>
              <option value="RECRUITING">Recrutando</option>
              <option value="TERMINATED">Planejado</option>
              <option value="COMPLETED">Concluído</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brandDark">Tipo de Intervenção</label>
            <input
              type="text"
              name="studyType"
              className="appearance-none py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brandLightBlue focus:ring-4 focus:ring-brandLightBlue/20"
              onChange={handleFilterChange}
              placeholder="Digite o tipo de intervenção para buscar"
            >
            </input>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium text-brandDark">Localização</label>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
            >
              <input
                type="text"
                name="location"
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:border-brandLightBlue focus:ring-4 focus:ring-brandLightBlue/20"
                placeholder="Digite um local"
                value={localFilters.location}
                onChange={handleFilterChange}
              />
            </Autocomplete>
          </LoadScript>
        </div>

        <div className="flex justify-end gap-4 mt-5 mb-10">
          <button
            className="px-6 py-3 bg-gray-200 text-brandDark rounded-lg hover:bg-gray-300 transition-colors"
            onClick={clearFilters}
          >
            Limpar Filtros
          </button>
          <button
            className="px-6 py-3 bg-brandLightBlue text-white rounded-lg hover:bg-brandDarkBlue transition-colors"
            onClick={handleSearchClick}
          >
            Pesquisar
          </button>
        </div>
      </>
    );
  };

export default SearchFiltersPaciente;
