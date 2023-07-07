import React, { useEffect, useState } from "react";
import { useSelectedWorkspace } from "../utilities/WorkspaceContext";

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
    tabsContainer: "w-full mt-6",
    tabContainerHeader: "text-xl w-full flex justify-between",

    tabsListContainer: "flex flex-col gap-0.5 bg-slate-400",

    tabWrapper:
        "bg-slate-300 py-2 px-4 hover:bg-slate-400 flex justify-between items-center group cursor-pointer",
    selectedTabWrapper:
        "bg-slate-400 py-2 px-4 flex justify-between content-center",

    buttonsContainer: "inline-flex gap-3",
};

const TabsContainer = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    if (selectedWorkspace === null) {
        return;
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
                    const isSelected = selectedTabs.includes(tab.id);

                    return (
                        <li
                            className={
                                isSelected
                                    ? styles.selectedTabWrapper
                                    : styles.tabWrapper
                            }
                            onClick={() => handleTabSelect(tab.id)}
                            key={index}
                        >
                            <span className="inline-flex items-center gap-4">
                                <span
                                    className={
                                        "invisible w-5 text-2xl " +
                                        (selectedTabs.length == 0
                                            ? "group-hover:visible"
                                            : "")
                                    }
                                >
                                    <GoGrabber />
                                </span>

                                <input
                                    type="checkbox"
                                    className="inline-block w-5 text-2xl"
                                    checked={isSelected}
                                ></input>
                                <span>
                                    {tab.title} , {tab.url}
                                </span>
                            </span>

                            <span
                                className={
                                    "hidden gap-3 " +
                                    (selectedTabs.length == 0
                                        ? "group-hover:inline-flex"
                                        : "")
                                }
                            >
                                <span title="Move">
                                    <GoMoveToEnd />
                                </span>
                                <span title="Copy Link">
                                    <GoPaste />
                                </span>
                                <span title="Save as Resource">
                                    <GoBookmark />
                                </span>
                                <span title="Close">
                                    <GoX />
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TabsContainer;
