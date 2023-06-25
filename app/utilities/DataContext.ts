import { useState, createContext } from "react";

type selectedWorkspaceContextType = {
    selectedWorkspaceId: string;
    selectWorkspace: (id: string) => void;
};

const SelectedWorkspaceContext = createContext<selectedWorkspaceContextType>(
    {} as selectedWorkspaceContextType
);

interface ProviderProps {
    children: React.ReactNode;
}

const SelectedWorkspaceProvider: React.FC<ProviderProps> = ({ children }) => {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
        number | null
    >(null);

    const selectWorkspace = (id: number) => {
        setSelectedWorkspaceId(id);
    };

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspaceId, selectWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};


export default SelectedWorkspaceProvider;
