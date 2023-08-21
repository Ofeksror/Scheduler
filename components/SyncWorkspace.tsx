"use client";
import { Tab, useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {};

const SyncWorkspace = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace, } = useSelectedWorkspace();

    const syncWorkspace = async () => {

        if (selectedWorkspace == null) return;

        window.postMessage({
            event: "WEB_TABS_REQUEST",
            workspaceId: selectedWorkspace._id,
            workspaceTitle: selectedWorkspace.title, 
            workspaceResources: selectedWorkspace.resources,
            switchingWorkspace: false,
        });
    };

    return (
        <Button onClick={syncWorkspace} id="syncWorkspaceButton" className="aspect-square w-9 h-9 p-2 bg-gray-100 hover:bg-gray-200 text-gray-800 group">
            <RefreshCcw className="transition duration-300 ease-in-out group-hover:rotate-[-180deg]" />
        </Button>
    );
};

export default SyncWorkspace;
