"use client";
import React, { useEffect, useRef } from "react";
import {
    Tab,
    useSelectedWorkspace,
    Workspace,
} from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import { useSession } from "next-auth/react";
import axios from "axios";

// import { } from "@/utilities/ExtensionHelpers";

type Props = {};

const ExtensionAdapter = (props: Props) => {
    const session = useSession();
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { refreshWorkspace, refreshWorkspaces } = useDatabase();

    const selectedWorkspaceRef = useRef(selectedWorkspace);
    useEffect(() => {
        selectedWorkspaceRef.current = selectedWorkspace;
    }, [selectedWorkspace]);

    // useEffect(() => {
    //     if (!selectedWorkspace?._id) {
    //         console.log("No workspace is selected");
    //         return;
    //     }

    //     setSelectedWorkspace({
    //         ...selectedWorkspace,
    //         tabs: []
    //     });
    // }, [selectedWorkspace?._id]);

    const communicationHandler = async ({ data: message }: any) => {
        if (selectedWorkspaceRef.current === null) {
            return;
        }

        switch (message.event) {
            case "EXT_TAB_CREATED": {
                console.log(message);

                const newTab: Tab = {
                    url: message.tab.url,
                    id: message.tab.id,
                    title: message.tab.title,
                    favIconUrl: message.tab.favIconUrl,
                };

                const newTabsList: Tab[] = [
                    ...selectedWorkspaceRef.current.tabs.slice(
                        0,
                        message.tab.index
                    ),
                    newTab,
                    ...selectedWorkspaceRef.current.tabs.slice(
                        message.tab.index
                    ),
                ];

                console.log(newTabsList);

                const newWorkspace: Workspace = {
                    ...selectedWorkspaceRef.current,
                    tabs: newTabsList,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_UPDATED": {
                const prevTabIndex =
                    selectedWorkspaceRef.current.tabs.findIndex(
                        (iteratedTab) => iteratedTab.id === message.tab.id
                    );

                if (prevTabIndex == -1) return;

                const newTabsList: Tab[] = [
                    ...selectedWorkspaceRef.current.tabs.slice(0, prevTabIndex),
                    {
                        url: message.tab.url,
                        id: message.tab.id,
                        title: message.tab.title,
                        favIconUrl: message.tab.favIconUrl,
                    },
                    ...selectedWorkspaceRef.current.tabs.slice(
                        prevTabIndex + 1
                    ), // remove the previous version of that tab
                ];

                const newWorkspace: Workspace = {
                    ...selectedWorkspaceRef.current,
                    tabs: newTabsList,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_REMOVED": {
                const remainingTabs = selectedWorkspaceRef.current.tabs.filter(
                    (tab) => tab.id != message.tabId
                );

                const newWorkspace: Workspace = {
                    ...selectedWorkspaceRef.current,
                    tabs: remainingTabs,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_MOVED": {
                setSelectedWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });
                refreshWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });

                break;
            }
            case "EXT_TAB_PINNED": {
                setSelectedWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });
                refreshWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });

                break;
            }
            default: {
                console.log(`No handling for this event ${message.event} yet.`);
                break;
            }
        }
    };

    useEffect(() => {
        window.addEventListener("message", communicationHandler);
    }, []);

    return;
};

export default ExtensionAdapter;
