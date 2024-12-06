import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import studyService from "@/services/studyService";
import { InternalStudyType } from "@/types/studyTypes";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Icons } from "@/components/ui/icons";
import { defaultStudy } from "@/types/defaultStudy";

export function DashBoardStudies() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [studies, setStudies] = useState<InternalStudyType[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogAction, setDialogAction] = useState<string>(""); 
  const [selectedStudy, setSelectedStudy] = useState<InternalStudyType>(defaultStudy);
  const isMounted = useRef(false);

  async function fetchStudies() {
    try {
      const response = await studyService.fetchStudies();
      if (isMounted){
        setStudies(response.studies);
      }
      else {
        throw new Error("Unexpected error");
      }
    } catch (err: any) {
      toast({
        title: "Erro ao carregar estudos",
        description: "Erro ao carregar estudos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    isMounted.current = true;
    fetchStudies();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const filterStudiesByStatus = (status: string) => {
    return studies.filter((study) => study.sub_status === status);
  }

  const filterStudiesByTitle = (title: string) => {
    return studies.filter((study) => study.Title.toLowerCase().includes(title.toLowerCase()));
  }

  const handleTitleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (title === "") {
      fetchStudies();
    } else {
      const filteredStudies = filterStudiesByTitle(title);
      setStudies(filteredStudies);
    }
  }

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      fetchStudies();
    }
    const filteredStudies = filterStudiesByStatus(status);
    setStudies(filteredStudies);
  }

  const approveStudy = async (study: InternalStudyType) => {
      try {
        setIsDialogOpen(false);
        await studyService.approveStudy(study._id);

        setStudies((prevStudies) =>
            prevStudies.map((s) =>
                s._id === study._id
                    ? { ...s, sub_status: 'accepted' }
                    : s
            )
        );

        const handleSuccessReject = () => {
            toast({
                title: "Estudo aceitado com sucesso",
                description: "Estudo aceitado com sucesso",
                variant: "default"
            });
        }

        handleSuccessReject();
    
    } catch (error) {
          const handleAcceptError = () => {
            toast({
              title: "Erro ao aceitar o estudo",
              description: "Estudo já aceito ou não encontrado",
              variant: "destructive",
              action: (
                <ToastAction
                  altText="Tentar novamente"
                  onClick={() => approveStudy(study)}
                >
                  Tentar novamente
                </ToastAction>
              )
            });
          };
          
          handleAcceptError();
          
    }
  };


  const rejectStudy = async (study: InternalStudyType) => {
      try {
          setIsDialogOpen(false);
          await studyService.rejectStudy(study._id);

          setStudies((prevStudies) =>
              prevStudies.map((s) =>
                  s._id === study._id
                      ? { ...s, sub_status: 'rejected' }
                      : s
              )
          );

          const handleSuccessReject = () => {
              toast({
                  title: "Estudo rejeitado com sucesso",
                  description: "Estudo rejeitado com sucesso",
                  variant: "default"
              });
          }

          handleSuccessReject();
      
      } catch (error) {
            const handleRejectError = () => {
              toast({
                title: "Erro ao rejeitar o estudo",
                description: "Estudo já rejeitado ou não encontrado",
                variant: "destructive",
                action: (
                  <ToastAction
                    altText="Tentar novamente"
                    onClick={() => rejectStudy(study)}
                  >
                    Tentar novamente
                  </ToastAction>
                )
              });
            };
            
            handleRejectError();
            
      }
    };

  return (
    <div className="max-w-screen mx-auto">
      {isLoading && 
        <div className="flex justify-center items-center h-screen">
          <Icons.spinner className="w-6 h-6 animate-spin" />
        </div>
      }
      <Separator className="bgColor-brandDark mt-5" />
      <div className="max-w-screen-xl mx-auto px-6 py-12 ">
        <main>
          <h1 className="text-4xl font-bold mb-5">Estudos Submetidos</h1>
            <div className="flex justify-between items-center mb-8 gap-4">
            <div className="relative flex-1 max-w-md">
              <input 
              type="text"
              placeholder="Pesquisar por título..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brandLightBlue/50 focus:border-brandLightBlue"
              onChange={handleTitleFilter}
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status:
              </label>
              <select
              name="status"
              id="status"
              className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brandLightBlue/50 focus:border-brandLightBlue cursor-pointer"
              onChange={(e) => handleStatusFilter(e.target.value)}  
              >
              <option value="all">Todos os estudos</option>
              <option value="accepted">Aceitos</option>
              <option value="rejected">Rejeitados</option>
              <option value="pending">Pendentes</option>
              </select>
            </div>
            </div>

          <div className="flex justify-between items-center">


            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200x]">Título</TableHead>
                  <TableHead className="px-5">Descrição</TableHead>
                  <TableHead className="px-5">Instituição</TableHead>
                  <TableHead className="px-5">Submissão</TableHead>
                  <TableHead className="px-5">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {studies.map((study, index) => (
                  <TableRow className={index % 2 === 0 ? 'bg-gray-50': ''} key={study._id}>
                    <TableCell className="px-5">{study.Title}</TableCell>
                    <TableCell className="px-5">
                      {study.Description}
                    </TableCell>
                    <TableCell className="px-5">
                      {study.Organization}
                    </TableCell>
                    <TableCell className="px-5">
                      {study.sub_status === "accepted" ? (
                        <span className="text-green-500">Aceito</span>
                      ) : study.sub_status === "rejected" ? (
                        <span className="text-red-500">Rejeitado</span>
                      ) : study.sub_status === "pending" ?(
                        <span className="text-yellow-500">Não Avaliado</span>
                      ) : (
                        <span className="text-gray-500">Desconhecido</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button className="bg-brandLightBlue text-white hover:bg-brandLightBlue/80">
                            Ver ações
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/studydetails", { state: study })
                            }
                          >
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudy(study);
                              setDialogAction("APPROVE");
                              setIsDialogOpen(true);
                            }}
                          >
                            Aprovar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudy(study);
                              setDialogAction("REJECT");
                              setIsDialogOpen(true);
                            }}
                          >
                            Rejeitar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {isDialogOpen && selectedStudy && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {dialogAction === "APPROVE"
                  ? "Aprovar Estudo"
                  : "Rejeitar Estudo"}
              </DialogTitle>
              <DialogDescription>
                Tem certeza que deseja{" "}
                {dialogAction === "APPROVE" ? "aprovar" : "rejeitar"} o estudo
                <br />
                "
                {" "}
                <strong>{selectedStudy.Title}</strong>?"
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={
                  dialogAction === "APPROVE"
                    ? () => approveStudy(selectedStudy)
                    : () => rejectStudy(selectedStudy)
                }
                className="bg-brandLightBlue text-white hover:bg-brandLightBlue/80"
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
