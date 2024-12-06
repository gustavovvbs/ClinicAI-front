import { Button } from "@/components/ui/button";
import { LandingNav } from "../components/LandingNav";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="bg-brandWhite min-h-screen flex flex-col">
      <LandingNav isLoggedIn={isLoggedIn} />
      <Separator className="mt-5" />
      <main className="flex flex-col items-center justify-center p-6">
        <div className="bg-brandLightBlue/20 py-12 w-full mb-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl text-brandDarkBlue font-bold mb-4 text-left text-bold">
              Conecte-se com a Pesquisa Médica
            </h1>
            <p className="text-brandDarkBlue font-medium text-left max-w mx-auto text-medium">
              Conectamos pacientes, médicos e pesquisadores aos estudos clínicos, com informações claras e acessíveis.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center">
          {/* Caixa para Pacientes */}
          <div className="border rounded-3xl p-6 bg-white max-w-sm">
            <h2 className="text-xl font-bold text-brandDarkBlue mb-2">
              Para pacientes
            </h2>
            <ul className="text-brandDark list-disc pl-4 mb-4">
              <li>Visualize os estudos clínicos disponíveis</li>
              <li>Participe de estudos sobre novos tratamentos</li>
            </ul>
            <Link to={"/busca-paciente"}>
              <Button className="bg-brandLightBlue text-brandWhite w-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue">
                Acesse
              </Button>
            </Link>
          </div>

          {/* Caixa para Médicos */}
          <div className="border rounded-3xl p-6 bg-white max-w-sm ">
            <h2 className="text-xl font-bold text-brandDarkBlue mb-2">
              Para médicos
            </h2>
            <ul className="text-brandDark list-disc pl-4 mb-4">
              <li>Explore estudos para referenciar seus pacientes</li>
              <li>Faça buscas avançadas pelos estudos</li>
            </ul>
            <Link to={"/busca-medico"}>
              <Button className="bg-brandLightBlue text-brandWhite w-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue">
                Acesse
              </Button>
            </Link>
          </div>
          {/* ChatBot */}
          <div className="border rounded-3xl p-6 bg-white max-w-sm ">
            <h2 className="text-xl font-bold text-brandDarkBlue mb-2 ">
              ChatBot
            </h2>
            <p className="text-brandDark  mb-4">
              <li>Explore nosso ChatBot para auxiliar nas pesquisas.</li>
              <li>Tenha uma experiência customizada e faça buscas mais simples.</li>
            </p>
            <Link to={"/chat"}>
              <Button className="bg-brandLightBlue text-brandWhite w-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue mt-6">
                Acesse
              </Button>
            </Link>
          </div>          

          {/* Caixa para Pesquisadores */}
          {isLoggedIn && (
            <div className="border rounded-3xl p-6 bg-white max-w-sm">
              <h2 className="text-xl font-bold text-brandDarkBlue mb-2">
                Painel de Admnistrador
              </h2>
              <ul className="text-brandDark list-disc pl-4 mb-4">
                <li>Acesse e gerencie os estudos clínicos submetidos.</li>
                <li>Visualize os dados analisados sobre os estudos clínicos no Brasil.</li>
              </ul>
              <Link to={"/dashboard"}>
                <Button className=" mt-5 bg-brandLightBlue text-brandWhite w-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue">
                  Acesse
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
