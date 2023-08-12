"use client"
import { ObjectId } from "mongodb";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export type Workspace = {
    _id: ObjectId;
    title: string;
    tabs: Tab[];
};

export type Tab = {
    url: string;
    id: number;
    title: string;
    faviconUrl: string;
};

type RawWorkspace = {
    _id: ObjectId;
    title: string;
    tabsUrls: string[];
}

type ContextType = {
    selectedWorkspace: Workspace | null;
    setSelectedWorkspace: (newWorkspace: Workspace | null) => void;
    switchWorkspace: (workspace: RawWorkspace) => void;
};

const SelectedWorkspaceContext = createContext<ContextType>({
    selectedWorkspace: null,
    setSelectedWorkspace: () => {},
    switchWorkspace: () => {},
});

type ProviderProps = {
    children: React.ReactNode;
};

export const SelectedWorkspaceProvider: React.FC<ProviderProps> = ({
    children,
}) => {
    const [selectedWorkspace, setSelectedWorkspace] =
        useState<Workspace | null>(null);

    // const [ cookies, setCookie ] = useCookies(["WorkspaceSelected"]);

    const switchWorkspace = async (workspace: RawWorkspace) => {
        setSelectedWorkspace({
            _id: workspace._id,
            title: workspace.title,
            tabs: []
        })

        window.postMessage({
            event: "WEB_WORKSPACE_CHANGED",
            tabsUrls: workspace.tabsUrls,
        });
    }

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspace, setSelectedWorkspace, switchWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

export const useSelectedWorkspace = () => useContext(SelectedWorkspaceContext);