import { createContext, useContext, useEffect, useState } from "react";
import { workspaceType } from "./WorkspaceContext";
import { useSession } from "next-auth/react";
import axios from "axios";

type ContextType = {
    unsavedWorkspaces: workspaceType[];
    setUnsavedWorkspaces: (workspaces: workspaceType[]) => void;
    savedWorkspaces: workspaceType[];
    setSavedWorkspaces: (workspaces: workspaceType[]) => void;
};

const DatabaseContext = createContext<ContextType>({
    unsavedWorkspaces: [],
    setUnsavedWorkspaces: () => {},
    savedWorkspaces: [],
    setSavedWorkspaces: () => {},
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

    useEffect(() => {
        if (session.status != "authenticated") return;

        const workspaceIds = session?.data?.user?.workspaces;
        if (!workspaceIds) return


        const fetchWorkspaces = async () => {
            try {
                const promises = workspaceIds.map((_id) => {
                    return axios.get(`/api/db/workspaces/${_id}`)
                })

                const results = await Promise.all(promises);

                const workspacesFetched = results.map(result => result.data);
                setSavedWorkspaces(workspacesFetched as workspaceType[])
            } catch (err) {
                console.warn("Failed to fetch workspaces. Error: " + err);
            }
        }

        fetchWorkspaces();

    }, [session]);

    return (
        <DatabaseContext.Provider
            value={{
                unsavedWorkspaces,
                setUnsavedWorkspaces,
                savedWorkspaces,
                setSavedWorkspaces,
            }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => useContext(DatabaseContext);
