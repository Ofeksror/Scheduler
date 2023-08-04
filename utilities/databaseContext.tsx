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


// The problem to fix: the function executes whatever it is that is set here, and somehow for some reason doesnt replace these values with the values defined in the component.
// IDK 
const DatabaseContext = createContext<ContextType>({
    unsavedWorkspaces: [],
    setUnsavedWorkspaces: () => {},
    savedWorkspaces: [],
    setSavedWorkspaces: () => {},
    refreshWorkspace: () => {},
    refreshWorkspaces: () => {},
});

type ProviderProps = {
    children: React.ReactNode;
};

export const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const { data: session, update, status } = useSession();

    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<workspaceType[]>(
        []
    );
    const [savedWorkspaces, setSavedWorkspaces] = useState<workspaceType[]>([]);

    const refreshWorkspace = async (updatedWorkspace: workspaceType) => {
        if (status !== "authenticated") return;

        try {
            const prevWorkspaceIndex = savedWorkspaces.findIndex(
                (iter) => iter._id === updatedWorkspace._id
            );

            if (prevWorkspaceIndex !== -1) {
                // Replace existing workspace with updated one
                setSavedWorkspaces([
                    ...savedWorkspaces.slice(0, prevWorkspaceIndex),
                    updatedWorkspace,
                    ...savedWorkspaces.slice(prevWorkspaceIndex + 1),
                ]);
            } else {
                // Add new workspace to savedWorkspaces
                setSavedWorkspaces([...savedWorkspaces, updatedWorkspace]);
            }
        } catch (err) {
            console.warn("Failed to fetch workspace. Error: " + err);
        }
    };

    const refreshWorkspaces = async () => {
        if (status === "unauthenticated") {
            return
        };
        
        // Get workspace IDs attached to user
        const workspaceIds = await axios({
            method: "get",
            url: `/api/users/${session?.user?._id}/workspaces`
        })
            .then((res) => {
                return res.data.workspaces;
            })
            .catch((error) => {
                console.warn(error);
            });

        if (!workspaceIds) {
            return;
        }

        const promises = workspaceIds.map(async (_id: string) => {
            try {
                const response = await axios.get(`/api/workspaces/${_id}`);                
                return response.data.workspace;
            } catch (error) {
                // Workspace doesn't exist in database and is falsely attached to user
                // Delete all references to workspace from all users
                await axios.delete(`/api/workspaces/${_id}`);
                return null;
            }
        });

        const results = await Promise.all(promises);
        const workspacesFetched = results.filter((workspace) => workspace !== null);

        // Update session workspace IDs
        await update({
            ...session,
            user: {
                ...session.user,
                workspaces: [
                    ...workspacesFetched.map((workspace) => workspace._id)
                ]
            }
        })

        setSavedWorkspaces(workspacesFetched);
    };

    return (
        <DatabaseContext.Provider
            value={{
                unsavedWorkspaces,
                setUnsavedWorkspaces,
                savedWorkspaces,
                setSavedWorkspaces,
                refreshWorkspace,
                refreshWorkspaces,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
