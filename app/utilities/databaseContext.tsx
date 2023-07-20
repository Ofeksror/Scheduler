import { createContext, useContext, useEffect, useState } from "react";
import { workspaceType } from "./WorkspaceContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ObjectId } from "mongoose";

type ContextType = {
    unsavedWorkspaces: workspaceType[];
    setUnsavedWorkspaces: (workspaces: workspaceType[]) => void;
    savedWorkspaces: workspaceType[];
    setSavedWorkspaces: (workspaces: workspaceType[]) => void;
    refreshWorkspace: (updatedWorkspace: workspaceType) => void;
    refreshWorkspaces: () => void;
};

const DatabaseContext = createContext<ContextType>({
    unsavedWorkspaces: [],
    setUnsavedWorkspaces: () => {},
    savedWorkspaces: [],
    setSavedWorkspaces: () => {},
    refreshWorkspace: () => {},
    refreshWorkspaces: () => {}
});

type ProviderProps = {
    children: React.ReactNode;
};

export const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const session = useSession();

    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<workspaceType[]>(
        []
    );
    const [savedWorkspaces, setSavedWorkspaces] = useState<workspaceType[]>([]);

    const refreshWorkspace = async (updatedWorkspace: workspaceType) => {
        if (session.status !== "authenticated") return;

        try {           
            const prevWorkspaceIndex = savedWorkspaces.findIndex((iter) => iter._id === updatedWorkspace._id);

            if (prevWorkspaceIndex !== -1) {
                // Replace existing workspace with updated one
                setSavedWorkspaces([
                    ...savedWorkspaces.slice(0, prevWorkspaceIndex),
                    updatedWorkspace,
                    ...savedWorkspaces.slice(prevWorkspaceIndex + 1)
                ]);
            }
            else {
                // Add new workspace to savedWorkspaces  
                setSavedWorkspaces([
                    ...savedWorkspaces,
                    updatedWorkspace
                ]);
            }
        } catch (err) {
            console.warn("Failed to fetch workspace. Error: " + err);
        }
    }

    const refreshWorkspaces = async () => {
        if (session.status != "authenticated") return;

        const workspaceIds = session?.data?.user?.workspaces;
        if (!workspaceIds) return

        try {
            const promises = workspaceIds.map((_id) => {
                return axios.get(`/api/workspaces/${_id}`)
            })

            const results = await Promise.all(promises);

            const workspacesFetched = results.map(result => result.data.workspace);
            setSavedWorkspaces(workspacesFetched)
        } catch (err) {
            console.warn("Failed to fetch workspaces. Error: " + err);
        }
    }

    useEffect(() => {
        refreshWorkspaces()
    }, [session]);

    return (
        <DatabaseContext.Provider
            value={{
                unsavedWorkspaces,
                setUnsavedWorkspaces,
                savedWorkspaces,
                setSavedWorkspaces,
                refreshWorkspace,
                refreshWorkspaces
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
