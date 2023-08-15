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
};

export type Tab = {
    url: string;
    id: number;
    title: string;
    favIconUrl: string;
};

type RawWorkspace = {
    _id: ObjectId;
    title: string;
    tabsUrls: string[];
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
            });

            setTimeout(() => {
                window.postMessage({
                    event: "WEB_WORKSPACE_CHANGED",
                    tabsUrls: workspace.tabsUrls,
                });
            }, 500)
        }, 500)

    };



    // const messageHandler = async ({data: message}: any) => {
    //     if (selectedWorkspaceRef.current === null) {
    //         return;
    //     }

    //     if (message.event == "EXT_TABS_REQUEST") {
    //         const tabsUrls: string[] = message.tabs.map((tab: any) => tab.url);
    //         const tabs: Tab[] = message.tabs.map((tab: any) => {
    //             return {
    //                 url: tab.url,
    //                 id: tab.id,
    //                 title: tab.title,
    //                 favIconUrl: tab.favIconUrl,
    //             };
    //         });

    //         await axios({
    //             url: "/api/workspaces/update",
    //             method: "PUT",
    //             data: {
    //                 workspace: {
    //                     _id: selectedWorkspaceRef.current._id,
    //                     title: selectedWorkspaceRef.current.title,
    //                     tabsUrls,
    //                 },
    //             },
    //         })
    //             .then((res) => {
    //                 if (res.status == 200) {
    //                     return;
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.warn("Error syncing workspace to DB:");
    //                 console.warn(error);
    //             });

    //         setSelectedWorkspace({
    //             ...selectedWorkspaceRef.current,
    //             tabs,
    //             tabsUrls,
    //         });

    //         refreshWorkspace({
    //             ...selectedWorkspaceRef.current,
    //             tabs,
    //             tabsUrls,
    //         });
    //     }
    // }

    // useEffect(() => {
    //     window.addEventListener("message", messageHandler);
    // }, [])

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspace, setSelectedWorkspace, switchWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

export const useSelectedWorkspace = () => useContext(SelectedWorkspaceContext);
