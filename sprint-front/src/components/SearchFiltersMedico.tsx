import React, { useState, useRef } from 'react';
import { MedicoQuery } from '@/types/medicoQueryType';
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import { useSearch } from '@/contexts/searchContext';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

interface SearchFiltersMedicoProps {
  onSearch: (filters: MedicoQuery) => void;
}

  const SearchFiltersMedico: React.FC<SearchFiltersMedicoProps> = ({ onSearch }) => {
    const [localFilters, setLocalFilters] = useState<MedicoQuery>({
      keywords: "",
      condition: "",
      status: [""],
      location: "",
      intervention: '',
      sponsor: '',
      age: '',
      sex: '',
      acceptsHealthyVolunteers: undefined,
      studyPhase: '',
      studyType: '',
      hasResults: undefined,
      organization: '',
      studyId: '',
    });

    const { medicoSearch, setMedicoSearch } = useSearch();

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
        }));medicoSearch
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setLocalFilters((prevFilters) => ({
        ...prevFilters,
        [name]: name === "status" ? [value] : value,
      }));
    };

    const handleSearch = () => {
      setMedicoSearch({...medicoSearch, filters: localFilters});
      onSearch(localFilters);
    }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Estudo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Condição</label>
            <input
              type="text"
              name="condition"
              value={localFilters.condition}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite a condição"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Intervenção</label>
            <input
              type="text"
              name="intervention"
              value={localFilters.intervention}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite a intervenção"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Estudo</label>
            <select
              name="studyType"
              value={localFilters.studyType}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione</option>
              <option value="INTERVENTIONAL">Intervencional</option>
              <option value="OBSERVATIONAL">Observacional</option>
              <option value="EXPANDED_ACCESS">Acesso Expandido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fase do Estudo</label>
            <select
              name="studyPhase"
              value={localFilters.studyPhase}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione</option>
              <option value="EARLY_PHASE1">Fase 1 Inicial</option>
              <option value="PHASE1">Fase 1</option>
              <option value="PHASE2">Fase 2</option>
              <option value="PHASE3">Fase 3</option>
              <option value="PHASE4">Fase 4</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Critérios de Elegibilidade</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Idade</label>
            <select
              name="age"
              value={localFilters.age}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione</option>
              <option value="child">Criança</option>
              <option value="adult">Adulto</option>
              <option value="senior">Idoso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sexo</label>
            <select
              name="sex"
              value={localFilters.sex}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Selecione</option>
              <option value="m">Masculino</option>
              <option value="f">Feminino</option>
              <option value="all">Todos</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptsHealthyVolunteers"
              checked={localFilters.acceptsHealthyVolunteers}
              onChange={(e) => handleInputChange(e as any)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Aceita Voluntários Saudáveis</label>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Localização e Organização</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Localização</label>
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places']}>
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <input
                  type="text"
                  name="location"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Digite um local"
                  value={localFilters.location}
                  onChange={handleInputChange}
                />
              </Autocomplete>
            </LoadScript>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Patrocinador</label>
            <input
              type="text"
              name="sponsor"
              value={localFilters.sponsor}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite o patrocinador"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organização</label>
            <input
              type="text"
              name="organization"
              value={localFilters.organization}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite a organização"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Outros Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={localFilters.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Todos os status</option>
              <option value="RECRUITING">Recrutando</option>
              <option value="TERMINATED">Planejado</option>
              <option value="COMPLETED">Concluído</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasResults"
              checked={medicoSearch.filters.hasResults}
              onChange={(e) => handleInputChange(e as any)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Possui Resultados</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ID do Estudo</label>
            <input
              type="text"
              name="studyId"
              value={localFilters.studyId}  
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Digite o ID do estudo"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mb-8"
          onClick={handleSearch}
        >
          Pesquisar
        </button>
      </div>
  </>
  );
};

export default SearchFiltersMedico;
