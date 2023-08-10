"use client"
import { ObjectId } from "mongodb";
import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export type workspaceType = {
    _id: ObjectId;
    title?: string;
    tabs: tabType[];
};

export type tabType = {
    _id: ObjectId | null;
    title: string;
    url: string;
    pinned: boolean;
    browserTabId: number;
    faviconUrl: string;
};

type ContextType = {
    selectedWorkspace: workspaceType | null;
    setSelectedWorkspace: (newWorkspace: workspaceType | null) => void;
};

const SelectedWorkspaceContext = createContext<ContextType>({
    selectedWorkspace: null,
    setSelectedWorkspace: () => {},
});

type ProviderProps = {
    children: React.ReactNode;
};

export const SelectedWorkspaceProvider: React.FC<ProviderProps> = ({
    children,
}) => {
    const [selectedWorkspace, setSelectedWorkspace] =
        useState<workspaceType | null>(null);

    const [ cookies, setCookie ] = useCookies(["WorkspaceSelected"]);

    useEffect(() => {
        // setCookie("WorkspaceSelected", selectedWorkspace, { path: "/" }); 
        // window.postMessage({ type: "MY_STATE_UPDATE", value: selectedWorkspace?._id }, "*");
    }, [selectedWorkspace]);

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspace, setSelectedWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

export const useSelectedWorkspace = () => useContext(SelectedWorkspaceContext);