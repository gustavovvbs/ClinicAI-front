import ChatService from "@/services/chatService";
import { ChatMessage, Message } from "@/types/chatTypes";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LandingNav } from "@/components/LandingNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "@/contexts/chatContext";

export default function Chat() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const { chatMessages, setChatMessages } = useChat();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showExampleCards, setShowExampleCards] = useState<boolean>(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (!chatMessages.chat_history.length) {
        setChatMessages({
          user_message: "",
          has_doenca: false,
          studies_list: {
            currentPage: 1,
            studies: [],
            totalPages: 1,
          },
          chat_history: [
            {
              sender: "ai",
              text: "Olá! Sou o ChatBot do Portal de Estudos Clínicos do Hospital Sírio-Libanês. Posso te ajudar a encontrar estudos clínicos que se encaixam no seu perfil ou responder dúvidas sobre o processo de pesquisa clínica. Vamos começar?",
            },
          ],
        });
      }
    }, []);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      }
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [chatMessages]);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
      if (!message.trim()) return;
      setShowExampleCards(false);
      setIsLoading(true);

      try {
        const userMessage: Message = { sender: "user", text: message };
        const updatedChatHistory = [...chatMessages.chat_history, userMessage];

        const chatMessage: ChatMessage = {
          user_message: message,
          has_doenca: chatMessages.has_doenca,
          studies_list: chatMessages.studies_list,
          chat_history: updatedChatHistory,
        };

        setChatMessages((prev) => ({
          ...prev,
          chat_history: updatedChatHistory,
        }));

        setMessage("");

        const response: ChatMessage = await ChatService.sendMessage(chatMessage);

        const aiMessageText = response.chat_history[response.chat_history.length - 1].text;
        const aiMessage: Message = {
          sender: "ai",
          text: aiMessageText,
          studies_list: response.studies_list.studies,
        };

        setChatMessages((prev) => ({
          ...prev,
          has_doenca: response.has_doenca,
          chat_history: [...prev.chat_history, aiMessage],
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    }

    const handleSuggestionButtonClick = (suggestion: string) => {
      setMessage(suggestion);
      setShowExampleCards(false);
    }


    return (
      <div className="flex flex-col h-screen">
        <LandingNav isLoggedIn={isLoggedIn} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            {chatMessages.chat_history.map((message, index) => (
              <div key={index} className="mb-7 mt-5 max-w-2xl mx-auto">
                {message.sender === "user" ? (
                  <div className="flex justify-end">
                    <div className="bg-brandLightBlue/80 text-white rounded-xl p-3 max-w-full">
                      {message.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex items-start">
                      <Icons.gitHub className="w-15 h-12 mr-2 text-brandLightBlue" />
                      <div className="text-gray-800 rounded-xl p-3 ">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {message.sender === "ai" &&
                  message.studies_list &&
                  message.studies_list.length > 0 && (
                    <div className="flex justify-center mt-4">
                      <div className="max-w-2xl">
                        <h2 className="text-xl font-bold text-left mb-3">
                          Estudos Encontrados
                        </h2>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Título</TableHead>
                              <TableHead>Detalhes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {message.studies_list.map((study, studyIndex) => (
                              <TableRow key={studyIndex}>
                                <TableCell>{study.Title}</TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() =>
                                      navigate(`/studydetails`, { state: study })
                                    }
                                    className="bg-brandLightBlue hover:bg-brandDarkBlue"
                                  >
                                    Ver Detalhes
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 text-gray-800 rounded-xl p-3 max-w-2xl flex items-center">
                  <Loader2 className="animate-spin mr-2" />
                  <span>Escrevendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          {showExampleCards && chatMessages.chat_history.length === 1  && (

          <div className="flex justify-center gap-4 mb-4 px-4">
            <div
              className="bg-gray-100 p-4 rounded-lg max-w-xs hover:bg-gray-200 transition-colors cursor-pointer"
              onClick={() =>
                handleSuggestionButtonClick("Quero estudos clínicos sobre câncer em São Paulo")
              }
            >
              <h3 className="font-medium mb-2 text-brandDarkBlue">Encontrar Estudos</h3>
              <p className="text-sm text-gray-600">
                "Quero estudos clínicos sobre câncer em São Paulo"
              </p>
            </div>
          <div
            className="bg-gray-100 p-4 rounded-lg max-w-xs hover:bg-gray-200 transition-colors cursor-pointer"
            onClick={() => handleSuggestionButtonClick("O que são estudos clínicos?")}
          >
            <h3 className="font-medium mb-2 text-brandDarkBlue">Dúvidas Gerais</h3>
            <p className="text-sm text-gray-600">
              "O que são estudos clínicos?"
            </p>
          </div>
        </div>
        )}
          </ScrollArea>
          <div className="p-4 ">
            <div className="flex max-w-2xl w-full mx-auto">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem"
                onKeyPress={handleKeyPress}
                className="flex-1 rounded-full"
              />
              <Button
                onClick={handleSendMessage}
                variant="default"
                className="ml-2 bg-brandLightBlue hover:bg-brandDarkBlue"
              >
                <Send size={20} className="text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
    }

