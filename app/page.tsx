"use client";
import Image from "next/image";
import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";
import { useState } from "react";

const styles = {
    rootContainer: "flex-1 h-screen w-screen",
    mainContent: "bg-slate-200 w-full h-full",
};

export default function Home() {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<
        number | null
    >(null);

    return (
        <div className={styles.rootContainer}>
            <Sidebar
                selectedWorkspaceId={selectedWorkspaceId}
                setSelectedWorkspaceId={setSelectedWorkspaceId}
            />
            <div className={styles.mainContent}>
                <Workspace selectedWorkspaceId={selectedWorkspaceId} />
            </div>
        </div>
    );
}
