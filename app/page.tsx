"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";

import {
    SelectedWorkspaceProvider,
    workspaceType,
} from "./utilities/WorkspaceContext";
import { DatabaseProvider } from "./utilities/databaseContext";

const styles = {
    rootContainer: "flex-1 h-screen w-screen",
    mainContent: "bg-slate-200 w-full h-full",
};

export default function Home() {
    const session = useSession();

    if (session.status === "unauthenticated") {
        return redirect("/login");
    }

    return (
        <div className={styles.rootContainer}>
            <DatabaseProvider>
                <SelectedWorkspaceProvider>
                    <Sidebar />
                    <div className={styles.mainContent}>
                        <Workspace />
                    </div>
                </SelectedWorkspaceProvider>
            </DatabaseProvider>
        </div>
    );
}
