"use client";
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import { useState } from "react";
import { SelectedWorkspaceProvider, workspaceType } from "./utilities/WorkspaceContext";
import Temp from "./components/Temp";

const styles = {
    rootContainer: "flex-1 h-screen w-screen",
    mainContent: "bg-slate-200 w-full h-full",
};

export default function Home() {
    const [savedWorkspaces, setSavedWorkspaces] = useState<workspaceType[]>([]);
    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<workspaceType[]>(
        []
    );
    // Fetch workspaces from database

    return (
        <div className={styles.rootContainer}>
            <SelectedWorkspaceProvider>
                <Sidebar />
                <div className={styles.mainContent}>
                    <Workspace />
                </div>
            </SelectedWorkspaceProvider>
        </div>
    );
}
