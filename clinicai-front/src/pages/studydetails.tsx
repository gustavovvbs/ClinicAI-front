import { useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-hsl.png'; // Ajuste o caminho conforme necessário

const StudyDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const studyData = location.state;

    if (typeof studyData.Location === 'string') {
        studyData.Location = JSON.parse(studyData.Location);
        studyData.Contacts = JSON.parse(studyData.Contacts);
        studyData.Researchers = JSON.parse(studyData.Researchers);
        studyData.Interventions = JSON.parse(studyData.Interventions);
        studyData.Conditions = JSON.parse(studyData.Conditions);
        studyData.InterventionNames = JSON.parse(studyData.InterventionNames);
        studyData.Phase = JSON.parse(studyData.Phase);
    }
 

    if (!studyData) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
                    <p className="text-gray-600">Os detalhes do estudo não foram fornecidos.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4 relative">
            {/* Adicionando o logo no canto superior esquerdo */}
            <div className="absolute top-4 left-4">
                <img src={logo} alt="Logo HSL" className="h-12 w-auto" />
            </div>

            <div className="bg-white max-w-5xl mx-auto p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-brandDarkBlue mb-6">
                    {studyData.Title || 'Título não disponível'}
                </h1>
                <p className="text-gray-600 mb-8">{studyData.Description || 'Descrição não disponível'}</p>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">Localização</h2>
                {studyData.Location && Array.isArray(studyData.Location) ? (
                    studyData.Location.map((loc: any, index: number) => (
                        <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p><strong>Instalação:</strong> {loc.Facility || 'Local não especificado'}</p>
                            <p><strong>Cidade:</strong> {loc.City || 'Não especificado'}</p>
                            <p><strong>Estado:</strong> {loc.State || 'Não especificado'}</p>
                            <p><strong>País:</strong> {loc.Country || 'Não especificado'}</p>
                            <p><strong>Status:</strong> {loc.Status || 'Status desconhecido'}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Localização não disponível.</p>
                )}

                <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Detalhes</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-3">
                    <li>
                        <strong>Tipo de Doença:</strong>{' '}
                        {studyData.Conditions && studyData.Conditions.length > 0
                            ? studyData.Conditions.join(', ')
                            : 'Não especificado'}
                    </li>
                    <li>
                        <strong>Sponsor:</strong> {studyData.Sponsor || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Data de Início:</strong> {studyData.StartDate?.date || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Data de Término:</strong> {studyData.endDate?.date || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Tipo de Estudo:</strong> {studyData.StudyType || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Fases:</strong> {studyData.Phase || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Pesquisadores:</strong>{' '}
                        {studyData.Researchers && studyData.Researchers.length > 0 ? (
                            studyData.Researchers.map((researcher: any, index: number) => (
                                <span key={index}>
                                    {researcher.name} ({researcher.role}) - {researcher.affiliation || 'Sem afiliação'} <br />
                                </span>
                            ))
                        ) : (
                            'Não especificado'
                        )}
                    </li>
                    <li>
                        <strong>Contatos:</strong>{' '}
                        {studyData.Contacts && studyData.Contacts.length > 0 ? (
                            studyData.Contacts.map((contact: any, index: number) => (
                                <span key={index}>
                                    {contact.name} ({contact.role}) - {contact.email}, {contact.phone || 'Sem telefone'} <br />
                                </span>
                            ))
                        ) : (
                            'Não especificado'
                        )}
                    </li>
                    <li>
                        <strong>Critérios de Elegibilidade:</strong> {studyData.Restrictions || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Idade Mínima:</strong> {studyData.MinimumAge || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Idade Máxima:</strong> {studyData.MaximumAge || 'Não especificado'}
                    </li>
                    <li>
                        <strong>Medicações Utilizadas:</strong>{' '}
                        {studyData.InterventionNames && studyData.InterventionNames.length > 0
                            ? studyData.InterventionNames.join(', ')
                            : 'Não especificado'}
                    </li>
                    <li>
                        <strong>Publicação de Resultados:</strong>{' '}
                        {studyData['Has Results Published'] ? 'Sim' : 'Não'}
                    </li>
                </ul>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Voltar
                </button>
            </div>
        </div>
    );
};

export default StudyDetails;
