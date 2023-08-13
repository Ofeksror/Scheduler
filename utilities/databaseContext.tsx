import { createContext, useContext, useEffect, useState } from "react";
import { Workspace } from "./WorkspaceContext";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ObjectId } from "mongodb";

type ContextType = {
    unsavedWorkspaces: Workspace[];
    setUnsavedWorkspaces: (workspaces: Workspace[]) => void;
    savedWorkspaces: Workspace[] | null;
    setSavedWorkspaces: (workspaces: Workspace[]) => void;
    updateDeletedWorkspace: (deletedId: ObjectId) => void;
    refreshWorkspace: (updatedWorkspace: Workspace) => void;
    refreshWorkspaces: () => void;
};

// The problem to fix: the function executes whatever it is that is set here, and somehow for some reason doesnt replace these values with the values defined in the component.
// IDK
const DatabaseContext = createContext<ContextType>({
    unsavedWorkspaces: [],
    setUnsavedWorkspaces: () => {},
    savedWorkspaces: [],
    setSavedWorkspaces: () => {},
    updateDeletedWorkspace: () => {},
    refreshWorkspace: () => {},
    refreshWorkspaces: () => {},
});

type ProviderProps = {
    children: React.ReactNode;
};

export const DatabaseProvider: React.FC<ProviderProps> = ({ children }) => {
    const { data: session, update, status } = useSession();

    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<Workspace[]>([]);
    const [savedWorkspaces, setSavedWorkspaces] = useState<Workspace[] | null>(
        null
    );

    useEffect(() => {
        console.log(savedWorkspaces);
    }, [savedWorkspaces]);

    const updateDeletedWorkspace = async (deletedId: ObjectId) => {
        if (status !== "authenticated" || savedWorkspaces == null) return;

        const prevIndex = savedWorkspaces.findIndex(
            (iter) => iter._id === deletedId
        );

        if (prevIndex == -1) {
            console.warn("Something went wrong...");
            return;
        }

        setSavedWorkspaces([
            ...savedWorkspaces.slice(0, prevIndex),
            ...savedWorkspaces.slice(prevIndex + 1),
        ]);
    };

    const refreshWorkspace = async (updatedWorkspace: Workspace) => {
        if (status !== "authenticated" || savedWorkspaces == null) return;

        try {
            const prevWorkspaceIndex = savedWorkspaces.findIndex(
                (iteratedWorkspace) => iteratedWorkspace._id === updatedWorkspace._id
            );

            if (prevWorkspaceIndex == -1) {
                // Add new workspace to savedWorkspaces
                setSavedWorkspaces([...savedWorkspaces, updatedWorkspace]);
            } else {
                // Replace existing workspace with updated one
                setSavedWorkspaces([
                    ...savedWorkspaces.slice(0, prevWorkspaceIndex),
                    updatedWorkspace,
                    ...savedWorkspaces.slice(prevWorkspaceIndex + 1),
                ]);
            }
        } catch (err) {
            console.warn("Failed to fetch workspace. Error: " + err);
        }
    };

    const refreshWorkspaces = async () => {
        if (status === "unauthenticated") {
            return;
        }

        const userId = session?.user?._id;

        if (!userId) {
            return;
        }

        // Get workspace IDs attached to user
        const workspaceIds = await axios({
            method: "get",
            url: `/api/users/${userId}/workspaces`,
        })
            .then((res) => {
                return res.data.workspaces;
            })
            .catch((error) => {
                console.warn(error);
            });

        if (!workspaceIds) {
            setSavedWorkspaces([]);
            return;
        }

        const workspacesPromises = workspaceIds.map(async (_id: string) => {
            const workspace = await axios({
                method: "get",
                url: `/api/workspaces/${_id}`,
            })
                .then((res) => res.data.workspace)
                .catch(async (error) => {
                    // Workspace doesn't exist in database and is falsely attached to user
                    // Delete all references to workspace from all users
                    console.warn(error);
                    await axios.delete(`/api/workspaces/${_id}/`);
                    return null;
                });

            console.log(workspace);
            return workspace;
        });

        const workspacesList = await Promise.all(workspacesPromises);
        const filteredWorkspaces = workspacesList.filter(
            (workspace: any) => workspace != null
        );

        console.log(filteredWorkspaces);

        setSavedWorkspaces(filteredWorkspaces);

        // Update session workspace IDs
        await update({
            ...session,
            user: {
                ...session.user,
                workspaces: [...workspaceIds],
            },
        });
    };

    return (
        <DatabaseContext.Provider
            value={{
                unsavedWorkspaces,
                setUnsavedWorkspaces,
                savedWorkspaces,
                setSavedWorkspaces,
                updateDeletedWorkspace,
                refreshWorkspace,
                refreshWorkspaces,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
