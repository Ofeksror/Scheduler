import { createContext, useContext, useEffect, useState } from "react";
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

    useEffect(() => {
        setUnsavedWorkspaces([
            {
                id: 1,
                tabs: [
                    { id: 1, title: "a", url: "a" },
                    { id: 2, title: "b", url: "b" },
                    { id: 3, title: "c", url: "c" },
                    { id: 4, title: "d", url: "d" },
                ],
            },
            {
                id: 2,
                tabs: [
                    { id: 1, title: "a", url: "a" },
                    { id: 2, title: "b", url: "b" },
                    { id: 3, title: "c", url: "c" },
                    { id: 4, title: "d", url: "d" },
                ],
            },
            {
                id: 3,
                tabs: [
                    { id: 1, title: "a", url: "a" },
                    { id: 2, title: "b", url: "b" },
                    { id: 3, title: "c", url: "c" },
                    { id: 4, title: "d", url: "d" },
                ],
            },
        ]);
        setSavedWorkspaces([
            {
                id: 4,
                title: "Job Hunting",
                tabs: [
                    { id: 1, title: "LinkedIn", url: "a" },
                    { id: 2, title: "TechMonster", url: "b" },
                    { id: 3, title: "AllJobs", url: "c" },
                    { id: 4, title: "Resume.pdf", url: "d" },
                ],
            },
            {
                id: 5,
                title: "Learning Software",
                tabs: [
                    { id: 1, title: "StackOverflow", url: "a" },
                    { id: 2, title: "ChatGPT", url: "b" },
                    { id: 3, title: "TailwindCSS", url: "c" },
                    { id: 4, title: "React Docs", url: "d" },
                ],
            },
            {
                id: 6,
                title: "Learning Finance",
                tabs: [
                    { id: 1, title: "Graham Stephen", url: "a" },
                    { id: 2, title: "Rich dad poor dad", url: "b" },
                    { id: 3, title: "Calcalist", url: "c" },
                ],
            },
            {
                id: 7,
                title: "Style Glow Up",
                tabs: [
                    { id: 1, title: "Pull&Bear", url: "a" },
                    { id: 2, title: "Top 10 Perfumes", url: "b" },
                    { id: 3, title: "ZARA", url: "c" },
                    { id: 4, title: "Old Money Fashion Stores", url: "d" },
                ],
            },
        ]);
    }, []);

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
