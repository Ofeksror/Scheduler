import React, { useEffect, useState } from "react";
import { useSelectedWorkspace } from "../utilities/WorkspaceContext";

type Props = {};

const styles = {
    container: "flex-1 overflow-auto w-full relative",
    headContainer: "",
    title: "",

    tabsContainer: "w-11/12 mx-auto",
    tabContainerHeader: "text-2xl",
    tabsListContainer: "flex flex-col gap-2",
    tabWrapper: "bg-slate-300 py-2 px-4",
    selectedTabWrapper: "bg-slate-400 py-2 px-4",
    tabText: "mx-4",
};

const TabsContainer = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    if (selectedWorkspace === null) {
        // Loading Screen
        return <h1>🔔Please select a workspace🔔</h1>;
    }

    const [selectedTabs, setSelectedTabs] = useState<number[]>([]);

    // Reset tab selection when switching workspaces
    useEffect(() => {
        setSelectedTabs([]);
    }, [selectedWorkspace]);

    const handleTabSelect = (id: number) => {
        const tabIndex = selectedTabs.indexOf(id);

        // Tab is not selected
        if (tabIndex === -1) {
            // Select tab
            setSelectedTabs([...selectedTabs, id]);
            return;
        } else {
            // Tab already selected => Deselect tab
            setSelectedTabs([
                ...selectedTabs.slice(0, tabIndex),
                ...selectedTabs.slice(tabIndex + 1),
            ]);
            return;
        }
    };

    return (
        <div className={styles.tabsContainer}>
            <h1 className={styles.tabContainerHeader}>Tabs</h1>
            <ul className={styles.tabsListContainer}>
                {selectedWorkspace.tabs.map((tab, index) => {
                    if (selectedTabs.includes(tab.id))
                        return (
                            <li
                                className={styles.selectedTabWrapper}
                                onClick={() => handleTabSelect(tab.id)}
                            >
                                <input type="checkbox" checked></input>
                                <span className={styles.tabText} key={index}>
                                    {tab.title} , {tab.url}
                                </span>
                            </li>
                        );
                    else {
                        return (
                            <li
                                className={styles.tabWrapper}
                                onClick={() => handleTabSelect(tab.id)}
                            >
                                <input type="checkbox" checked={false}></input>
                                <span className={styles.tabText} key={index}>
                                    {tab.title} , {tab.url}
                                </span>
                            </li>
                        );
                    }
                })}
            </ul>
        </div>
    );
};

export default TabsContainer;
