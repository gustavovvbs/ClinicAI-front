import React, { useState } from "react";
import { CreateStudy } from "@/types/studyTypes";
import StudyService from "@/services/studyService";

function registraPesquisa() {
  const [formData, setFormData] = useState<CreateStudy>({
    Title: "",
    Description: "",
    Interventions: [
      {
        explanation: "",
        interventionType: "",
        description: "",
        label: "",
      },
    ],
    InterventionNames: [],
    Sponsor: "",
    FunderType: "",
    Organization: "",
    StartDate: "",
    endDate: "",
    Keywords: [""],
    Location: [
      { Facility: "", City: "", State: "", Country: "", Status: "RECRUITING" },
    ],
    Conditions: [],
    MinimumAge: "",
    MaximumAge: "",
    Restrictions: "",
    Sex: "",
    StudyType: "",
    Phase: [],
    HealthyVolunteers: true,
    Contacts: [{ email: "", name: "", phone: "", role: "" }],
    Researchers: [{ name: "", affiliation: "", role: "" }],
    PrimaryCompletionDate: "",
    LastUpdatedPostDate: "",
    HasPublishedResults: false,
    Status: [""]
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddField = <K extends keyof CreateStudy>(
    field: K,
    item: CreateStudy[K] extends Array<infer U> ? U : never
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] instanceof Array 
      ? [...prev[field], item]
      : prev[field],
    }));
  };

  const handleRemoveField = <K extends keyof CreateStudy>(
    field: K,
    indexToRemove: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] instanceof Array 
      ? prev[field].filter((_, i) => i !== indexToRemove)
      : prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSend = {
        Title: formData.Title,
        Description: formData.Description,
        Interventions: formData.Interventions.map((intervention) => ({
          explanation: intervention.explanation,
          interventionType: intervention.interventionType,
          description: intervention.description,
          label: intervention.label,
        })),
        InterventionNames: formData.InterventionNames,
        Sponsor: formData.Sponsor,
        FunderType: formData.FunderType,
        Organization: formData.Organization,
        StartDate: formData.StartDate, // "YYYY-MM-DD"
        endDate: formData.endDate,       // "YYYY-MM-DD"
        Keywords: formData.Keywords,
        // Status: formData.Status,         // Array, e.g., ["Recruiting"]
        Location: formData.Location.map((location) => ({
          Facility: location.Facility,
          City: location.City,
          State: location.State,
          Country: location.Country,
          Status: location.Status,
        })),
        Conditions: formData.Conditions,
        MinimumAge: formData.MinimumAge,         // e.g., "18"
        MaximumAge: formData.MaximumAge,         // e.g., "65"
        Restrictions: formData.Restrictions,
        Sex: formData.Sex,
        StudyType: formData.StudyType,
        Phase: formData.Phase,                   // Array, e.g., ["PHASE1"]
        HealthyVolunteers: formData.HealthyVolunteers, // Boolean
        Contacts: formData.Contacts.map((contact) => ({
          name: contact.name,
          role: contact.role,
          phone: contact.phone,
          email: contact.email,
        })),
        Researchers: formData.Researchers.map((researcher) => ({
          name: researcher.name,
          affiliation: researcher.affiliation,
          role: researcher.role,
        })),
        PrimaryCompletionDate: formData.PrimaryCompletionDate, // "YYYY-MM-DD"
        LastUpdatedPostDate: formData.LastUpdatedPostDate,     // "YYYY-MM-DD"
        HasPublishedResults: formData.HasPublishedResults,     // Boolean
        // sub_status: formData.sub_status,                       // e.g., "pending"
        Status: formData.Status
      };

      await StudyService.createStudy(dataToSend);

      // Opcional: Redefinir o formulário
      setFormData({
        Title: "",
        Description: "",
        Interventions: [
          {
            explanation: "",
            interventionType: "",
            description: "",
            label: "",
          },
        ],
        InterventionNames: [],
        Sponsor: "",
        FunderType: "",
        Organization: "",
        StartDate: "",
        endDate: "",
        Keywords: [],
        // Status: [],
        Location: [
          { Facility: "", City: "", State: "", Country: "", Status: "RECRUITING"},
        ],
        Conditions: [],
        MinimumAge: "",
        MaximumAge: "",
        Restrictions: "",
        Sex: "",
        StudyType: "",
        Phase: [],
        HealthyVolunteers: true,
        Contacts: [{ email: "", name: "", phone: "", role: "" }],
        Researchers: [{ name: "", affiliation: "", role: "" }],
        PrimaryCompletionDate: "",
        LastUpdatedPostDate: "",
        HasPublishedResults: false,
        Status: [""]
      });
    } catch (err) {
      console.error("Erro ao criar estudo:", err);
      // setError("Ocorreu um erro ao criar o estudo. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-white rounded shadow-md max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-6 text-left">Criar Estudo</h1>

      {/* Feedback ao usuário */}
      {loading && (
        <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 p-4 rounded">
          <svg
            className="animate-spin h-5 w-5 text-blue-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Carregando...</span>
        </div>
      )}
      {error && (
        <div className="flex items-center space-x-2 bg-red-100 text-red-700 p-4 rounded">
          <svg
            className="h-5 w-5 text-red-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center space-x-2 bg-green-100 text-green-700 p-4 rounded">
          <svg
            className="h-5 w-5 text-green-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Seção: Informações Básicas */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Informações Básicas</h2>
        <div>
          <label className="block font-medium mb-1">Título</label>
          <input
            type="text"
            name="Title"
            value={formData.Title}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            required
            placeholder="Digite o título do estudo"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Descrição</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            required
            placeholder="Descreva o estudo"
          />
        </div>
      </div>

      {/* Seção: Intervenções */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Intervenções</h2>
        {formData.Interventions.map((intervention, index) => (
          <div key={index} className="flex flex-wrap -mx-2 items-center bg-gray-50 p-4 rounded">
            <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
              <label className="block font-medium mb-1">Descrição</label>
              <input
                type="text"
                placeholder="Descrição"
                value={intervention.description || ""}
                onChange={(e) =>
                  setFormData((prev) => {
                    const newInterventions = [...prev.Interventions];
                    newInterventions[index] = {
                      ...newInterventions[index],
                      description: e.target.value,
                    };
                    return { ...prev, Interventions: newInterventions };
                  })
                }
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
              <label className="block font-medium mb-1">Tipo</label>
              <input
                type="text"
                placeholder="Tipo"
                value={intervention.interventionType}
                onChange={(e) => {
                  const newInterventions = [...formData.Interventions];
                  newInterventions[index].interventionType = e.target.value;
                  setFormData({ ...formData, Interventions: newInterventions });
                }}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="w-full md:w-1/4 px-2 mb-4 md:mb-0">
              <label className="block font-medium mb-1">Explicação</label>
              <input
                type="text"
                placeholder="Explicação"
                value={intervention.explanation}
                onChange={(e) => {
                  const newInterventions = [...formData.Interventions];
                  newInterventions[index].explanation = e.target.value;
                  setFormData({ ...formData, Interventions: newInterventions });
                }}
                className="border p-2 w-full rounded"
              />
            </div>
            <div className="w-full md:w-1/4 px-2 flex items-center">
              <div className="w-full">
                <label className="block font-medium mb-1">Label</label>
                <input
                  type="text"
                  placeholder="Label"
                  value={intervention.label}
                  onChange={(e) => {
                    const newInterventions = [...formData.Interventions];
                    newInterventions[index].label = e.target.value;
                    setFormData({ ...formData, Interventions: newInterventions });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveField("Interventions", index)}
                className="text-red-500 mt-6 ml-2"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAddField("Interventions", {
              explanation: "",
              interventionType: "",
              description: "",
              label: "",
            })
          }
          className="text-blue-500"
        >
          + Adicionar Intervenção
        </button>
      </div>

      {/* Seção: InterventionNames */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Nomes das Intervenções</h2>
        {formData.InterventionNames.map((name, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Nome da Intervenção"
              value={name || ""}
              onChange={(e) =>
                setFormData((prev) => {
                  const newNames = [...prev.InterventionNames];
                  newNames[index] = e.target.value;
                  return { ...prev, InterventionNames: newNames };
                })
              }
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveField("InterventionNames", index)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("InterventionNames", "")}
          className="text-blue-500"
        >
          + Adicionar Nome de Intervenção
        </button>
      </div>

      {/* Seção: Patrocinadores */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Patrocinadores</h2>
        <div>
          <label className="block font-medium mb-1">Patrocinador</label>
          <input
            type="text"
            name="Sponsor"
            value={formData.Sponsor}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite o patrocinador"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Tipo de Financiador</label>
          <input
            type="text"
            name="FunderType"
            value={formData.FunderType}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite o tipo de financiador"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Organização</label>
          <input
            type="text"
            name="Organization"
            value={formData.Organization}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a organização"
          />
        </div>
      </div>

      {/* Seção: Palavras-chave */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Palavras-chave</h2>
        {formData.Keywords.map((keyword, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Palavra-chave"
              value={keyword || ""}
              onChange={(e) =>
                setFormData((prev) => {
                  const newKeywords = [...prev.Keywords];
                  newKeywords[index] = e.target.value;
                  return { ...prev, Keywords: newKeywords };
                })
              }
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveField("Keywords", index)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("Keywords", "")}
          className="text-blue-500"
        >
          + Adicionar Palavra-chave
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Status</h2>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="Status"
            value={formData.Status[0] || ""}
            onChange={(e) =>
              setFormData({ ...formData, Status: [e.target.value] })
            }
            className="border p-3 w-full rounded"
          >
            <option value="">Selecione o status</option>
            <option value="Recruiting">Recruiting</option>
            <option value="Completed">Completed</option>
            <option value="Not yet recruiting">Not yet recruiting</option>
          </select> 
        </div>
      </div> 

      {/* Seção: Localização */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Localização</h2>
        {formData.Location.map((location, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded space-y-2">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Instalação</label>
                <input
                  type="text"
                  placeholder="Instalação"
                  name={`Location.${index}.Facility`}
                  value={location.Facility}
                  onChange={(e) => {
                    const newLocations = [...formData.Location];
                    newLocations[index].Facility = e.target.value;
                    setFormData({ ...formData, Location: newLocations });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="Cidade"
                  name={`Location.${index}.City`}
                  value={location.City}
                  onChange={(e) => {
                    const newLocations = [...formData.Location];
                    newLocations[index].City = e.target.value;
                    setFormData({ ...formData, Location: newLocations });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Estado</label>
                <input
                  type="text"
                  placeholder="Estado"
                  name={`Location.${index}.State`}
                  value={location.State}
                  onChange={(e) => {
                    const newLocations = [...formData.Location];
                    newLocations[index].State = e.target.value;
                    setFormData({ ...formData, Location: newLocations });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">País</label>
                <input
                  type="text"
                  placeholder="País"
                  name={`Location.${index}.Country`}
                  value={location.Country}
                  onChange={(e) => {
                    const newLocations = [...formData.Location];
                    newLocations[index].Country = e.target.value;
                    setFormData({ ...formData, Location: newLocations });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Status</label>
                <input
                  type="text"
                  placeholder="Status"
                  name={`Location.${index}.Status`}
                  value={location.Status}
                  onChange={(e) => {
                    const newLocations = [...formData.Location];
                    newLocations[index].Status = e.target.value;
                    setFormData({ ...formData, Location: newLocations });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleRemoveField("Location", index)}
                className="text-red-500 ml-4 mt-6"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAddField("Location", {
              Facility: "",
              City: "",
              State: "",
              Country: "",
              Status: "",
            })
          }
          className="text-blue-500"
        >
          + Adicionar Localização
        </button>
      </div>

      {/* Seção: Condições */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Condições</h2>
        {formData.Conditions.map((condition, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Condição"
              value={condition || ""}
              onChange={(e) =>
                setFormData((prev) => {
                  const newConditions = [...prev.Conditions];
                  newConditions[index] = e.target.value;
                  return { ...prev, Conditions: newConditions };
                })
              }
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={() => handleRemoveField("Conditions", index)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("Conditions", "")}
          className="text-blue-500"
        >
          + Adicionar Condição
        </button>
      </div>

      {/* Seção: Critérios de Idade */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Critérios de Idade</h2>
        <div>
          <label className="block font-medium mb-1">Idade Mínima</label>
          <input
            type="number"
            name="MinimumAge"
            value={formData.MinimumAge}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a idade mínima"
            min="0"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Idade Máxima</label>
          <input
            type="number"
            name="MaximumAge"
            value={formData.MaximumAge}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a idade máxima"
            min="0"
          />
        </div>
      </div>

      {/* Seção: Restrições */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Restrições</h2>
        <div>
          <label className="block font-medium mb-1">Restrições</label>
          <textarea
            name="Restrictions"
            value={formData.Restrictions}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Descreva as restrições"
          />
        </div>
      </div>

      {/* Seção: Sexo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sexo</h2>
        <div>
          <label className="block font-medium mb-1">Sexo</label>
          <select
            name="Sex"
            value={formData.Sex}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          >
            <option value="">Selecione</option>
            <option value="Male">Masculino</option>
            <option value="Female">Feminino</option>
            <option value="All">Todos</option>
          </select>
        </div>
      </div>

      {/* Seção: Tipo de Estudo */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Tipo de Estudo</h2>
        <div>
          <label className="block font-medium mb-1">Tipo de Estudo</label>
          <input
            type="text"
            name="StudyType"
            value={formData.StudyType}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite o tipo de estudo"
          />
        </div>
      </div>

      {/* Seção: Fase */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Fase</h2>
        <div>
          <label className="block font-medium mb-1">Fase do Estudo</label>
          <select
            name="Phase"
            value={formData.Phase[0] || ""}
            onChange={(e) =>
              setFormData({ ...formData, Phase: [e.target.value] })
            }
            className="border p-3 w-full rounded"
          >
            <option value="">Selecione a Fase</option>
            <option value="PHASE1">PHASE1</option>
            <option value="PHASE2">PHASE2</option>
            <option value="PHASE3">PHASE3</option>
            <option value="PHASE4">PHASE4</option>
            {/* Adicione outras opções conforme necessário */}
          </select>
        </div>
      </div>

      {/* Seção: Voluntários Saudáveis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Voluntários Saudáveis</h2>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="HealthyVolunteers"
            checked={formData.HealthyVolunteers}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label>O estudo aceita voluntários saudáveis?</label>
        </div>
      </div>

      {/* Seção: Contatos */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Contatos</h2>
        {formData.Contacts.map((contact, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded space-y-2">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={contact.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const newContacts = [...prev.Contacts];
                      newContacts[index] = {
                        ...newContacts[index],
                        name: e.target.value,
                      };
                      return { ...prev, Contacts: newContacts };
                    })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...formData.Contacts];
                    newContacts[index].email = e.target.value;
                    setFormData({ ...formData, Contacts: newContacts });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <label className="block font-medium mb-1">Telefone</label>
                <input
                  type="text"
                  placeholder="Telefone"
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...formData.Contacts];
                    newContacts[index].phone = e.target.value;
                    setFormData({ ...formData, Contacts: newContacts });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/2 px-2 flex items-center">
                <div className="w-full">
                  <label className="block font-medium mb-1">Papel</label>
                  <input
                    type="text"
                    placeholder="Papel"
                    value={contact.role}
                    onChange={(e) => {
                      const newContacts = [...formData.Contacts];
                      newContacts[index].role = e.target.value;
                      setFormData({ ...formData, Contacts: newContacts });
                    }}
                    className="border p-2 w-full rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveField("Contacts", index)}
                  className="text-red-500 ml-2 mt-6"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAddField("Contacts", {
              email: "",
              name: "",
              phone: "",
              role: "",
            })
          }
          className="text-blue-500"
        >
          + Adicionar Contato
        </button>
      </div>

      {/* Seção: Pesquisadores */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Pesquisadores</h2>
        {formData.Researchers.map((researcher, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded space-y-2">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full md:w-1/3 px-2">
                <label className="block font-medium mb-1">Nome</label>
                <input
                  type="text"
                  placeholder="Nome"
                  value={researcher.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => {
                      const newResearchers = [...prev.Researchers];
                      newResearchers[index] = {
                        ...newResearchers[index],
                        name: e.target.value,
                      };
                      return { ...prev, Researchers: newResearchers };
                    })
                  }
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <label className="block font-medium mb-1">Afiliação</label>
                <input
                  type="text"
                  placeholder="Afiliação"
                  value={researcher.affiliation}
                  onChange={(e) => {
                    const newResearchers = [...formData.Researchers];
                    newResearchers[index].affiliation = e.target.value;
                    setFormData({ ...formData, Researchers: newResearchers });
                  }}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 flex items-center">
                <div className="w-full">
                  <label className="block font-medium mb-1">Papel</label>
                  <input
                    type="text"
                    placeholder="Papel"
                    value={researcher.role}
                    onChange={(e) => {
                      const newResearchers = [...formData.Researchers];
                      newResearchers[index].role = e.target.value;
                      setFormData({ ...formData, Researchers: newResearchers });
                    }}
                    className="border p-2 w-full rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveField("Researchers", index)}
                  className="text-red-500 ml-2 mt-6"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAddField("Researchers", {
              name: "",
              affiliation: "",
              role: "",
            })
          }
          className="text-blue-500"
        >
          + Adicionar Pesquisador
        </button>
      </div>


      {/* Seção: Datas Importantes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Datas Importantes</h2>
        <div>
          <label className="block font-medium mb-1">Data de Início</label>
          <input
            type="date"
            name="StartDate"
            value={formData.StartDate}
            onChange={handleChange}  
            className="border p-3 w-full rounded"
            placeholder="Digite a data de início"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Data de Conclusão</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a data de conclusão"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Data Primária de Conclusão</label>
          <input
            type="date"
            name="PrimaryCompletionDate"
            value={formData.PrimaryCompletionDate}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a data primária de conclusão"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Última Atualização</label>
          <input
            type="date"
            name="LastUpdatedPostDate"
            value={formData.LastUpdatedPostDate}
            onChange={handleChange}
            className="border p-3 w-full rounded"
            placeholder="Digite a última atualização"
          />
        </div>
      </div>

      {/* Botão de Submissão */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded w-full hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Criando Estudo..." : "Criar Estudo"}
        </button>
      </div>
    </form>
  );
}


export default registraPesquisa;