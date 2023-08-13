"use client"
import { Tab, useSelectedWorkspace } from '@/utilities/WorkspaceContext';
import { useDatabase } from '@/utilities/databaseContext';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'

type Props = {}

const SyncWorkspace = (props: Props) => {

    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { refreshWorkspace } = useDatabase();

    const selectedWorkspaceRef = useRef(selectedWorkspace);
    useEffect(() => {
        selectedWorkspaceRef.current = selectedWorkspace;
    }, [selectedWorkspace]);

    const communicationHandler = async ({ data: message }: any) => {
        if (selectedWorkspaceRef.current === null) {
            return;
        }

        if (message.event == "EXT_TABS_REQUEST") {
            const tabsUrls: string[] = message.tabs.map((tab: any) => tab.url);
            const tabs: Tab[] = message.tabs.map((tab: any) => {
                return {
                    url: tab.url,
                    id: tab.id,
                    title: tab.title,
                    faviconUrl: tab.faviconUrl,
                };
            });

            await axios({
                url: "/api/workspaces/update",
                method: "PUT",
                data: {
                    workspace: {
                        _id: selectedWorkspaceRef.current._id,
                        title: selectedWorkspaceRef.current.title,
                        tabsUrls,
                    },
                },
            })
                .then((res) => {
                    if (res.status == 200) {
                        return;
                    }
                })
                .catch((error) => {
                    console.warn("Error syncing workspace to DB:");
                    console.warn(error);
                });

            setSelectedWorkspace({
                ...selectedWorkspaceRef.current,
                tabs,
                tabsUrls
            })

            refreshWorkspace({
                ...selectedWorkspaceRef.current,
                tabs,
                tabsUrls
            })
        }
    }

    useEffect(() => {
        window.addEventListener("message", communicationHandler);
    }, []);

    const syncTabs = async () => {
        if (selectedWorkspaceRef.current == null) return;

        window.postMessage({
            event: "WEB_TABS_REQUEST",
        });
    };

  return (
    <button onClick={syncTabs}>Sync</button>
  )
}

export default SyncWorkspace