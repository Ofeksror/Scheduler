"use client"
import { Tab, useSelectedWorkspace } from '@/utilities/WorkspaceContext';
import { useDatabase } from '@/utilities/databaseContext';
import axios from 'axios';
import React, { useEffect } from 'react'

type Props = {}

const SyncWorkspace = (props: Props) => {

    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { refreshWorkspace } = useDatabase();

    const communicationHandler = async ({ data: message }: any) => {
        if (selectedWorkspace === null) {
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
                        _id: selectedWorkspace._id,
                        title: selectedWorkspace.title,
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
                ...selectedWorkspace,
                tabs,
                tabsUrls
            })

            refreshWorkspace({
                ...selectedWorkspace,
                tabs,
                tabsUrls
            })
        }
    }

    useEffect(() => {
        window.addEventListener("message", communicationHandler);
    }, []);

    const syncTabs = async () => {
        // Refresh - get tabs from chrome and sync, update tabs[] in selectedWorkspace

        if (selectedWorkspace == null) return;

        window.postMessage({
            event: "WEB_TABS_REQUEST",
        });
    };

  return (
    <button onClick={syncTabs}>Sync</button>
  )
}

export default SyncWorkspace