"use client";
import React, { useEffect } from "react";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import { useSession } from "next-auth/react";

type Props = {};

const ExtensionHelpers = (props: Props) => {
    const session = useSession();
    const { selectedWorkspace } = useSelectedWorkspace();
    const { refreshWorkspaces } = useDatabase();

    useEffect(() => {
        window.addEventListener("message", handleMessage);
    }, []);

    const handleMessage = (event: any) => {
        // Handle messages if they are requiring you to refresh workspace
        console.log(event);
    };

    return (
        <div>
            <button
                id="cliclMeExtension"
                onClick={() => {
                    console.log("Hey!");
                }}
            >
                Click to RefreshWorkspaces
            </button>
        </div>
    );
};

export default ExtensionHelpers;
