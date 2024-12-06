import React, { useState } from 'react';
import { BaseStudyType } from '@/types/studyTypes';
import emailService from '@/services/emailService';
import excelService from '@/services/excelService';
import pdfService from '@/services/pdfService'; // Importa o serviço de PDF

interface ActionBarProps {
  studies: BaseStudyType[];
}

const ActionBar: React.FC<ActionBarProps> = ({ studies }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSendEmail = async () => {
    setIsSending(true);
    setError(null);
    try {
      await emailService.sendEmail(email, studies);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Falha ao enviar o e-mail. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await excelService.getExcelFile(studies);

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'estudos.xlsx');
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await pdfService.getPdfFile(studies);

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_estudos.pdf');
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 bg-transparent border-gray-200 z-0 w-full pointer-events-none">
        <div className="max-w-screen-xl mx-auto px-10 py-3 flex justify-end gap-4">
          <button
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-gray-300 bg-brandWhite rounded-lg text-brandDark hover:bg-gray-100"
            title="Exportar para Excel"
            onClick={handleExportExcel}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3V21M12 21L7 16M12 21L17 16M4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Exportar para Excel
          </button>
          <button
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-gray-300 bg-brandWhite rounded-lg text-brandDark hover:bg-gray-100"
            title="Exportar para PDF"
            onClick={handleExportPdf}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3V21M12 21L7 16M12 21L17 16M4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Exportar para PDF
          </button>
          <button
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 border border-gray-300 bg-brandWhite rounded-lg text-brandDark hover:bg-gray-100"
            title="Compartilhar por Email"
            onClick={() => setIsModalOpen(true)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M4 4H20V18H4V4Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Compartilhar por Email
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setIsModalOpen(false);
                setError(null);
                setSuccess(false);
                setEmail('');
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-xl mb-4">Exportar Busca Por Email</h2>
            {success ? (
              <div className="text-green-600 mb-4">E-mail enviado com sucesso!</div>
            ) : (
              <>
                <label className="block mb-2">
                  <span className="text-gray-700">Seu Email</span>
                  <input
                    type="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="exemplo@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded-lg"
                    onClick={() => {
                      setIsModalOpen(false);
                      setError(null);
                      setSuccess(false);
                      setEmail('');
                    }}
                    disabled={isSending}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleSendEmail}
                    disabled={isSending || !email}
                  >
                    {isSending ? (
                      <span className="flex items-center gap-1">
                        Enviando
                        <span className="flex">
                          <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                          <span className="animate-bounce [animation-delay:-0.2s]">.</span>
                          <span className="animate-bounce [animation-delay:-0.1s]">.</span>
                        </span>
                      </span>
                    ) : (
                      'Enviar'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ActionBar;
