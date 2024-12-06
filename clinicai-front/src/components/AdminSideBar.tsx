import React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

import { ChevronRight } from "lucide-react"


export type ValidScreens = 'home' | 'search' | 'create' | 'submitted' | 'dados';

export interface DashSideBarProps extends React.HTMLAttributes<HTMLElement> {
    activeScreen: ValidScreens;
    onNavigate: (screen: ValidScreens) => void;
}

const data = {
    navMain: [
        {
            title: "Estudos",
            url: "/",
            items: [
                {
                    title: "Estudos Submetidos",
                    screen: "submitted" as ValidScreens
                },
                {
                    title: "Buscar",
                    screen: "search" as ValidScreens
                },
                {
                    title: "Criar",
                    screen: "create" as ValidScreens
                }
            ]
        },
        {
            title: "Dados",
            items: [
                {
                    title: "Dashboard de Dados",
                    screen: "dados" as ValidScreens
                }
            ]
        }
    ]
}


export function DashSideBar({ activeScreen, onNavigate, ...props }: DashSideBarProps) {
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size = "lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-brandDarkBlue text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd size={24} />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold text-brandDark">Hospital Sírio-Libanês</span>
                                    <span className="text-xs">Núcleo de Pesquisa e Inovação</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {data.navMain.map((item) => (
                            <Collapsible 
                                key={item.title}
                                asChild
                                className="group/collapsible"
                                defaultOpen={item.items?.some((item) => item.screen === activeScreen)}
                            >
                            <SidebarMenuItem key={item.title}>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="hover:bg-brandLightBlue/20">
                                        <a>
                                            {item.title}
                                        </a>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((item) => (
                                            <SidebarMenuSubItem key = {item.title}>
                                                <SidebarMenuSubButton
                                                className={`hover:bg-brandLightBlue/20 ${
                                                activeScreen === item.screen ? "bg-brandLightBlue/50" : ""
                                                }`}
                                                onClick={() => onNavigate(item.screen)}
                                                >
                                                        <span>{item.title}</span>
                                                                
                                                    </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>    
                                        ))}        
                                    </SidebarMenuSub>) : null }
                                </CollapsibleContent>
                            </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}