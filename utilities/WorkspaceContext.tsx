"use client"
import { ObjectId } from "mongodb";
import { createContext, useContext, useEffect, useState } from "react";

export type workspaceType = {
    _id: ObjectId;
    title?: string;
    tabs: tabType[];
};

export type tabType = {
    _id: ObjectId;
    title: string;
    url: string;
    pinned: boolean;
};

type ContextType = {
    selectedWorkspace: workspaceType | null;
    // setSelectedWorkspace: Dispatch<SetStateAction<workspaceType | undefined>> | undefined;
    setSelectedWorkspace: (newWorkspace: workspaceType | null) => void;
};

const SelectedWorkspaceContext = createContext<ContextType>({
    selectedWorkspace: null,
    setSelectedWorkspace: () => {},
});

/*
export const SelectedWorkspaceContext = createContext<ContextType>({
    selectedWorkspace: undefined,
    setSelectedWorkspace: undefined,
});
*/

type ProviderProps = {
    children: React.ReactNode;
};

export const SelectedWorkspaceProvider: React.FC<ProviderProps> = ({
    children,
}) => {
    const [selectedWorkspace, setSelectedWorkspace] =
        useState<workspaceType | null>(null);

    useEffect(() => {

        console.log("Changed");

        // Dispatch an event to the extension whenever the selectedWorkspace is updated
        const event = new CustomEvent("SelectedWorkspaceUpdated", { detail: selectedWorkspace });
        window.dispatchEvent(event);
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

/* 
const SelectedWorkspaceProvider: React.FC<ProviderProps> = ({ children }) => {
    const [selectedWorkspace, setSelectedWorkspace] = useState<
        workspaceType | undefined
    >(undefined);

    return (
        <SelectedWorkspaceContext.Provider
            value={{ selectedWorkspace, setSelectedWorkspace }}
        >
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

export default SelectedWorkspaceProvider;
*/
