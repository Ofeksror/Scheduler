"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Workspace from "./components/Workspace";

import {
    SelectedWorkspaceProvider,
    workspaceType,
} from "./utilities/WorkspaceContext";
import { DatabaseProvider } from "./utilities/databaseContext";

import tryFunc from "./utilities/dbHelpers";

const styles = {
    outerContainer: "w-full h-full flex",
    rootContainer: "h-screen w-screen",
    mainContent: "bg-slate-200 w-full h-full",
};

export default function Home() {
    const session = useSession();

    useEffect(() => {
        if (session.status === "unauthenticated") {
            return redirect("/login");
        }
    }, [session]);

    return (
        <div className={styles.rootContainer}>
            <DatabaseProvider>
                <SelectedWorkspaceProvider>
                    <div className={styles.outerContainer}>
                        <Sidebar />
                        <div className={styles.mainContent}>
                            <Workspace />
                        </div>

                        {/* Helpers, DEMO Only */}
                        <div className="bg-red-600 flex gap-10">
                            <button
                                onClick={() => {
                                    console.log(session);
                                }}
                            >
                                Log Session
                            </button>

                            <button
                                onClick={() => {
                                    const response = fetch(`/api/db/try`, {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then((data) => {
                                        console.log(data);
                                        return data;
                                    });

                                    console.log(response);

                                    if (response.status == 200) {
                                        // Successful, continue to login
                                        console.log("Successful1");
                                    }
                                }}
                            >
                                Try DB Connection
                            </button>

                            <button
                                onClick={() => {
                                    const response = fetch(`/api/db/workspaces/read/${session.data?.user?._id}`, {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                    }).then((data) => {
                                        console.log(data);
                                        return data;
                                    });

                                    console.log(response);

                                    if (response.status == 200) {
                                        // Successful, continue to login
                                        console.log("Successful1");
                                    }
                                }}
                            >
                                Try to fetch workspaces
                            </button>
                        </div>
                    </div>
                </SelectedWorkspaceProvider>
            </DatabaseProvider>
        </div>
    );
}
