"use client";
import React, { useEffect, useRef, useState } from "react";
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
    const { selectedWorkspace, setSelectedWorkspace, switchWorkspace } = useSelectedWorkspace();
    const { refreshWorkspace, refreshWorkspaces } = useDatabase();

    const selectedWorkspaceRef = useRef(selectedWorkspace);
    useEffect(() => {
        selectedWorkspaceRef.current = selectedWorkspace;
    }, [selectedWorkspace]);
    const sessionRef = useRef(session);
    useEffect(() => {
        sessionRef.current = session;
    }, [session])


    const communicationHandler = async ({ data: message }: any) => {
        if (selectedWorkspaceRef.current === null) {
            if (message.event == "EXT_WORKSPACE_NEW") {
                const userId = sessionRef.current.data?.user?._id;
                const tabsUrls: string[] = message.tabs.map((tab: any) => tab.url);

                const workspace = await axios({
                    method: "post",
                    url: `/api/workspaces/new/`,
                    data: {
                        title: message.workspaceTitle,
                        tabsUrls,
                        resources: [],
                    }
                })
                    .then((res) => {
                        return res.data.workspace
                    })
                    .catch((error) => {
                        console.warn(error);
                    });

                await axios({
                    method: "put",
                    url: "/api/users/user/workspace/",
                    data: {
                        userId,
                        workspaceId: workspace._id
                    }
                })
                    .then((res) => {
                        if (res.status === 201) {
                            // Nothing changed.
                            console.log("Nothing changed");
                            return;
                        }
                        console.log("✅ :: New workspace successfully attached to user >>")
                    })
                    .catch((error) => {
                        console.warn(error);
                    })
                
                // Update client-side
                refreshWorkspace(workspace);
                setSelectedWorkspace({
                    _id: workspace._id,
                    title: workspace.title,
                    tabs: message.tabs,
                    tabsUrls: tabsUrls,
                    resources: workspace.resources
                });
            }

            return;
        }

        switch (message.event) {
            case "EXT_TAB_CREATED": {
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

                const newWorkspace: Workspace = {
                    ...selectedWorkspaceRef.current,
                    tabs: newTabsList,
                };

                setSelectedWorkspace(newWorkspace);
                // refreshWorkspace(newWorkspace);
                // setRequestsCounter(requestsCounter + 1);

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
                // refreshWorkspace(newWorkspace);
                // setRequestsCounter(requestsCounter + 1);

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
                // refreshWorkspace(newWorkspace);
                // setRequestsCounter(requestsCounter + 1);

                break;
            }
            case "EXT_TAB_MOVED": {
                setSelectedWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });
                // refreshWorkspace({
                //     ...selectedWorkspaceRef.current,
                //     tabs: message.tabs,
                // });
                // setRequestsCounter(requestsCounter + 1);

                break;
            }
            case "EXT_TAB_PINNED": {
                setSelectedWorkspace({
                    ...selectedWorkspaceRef.current,
                    tabs: message.tabs,
                });
                // refreshWorkspace({
                //     ...selectedWorkspaceRef.current,
                //     tabs: message.tabs,
                // });

                break;
            }
            case "EXT_TABS_REQUEST": {
                const tabsUrls: string[] = message.tabs.map((tab: any) => tab.url);
                const tabs: Tab[] = message.tabs.map((tab: any) => {
                    return {
                        url: tab.url,
                        id: tab.id,
                        title: tab.title,
                        favIconUrl: tab.favIconUrl,
                    };
                });
                

                // Update client
                if (!message.switchingWorkspace) {
                    setSelectedWorkspace({
                        ...selectedWorkspaceRef.current,
                        tabs,
                        tabsUrls
                    })
                }

                const newWorkspaceObject: Workspace = {
                    _id: message.workspaceId,
                    title: message.workspaceTitle,
                    tabs,
                    tabsUrls,
                    resources: message.workspaceResources
                }

                refreshWorkspace(newWorkspaceObject)

                // Update database
                await axios({
                    url: "/api/workspaces/update/",
                    method: "PUT",
                    data: {
                        workspace: {
                            _id: message.workspaceId,
                            title: message.workspaceTitle,
                            tabsUrls,
                            resources: message.workspaceResources
                        }
                    }
                })
                    .catch((error) => {
                        console.warn("ERROR trying to sync workspace to database: ", error);
                    })

                break;
            }
            case "EXT_WORKSPACE_CLOSE": {  
                
                const tabsUrls = message.tabs.map((tab: any) => tab.url);

                const newWorkspaceObject = {
                    _id: selectedWorkspaceRef.current._id,
                    title: selectedWorkspaceRef.current.title,
                    tabsUrls,
                    resources: selectedWorkspaceRef.current.resources
                }
                
                setSelectedWorkspace(null);

                refreshWorkspace({
                    ...newWorkspaceObject,
                    tabs: message.tabs
                });

                // Update database
                await axios({
                    url: "/api/workspaces/update/",
                    method: "PUT",
                    data: {
                        workspace: newWorkspaceObject
                    }
                })
                    .catch((error) => {
                        console.warn("ERROR trying to sync workspace to database: ", error);
                    })
                
                break;
            }
            case "EXT_TABS_OPENED": {
                const tabsUrls = message.openedTabs.map((tab: any) => tab.url);
                const tabs = message.openedTabs.map((tab: any) => {return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    favIconUrl: tab.favIconUrl,
                }});

                const newWorkspaceObject = {
                    ...selectedWorkspaceRef.current,
                    tabs,
                    tabsUrls
                }
                
                setSelectedWorkspace(newWorkspaceObject)
                refreshWorkspace(newWorkspaceObject);

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

    return (<></>);
};

export default ExtensionAdapter;