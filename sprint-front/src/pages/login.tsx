import { useEffect, useState } from "react";
import { loginService } from "@/services/useAuth";
import { LoginFormData, LoginResponse, LoginError } from "@/types/authTypes";
import { useNavigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/hooks/use-toast";
import { LandingNav } from "@/components/LandingNav";

export default function Login() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<LoginError>({
        message: "",
        status: 0,
    });
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        setLoading(false);
    }, []);

    if (localStorage.getItem('token')) {
        navigate('/dashboard');
    }
    
    const showErrorToast = (message:string) => {
        toast({
            variant: "destructive",
            title: "Erro ao fazer login",
            description: message

        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        })
    };

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        
        try {
            setLoading(true);
            const response: LoginResponse = await loginService(formData);
            localStorage.setItem('token', response.access_token);
            navigate('/');
        } catch(err: any) {
            setError(err instanceof Error ? error.message: err);
            showErrorToast(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-brandWhite min-h-screen w-full overflow-x-hidden mx-auto flex flex-col">
          <LandingNav isLoggedIn={Boolean(localStorage.getItem("token"))} />
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-4 mt-20"
          >
            <div className="grid gap-1 mb-5 w-full">
              <Label
                htmlFor="email"
                className="text-brandDarkBlue font-medium text-left text-medium mb-1"
              >
                Email
              </Label>
              <Input
                id="email"
                placeholder="seuemail@gmail.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
    
            <div className="grid gap-1 w-full">
              <Label
                htmlFor="password"
                className="text-brandDarkBlue font-medium text-left text-medium mb-1"
              >
                Senha
              </Label>
              <Input
                id="password"
                placeholder="********"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full"
              />
            </div>
    
            <Button
              type="submit"
              className="bg-brandLightBlue text-brandWhite hover:bg-brandLightBlue/20 hover:text-brandDarkBlue mt-5 w-full"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
    
        </div>
      );
    }