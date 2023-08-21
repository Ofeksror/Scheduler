"use client";
import axios from "axios";
import { ObjectId } from "mongodb";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useDatabase } from "@/utilities/databaseContext";

export type Workspace = {
    _id: ObjectId;
    title: string;
    tabs: Tab[];
    tabsUrls: string[];
    resources: Resource[];
};

export type Tab = {
    url: string;
    id: number;
    title: string;
    favIconUrl: string;
    
    // groupId?: number;
};

export type Resource =  {
    // _id?: ObjectId;
    url: string,
    title: string,
    favIconUrl: string,
}

type RawWorkspace = {
    _id: ObjectId;
    title: string;
    tabsUrls: string[];
    resources: Resource[];
};

type ContextType = {
    selectedWorkspace: Workspace | null;
    setSelectedWorkspace: (newWorkspace: Workspace | null) => void;
    switchWorkspace: (workspaceId: ObjectId) => void;
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

    const { savedWorkspaces } = useDatabase();

    const [selectedWorkspace, setSelectedWorkspace] =
        useState<Workspace | null>(null);

    const selectedWorkspaceRef = useRef(selectedWorkspace);
    useEffect(() => {
        selectedWorkspaceRef.current = selectedWorkspace;
    }, [selectedWorkspace])

    const switchWorkspace = async (workspaceId: ObjectId) => {
        // Sync workspace before switching it
        if (selectedWorkspaceRef.current != null) {
            window.postMessage({
                event: "WEB_TABS_REQUEST",
                workspaceId: selectedWorkspaceRef.current._id,
                workspaceTitle: selectedWorkspaceRef.current.title, 
                workspaceResources: selectedWorkspaceRef.current.resources,
                switchingWorkspace: true,
            });
        };

        setTimeout(() => {
            // Get new workspace from savedWorkspaces by id
            const workspace = savedWorkspaces?.find((workspaceIter) => workspaceIter._id == workspaceId);

            if (!workspace) {
                console.warn("Could not find workspace.");
                return;
            }

            // Switch workspace
            setSelectedWorkspace({
                _id: workspace._id,
                title: workspace.title,
                tabs: [],
                tabsUrls: workspace.tabsUrls,
                resources: workspace.resources,
            });

            setTimeout(() => {
                window.postMessage({
                    event: "WEB_WORKSPACE_CHANGED",
                    tabsUrls: workspace.tabsUrls,
                });
            }, 500)
        }, 500)

    };

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspace, setSelectedWorkspace, switchWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

export const useSelectedWorkspace = () => useContext(SelectedWorkspaceContext);
