import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";	
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-hsl.png"
import { logoutService } from "@/services/useAuth";

interface LandingNavProps extends React.HTMLAttributes<HTMLElement> {
    isLoggedIn: boolean;
}

export function LandingNav({
    className,
    isLoggedIn = false,
    ...props
  }: LandingNavProps) {


    return (
        <nav
            className={cn(
                "w-full px-1 py-1 flex items-center justify-between", 
                className
            )}
            {...props}
        >
            <Link to={'/'}>
            <img src={logo} alt="Logo" className="h-14 ml-10 mt-5" />
            </Link>

            {isLoggedIn ? (
                <Button className="px-6 py-3 bg-brandLightBlue text-xl pl-6 pt-6 pb-6 pr-6 mt-8 mr-20 rounded-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue" onClick={() => {
                    logoutService();
                    window.location.reload();
                }}>
                    Logout
                </Button>
             ) : (
                <div className="flex items-center space-x-4 mt-8 mr-20">
                    <Button asChild className="px-4 py-4 bg-brandLightBlue text-sm  pl-6 pt-6 pb-6 pr-6 rounded-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue">
                        <Link to="/register-research">Registrar Pesquisa</Link>
                    </Button>
                    <Button asChild className="px-4 py-4 bg-brandLightBlue text-sm pl-6 pt-6 pb-6 pr-6 rounded-full hover:bg-brandLightBlue/20 hover:text-brandDarkBlue">
                        <Link to="/login">Login</Link>
                    </Button>
                </div>
             )}

        </nav>
    )
}