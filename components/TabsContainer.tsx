import React, { useEffect, useState } from "react";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";

import NewTab from "@/components/NewTab";

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
        "bg-gray-100 h-10 py-auto px-1 text-sm hover:bg-gray-200 transition flex justify-between items-center group cursor-pointer rounded-md relative",
    selectedTabWrapper:
    "bg-gray-200 hover:bg-gray-300 transition h-10 py-auto px-1 text-sm flex justify-between content-center cursor-pointer rounded-md relative",

    buttonsContainer: "inline-flex gap-3 z-10",

    hoverButton: "hover:bg-gray-100 transition rounded-full p-1"
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
                                <span className="ml-4 mr-10 w-full whitespace-nowrap overflow-hidden text-ellipsis "
                                    onClick={() => {selectedTabs.length == 0 ? openTab(tab.url) : handleTabSelect(index)}}
                                >
                                    {tab.title}
                                </span>
                            </span>

                            <span
                                className={
                                    // "invisible inline-flex gap-3 mr-3 z-10 justify-self-end " +
                                    "opacity-0 transition inline-flex gap-3 pl-8 mr-3 z-10 justify-self-end absolute top-auto right-3 bg-gradient-to-r from-transparent to-gray-200 to-20% " +
                                    (selectedTabs.length == 0
                                        ? "group-hover:opacity-100"
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

            <NewTab />
        </div>
    );
};

export default TabsContainer;
