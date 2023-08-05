import React, { useEffect, useState } from "react";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";

import NewTab from "@/components/demo/newTab";

// Icons
import {
    GoKebabHorizontal,
    GoMoveToEnd,
    GoPaste,
    GoBookmark,
    GoTrash,
    GoGrabber,
    GoX,
} from "react-icons/go";

type Props = {};

const styles = {
    tabsContainer: "w-full max-w-4xl mt-6",
    tabContainerHeader: "text-xl w-full flex justify-between",

    tabsListContainer: "flex flex-col gap-0.5",

    tabWrapper:
        "bg-gray-100 py-1.5 px-1 text-sm hover:bg-gray-200 transition flex justify-between items-center group cursor-pointer rounded-md",
        // "bg-slate-300 py-2.5 px-1 hover:bg-slate-400 flex justify-between items-center group cursor-pointer",
    selectedTabWrapper:
    "bg-gray-200 hover:bg-gray-300 transition py-1.5 px-1 text-sm flex justify-between content-center cursor-pointer rounded-md",

    buttonsContainer: "inline-flex gap-3",

    hoverButton: "hover:bg-slate-300 rounded-full p-1"
};


const TabsContainer = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    // order = [ids of tabs (stores in database)]

    if (selectedWorkspace === null) {
        return;
    }

    // Stores the indexes of the tabs selected
    const [selectedTabs, setSelectedTabs] = useState<number[]>([]);

    // Reset tab selection when switching workspaces
    useEffect(() => {
        setSelectedTabs([]);
    }, [selectedWorkspace]);
    
    const openTab = (url: string) => {
        window.open(url, "_blank");
    }

    const copyLink = (url: string) => {
        navigator.clipboard.writeText(url)
    }

    const handleTabSelect = (tabIndexKey: number) => {
        const indexInSelectedTabs = selectedTabs.indexOf(tabIndexKey);

        // Tab is not selected
        if (indexInSelectedTabs === -1) {
            // Select tab
            setSelectedTabs([...selectedTabs, tabIndexKey]);
            return;
        } else {
            // Tab already selected => Deselect tab
            setSelectedTabs([
                ...selectedTabs.slice(0, indexInSelectedTabs),
                ...selectedTabs.slice(indexInSelectedTabs + 1),
            ]);
            return;
        }
    };

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabContainerHeader}>
                {selectedTabs.length == 0 ? (
                    <>
                        <h1>Tabs</h1>

                        <span className={styles.buttonsContainer}>
                            <span>
                                <GoKebabHorizontal />
                            </span>
                        </span>
                    </>
                ) : (
                    <>
                        <span>{selectedTabs.length} Tabs Selected</span>

                        <span className={styles.buttonsContainer}>
                            <span title="Move">
                                <GoMoveToEnd />
                            </span>
                            <span title="Save as Resource">
                                <GoBookmark />
                            </span>
                            <span title="Delete">
                                <GoTrash />
                            </span>
                        </span>
                    </>
                )}
            </div>
            <ul className={styles.tabsListContainer}>
                {selectedWorkspace.tabs.map((tab, index) => {
                    const isSelected = selectedTabs.includes(index);

                    return (
                        <li
                            className={
                                isSelected
                                    ? styles.selectedTabWrapper
                                    : styles.tabWrapper
                            }
                            key={index}
                        >
                            <span className="inline-flex items-center gap-1 w-full">
                                <span
                                    className={
                                        "invisible w-3 text-xl " +
                                        (selectedTabs.length == 0
                                            ? "group-hover:visible"
                                            : "")
                                    }
                                >
                                    <GoGrabber />
                                </span>

                                <input
                                    type="checkbox"
                                    className="inline-block w-5 text-2xl cursor-pointer"
                                    checked={isSelected}
                                    onClick={() => handleTabSelect(index)}
                                ></input>
                                <span className="ml-4 w-full"
                                    onClick={() => {selectedTabs.length == 0 ? openTab(tab.url) : handleTabSelect(index)}}
                                >
                                    {tab.title}
                                </span>
                            </span>

                            <span
                                className={
                                    "invisible inline-flex gap-3 mr-3 ml-3 " +
                                    (selectedTabs.length == 0
                                        ? "group-hover:visible"
                                        : "")
                                }
                            >
                                <span title="Move" className={styles.hoverButton}>
                                    <GoMoveToEnd />
                                </span>
                                <span title="Copy Link"
                                    className={styles.hoverButton}
                                    onClick={() => {copyLink(tab.url)}}>
                                    <GoPaste />
                                </span>
                                <span title="Save as Resource" className={styles.hoverButton}>
                                    <GoBookmark />
                                </span>
                                <span title="Close" className={styles.hoverButton}>
                                    <GoX />
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>

            {/* TEST / DEMO */}
            <div className="bg-red-200 mt-20">
                <NewTab workspaceId={selectedWorkspace._id}/>
            </div>
        </div>
    );
};

export default TabsContainer;
