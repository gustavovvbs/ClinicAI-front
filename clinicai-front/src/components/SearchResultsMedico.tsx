import React  from 'react';
import { BaseStudyType } from '@/types/studyTypes';
import{ useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    RECRUITING: {
      color: 'bg-green-500',
      text: 'Recrutando',
    },
    COMPLETED: {
      color: 'bg-brandDarkBlue',
      text: 'Concluído',
    },
    ACTIVE_NOT_RECRUITING: {
      color: 'bg-yellow-500',
      text: 'Ativo (Não Recrutando)',
    },
    ENROLLING_BY_INVITATION: {
      color: 'bg-blue-400',
      text: 'Recrutando por Convite',
    },
    NOT_YET_RECRUITING: {
      color: 'bg-purple-500',
      text: 'Ainda não Recrutando',
    },
    SUSPENDED: {
      color: 'bg-red-500',
      text: 'Suspenso',
    },
    TERMINATED: {
      color: 'bg-gray-600',
      text: 'Terminado',
    },
    WITHDRAWN: {
      color: 'bg-red-700',
      text: 'Retirado',
    },
    UNKNOWN: {
      color: 'bg-gray-400',
      text: 'Desconhecido',
    },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.UNKNOWN;

  return (
    <span
      className={`inline-block px-3 py-1 ${config.color} text-brandWhite rounded-full text-sm font-medium mb-4`}
    >
      {config.text}
    </span>
  );
};

interface SearchResultsPacientProps {
  resultsData: BaseStudyType[];
}

const SearchResult: React.FC<SearchResultsPacientProps> = ({ resultsData }) => {
  const navigate = useNavigate();

  const handleViewDetails = (study: BaseStudyType) => {
    navigate('/studydetails', { state: study }); 
  }


  return (
    <>
      <div className="grid gap-6">
        {resultsData.map((result) => (
          <article
            className="p-6 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-shadow shadow-sm hover:shadow-md">
            <StatusBadge status={result.Location[0].Status} />
            <h2 className="text-xl font-semibold text-brandDark mb-4">{result.Title}</h2>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-brandDark"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                <span className="text-sm font-semibold text-brandDark">Localizações</span>
              </div>

              <hr className="my-4 border-brandDark" />
              <div className="pl-6">
                {result.Location.map((location, index) => (
                  <div key={index} className="mb-2">
                    <span className="block text-brandDark">
                      {location.City}, {location.Country}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-brandDark"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-semibold text-brandDark">Condições</span>
              </div>
              <hr className="my-4 border-brandDark" />
              <div className="pl-6">
                {result.Conditions.map((condition: string, index: number) => (
                  <span key={index} className="text-brandDark">
                    {condition}
                    <br />
                  </span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden mb-6">
              <p className="text-sm text-brandGray line-clamp-3">{result.Description}</p>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>

           <button
                        onClick={() => handleViewDetails(result)}
                        className="inline-flex items-center text-brandLightBlue font-medium text-sm hover:underline"
                    >
                        Ver detalhes
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
          </article>
        ))}

      </div>
    </>
  );
};



export default SearchResult;
