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
    // const { refreshWorkspace } = useDatabase();

    // const selectedWorkspaceRef = useRef(selectedWorkspace);
    // useEffect(() => {
    //     selectedWorkspaceRef.current = selectedWorkspace;
    // }, [selectedWorkspace]);

    // const communicationHandler = async ({ data: message }: any) => {
    //     if (selectedWorkspaceRef.current === null) {
    //         return;
    //     }

    //     if (message.event == "EXT_TABS_REQUEST") {
    //         const tabsUrls: string[] = message.tabs.map((tab: any) => tab.url);
    //         const tabs: Tab[] = message.tabs.map((tab: any) => {
    //             return {
    //                 url: tab.url,
    //                 id: tab.id,
    //                 title: tab.title,
    //                 favIconUrl: tab.favIconUrl,
    //             };
    //         });

    //         await axios({
    //             url: "/api/workspaces/update",
    //             method: "PUT",
    //             data: {
    //                 workspace: {
    //                     _id: selectedWorkspaceRef.current._id,
    //                     title: selectedWorkspaceRef.current.title,
    //                     tabsUrls,
    //                 },
    //             },
    //         })
    //             .then((res) => {
    //                 if (res.status == 200) {
    //                     return;
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.warn("Error syncing workspace to DB:");
    //                 console.warn(error);
    //             });

    //         setSelectedWorkspace({
    //             ...selectedWorkspaceRef.current,
    //             tabs,
    //             tabsUrls,
    //         });

    //         refreshWorkspace({
    //             ...selectedWorkspaceRef.current,
    //             tabs,
    //             tabsUrls,
    //         });
    //     }
    // };

    // useEffect(() => {
    //     window.addEventListener("message", communicationHandler);
    // }, []);

    const syncWorkspace = async () => {

        if (selectedWorkspace == null) return;

        window.postMessage({
            event: "WEB_TABS_REQUEST",
            workspaceId: selectedWorkspace._id,
            workspaceTitle: selectedWorkspace.title, 
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
