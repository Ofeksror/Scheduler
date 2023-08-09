"use client";
import React, { useEffect } from "react";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import { useSession } from "next-auth/react";

type Props = {};

const ExtensionHelpers = (props: Props) => {
    const session = useSession();
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { refreshWorkspace, refreshWorkspaces } = useDatabase();

    const handleMessage = (event: any) => {
        console.log("Incoming event received on React Component");

        if (event.data.type == "MY_EXTENSION_UPDATE") {
            refreshWorkspace(event.data.workspace);
            setSelectedWorkspace(event.data.workspace);
        }
    };

    useEffect(() => {
        window.addEventListener("message", handleMessage);
    }, []);

    return (
        <div>
            <button
                id="clickMeExtension"
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
