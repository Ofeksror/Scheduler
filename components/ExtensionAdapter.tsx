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
                const newTab: Tab = {
                    url: message.tab.url,
                    id: message.tab.id,
                    title: message.tab.title,
                    faviconUrl: message.tab.faviconUrl,
                }

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
                        (iteratedTab) =>
                            iteratedTab.id === message.tab.id
                    );

                const newTabsList: Tab[] = [
                    ...selectedWorkspaceRef.current.tabs.slice(0, prevTabIndex),
                    {
                        url: message.tab.url,
                        id: message.tab.id,
                        title: message.tab.title,
                        faviconUrl: message.tab.faviconUrl,
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
                const remainingTabs = selectedWorkspaceRef.current.tabs.filter((tab) => tab.id != message.tabId);

                const newWorkspace: Workspace = {
                    ...selectedWorkspaceRef.current,
                    tabs: remainingTabs,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_MOVED": {

                /*
                const moved = [
                    ...arr.slice(0, from),
                    ...arr.slice(from + 1, to),
                    arr[from],
                    ...arr.slice(to)
                ];

                const moved = [
                    ...arr.slice(0, to),
                    arr[from],
                    ...arr.slice(to, from),
                    ...arr.slice(from + 1)
                ];
                */

                const { fromIndex, toIndex } = message.moveInfo;

                if (toIndex < fromIndex) {
                    const movedTab: Tab =
                        selectedWorkspaceRef.current.tabs[fromIndex];

                    const newTabsList: Tab[] = [
                        ...selectedWorkspaceRef.current.tabs.slice(0, toIndex),
                        movedTab,
                        ...selectedWorkspaceRef.current.tabs.slice(
                            toIndex,
                            fromIndex
                        ),
                        ...selectedWorkspaceRef.current.tabs.slice(
                            fromIndex + 1
                        ),
                    ];

                    console.log(newTabsList);

                    const newWorkspace: Workspace = {
                        ...selectedWorkspaceRef.current,
                        tabs: newTabsList,
                    };

                    setSelectedWorkspace(newWorkspace);
                    refreshWorkspace(newWorkspace);
                } else if (fromIndex < toIndex) {
                    const movedTab: Tab =
                        selectedWorkspaceRef.current.tabs[fromIndex];

                    const newTabsList: Tab[] = [
                        ...selectedWorkspaceRef.current.tabs.slice(
                            0,
                            fromIndex
                        ),
                        ...selectedWorkspaceRef.current.tabs.slice(
                            fromIndex + 1,
                            toIndex
                        ),
                        movedTab,
                        ...selectedWorkspaceRef.current.tabs.slice(toIndex),
                    ];

                    console.log(newTabsList);

                    const newWorkspace: Workspace = {
                        ...selectedWorkspaceRef.current,
                        tabs: newTabsList,
                    };

                    setSelectedWorkspace(newWorkspace);
                    refreshWorkspace(newWorkspace);
                }
                else {
                    console.log("WHAT");
                }

                break;
            }
            default: {
                console.log(`No handling for this event ${message.event} yet.`);
                break;
            }
        }
    };

    const syncToDatabase = async () => {

        const tabsUrls = selectedWorkspace?.tabs.map((tab) => tab.id);

        await axios({
            url: "/api/workspaces/update/",
            method: "PUT",
            data: {
                workspace: {
                    id: selectedWorkspace?._id,
                    title: selectedWorkspace?.title,
                    tabsUrls,
                }
            }
        })
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    console.log("Successfully synced to database");
                }
            })
            .catch((error) => {
                console.warn(error);
            })
    }

    useEffect(() => {
        window.addEventListener("message", communicationHandler);
    }, []);

    return (
        <div>
            <button onClick={syncToDatabase}>Sync to DB</button>
        </div>
    );
};

export default ExtensionAdapter;
