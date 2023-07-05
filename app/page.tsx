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
    outerContainer: "w-full h-full flex",
    rootContainer: "h-screen w-screen",
    mainContent: "bg-slate-200 w-full h-full",
};

export default function Home() {
    const session = useSession();

    if (session.status === "unauthenticated") {
        return redirect("/login");
    }

    console.log(session);

    return (
        <div className={styles.rootContainer}>
            <DatabaseProvider>
                <SelectedWorkspaceProvider>
                    <div className={styles.outerContainer}>
                        <Sidebar />
                        <div className={styles.mainContent}>
                            <Workspace />
                        </div>
                    </div>
                </SelectedWorkspaceProvider>
            </DatabaseProvider>
        </div>
    );
}
