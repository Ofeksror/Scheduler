"use client";
import React, { useEffect, useRef } from "react";
import {
    tabType,
    useSelectedWorkspace,
    workspaceType,
} from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import { useSession } from "next-auth/react";

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

    const communicationHandler = async ({ data: message }: any) => {

        if (selectedWorkspaceRef.current === null) {
            return;
        }

        switch (message.event) {
            case "EXT_TAB_CREATED": {
                const newTab: tabType = {
                    _id: null,
                    title: message.tab.title,
                    url: message.tab.url,
                    pinned: message.tab.pinned,
                    browserTabId: message.tab.browserTabId,
                    faviconUrl: message.tab.faviconUrl,
                };

                const newTabsList: tabType[] = [
                    ...selectedWorkspaceRef.current.tabs.slice(
                        0,
                        message.tab.index
                    ),
                    newTab,
                    ...selectedWorkspaceRef.current.tabs.slice(
                        message.tab.index
                    ),
                ];

                const newWorkspace: workspaceType = {
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
                            iteratedTab.browserTabId === message.tab.id
                    );

                const newTabsList: tabType[] = [
                    ...selectedWorkspaceRef.current.tabs.slice(0, prevTabIndex),
                    {
                        _id: null,
                        title: message.tab.title,
                        url: message.tab.url,
                        pinned: message.tab.pinned,
                        browserTabId: message.tab.id,
                        faviconUrl: message.tab.faviconUrl,
                    },
                    ...selectedWorkspaceRef.current.tabs.slice(
                        prevTabIndex + 1
                    ), // remove the previous version of that tab
                ];

                const newWorkspace: workspaceType = {
                    ...selectedWorkspaceRef.current,
                    tabs: newTabsList,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_REMOVED": {
                const newTabList = selectedWorkspaceRef.current.tabs.filter(
                    (iteratedTab) => {
                        iteratedTab.browserTabId !== message.browserTabId;
                    }
                );

                const newWorkspace: workspaceType = {
                    ...selectedWorkspaceRef.current,
                    tabs: newTabList,
                };

                setSelectedWorkspace(newWorkspace);
                refreshWorkspace(newWorkspace);

                break;
            }
            case "EXT_TAB_MOVED": {
                const { fromIndex, toIndex } = message.moveInfo;

                if (toIndex < fromIndex) {
                    const movedTab: tabType =
                        selectedWorkspaceRef.current.tabs[fromIndex];

                    const newTabsList: tabType[] = [
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

                    const newWorkspace: workspaceType = {
                        ...selectedWorkspaceRef.current,
                        tabs: newTabsList,
                    };

                    setSelectedWorkspace(newWorkspace);
                    refreshWorkspace(newWorkspace);
                } else if (fromIndex < toIndex) {
                    const movedTab: tabType =
                        selectedWorkspaceRef.current.tabs[fromIndex];

                    const newTabsList: tabType[] = [
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

                    const newWorkspace: workspaceType = {
                        ...selectedWorkspaceRef.current,
                        tabs: newTabsList,
                    };

                    setSelectedWorkspace(newWorkspace);
                    refreshWorkspace(newWorkspace);
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
