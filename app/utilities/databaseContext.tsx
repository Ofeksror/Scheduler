import { createContext, useContext, useState } from "react";
import { workspaceType } from "./WorkspaceContext";

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
    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<workspaceType[]>(
        []
    );
    const [savedWorkspaces, setSavedWorkspaces] = useState<workspaceType[]>([]);

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
