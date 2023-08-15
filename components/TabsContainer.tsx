import React, { useEffect, useState } from "react";
import {
    Tab,
    Workspace,
    useSelectedWorkspace,
} from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"


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
import { Button } from "./ui/button";
import { ObjectId } from "mongodb";

type Props = {};

const styles = {
    tabsContainer: "w-full max-w-4xl mt-6",
    tabContainerHeader: "text-xl w-full flex justify-between mb-2",

    tabsListContainer: "flex flex-col gap-1",

    tabWrapper:
        "bg-gray-100 hover:bg-gray-200 h-9 py-auto px-1 text-sm transition flex justify-between items-center group cursor-pointer rounded-md relative",
    selectedTabWrapper:
        "bg-gray-200 hover:bg-gray-300 h-9 py-auto px-1 text-sm transition flex justify-between items-center group cursor-pointer rounded-md relative",

    buttonsContainer: "inline-flex gap-3 z-10 items-center",

    hoverButton: "hover:bg-gray-100 transition rounded-full p-1",
};

const TabsContainer = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { savedWorkspaces, refreshWorkspace, updateWorkspaceTabs } = useDatabase();

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

    // Move tabs to a different workspace
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
    const [moveToWorkspace, setMoveToWorkspace] = useState<string | undefined>(undefined);
    const moveTabs = () => {
        if (!moveToWorkspace) {
            setPopoverOpen(false);
            return;    
        }

        // Get tabs selected
        const tabs: Tab[] = selectedWorkspace.tabs.filter((tab, index) => selectedTabs.includes(index));
        const tabsIds: number[] = tabs.map((tab) => tab.id);
        const tabsUrls: string[] = tabs.map((tab) => tab.url);

        // Copy tabs to the other workspace
        updateWorkspaceTabs(moveToWorkspace, tabsUrls);

        // Close tabs from this workspace
        window.postMessage({
            event: "WEB_TAB_CLOSE",
            tabsIds
        })

        setSelectedTabs([]);
        setMoveToWorkspace(undefined);
        setPopoverOpen(false);
    }

    const openTab = (tab: Tab) => {
        window.postMessage({
            event: "WEB_TAB_ACTIVATE",
            tab: tab
        });
    };

    const copyLink = (url: string) => {
        navigator.clipboard.writeText(url);
        // TODO: Toast
                // Notify User
        toast({
            description: `Link copied to clipboard!`,
            duration: 2000
        })
    };

    const closeTab = (tabId: number) => {
        window.postMessage({
            event: "WEB_TAB_CLOSE",
            tabsIds: [tabId]
        })
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

    const handleDeleteTabs = async () => {
        // Separates closed tabs and remaining tabs
        const closedTabs: Tab[] = selectedWorkspace.tabs.filter((tab, index) =>
            selectedTabs.includes(index)
        );
        const remainingTabs: Tab[] = selectedWorkspace.tabs.filter(
            (tab, index) => !selectedTabs.includes(index)
        );

        const updatedWorkspace = {
            ...selectedWorkspace,
            tabs: remainingTabs,
        };

        // Update front-end
        setSelectedWorkspace(updatedWorkspace);
        refreshWorkspace(updatedWorkspace);

        setSelectedTabs([]);

        // Message extension to close tabs
        window.postMessage({
            event: "WEB_TABS_DELETED",
            tabs: closedTabs,
        });
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
                            <Popover open={popoverOpen} onOpenChange={(isOpen: boolean) => {
                                setPopoverOpen(isOpen)
                                setMoveToWorkspace(undefined)
                            }}>
                                <PopoverTrigger className="none">
                                    <span title="Move">
                                        <GoMoveToEnd />
                                    </span>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <p className="mb-3">Move to another workspace</p>

                                    <Select value={moveToWorkspace} onValueChange={(value: string) => setMoveToWorkspace(value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Workspace" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                savedWorkspaces?.map((workspace) => {
                                                    return (<SelectItem value={workspace._id.toString()}>{workspace.title}</SelectItem>);
                                                })
                                            }
                                        </SelectContent>
                                    </Select>

                                    <Button className="mt-3" onClick={moveTabs}>Move</Button>
                                </PopoverContent>
                            </Popover>
                            <span title="Save as Resource">
                                <GoBookmark />
                            </span>
                            <span title="Delete" onClick={handleDeleteTabs}>
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
                            <span className="flex items-center gap-1 w-full">
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
                                    className="inline-block w-3.5 h-3.5 aspect-square cursor-pointer"
                                    checked={isSelected}
                                    onChange={() => handleTabSelect(index)}
                                ></input>

                                <span
                                    className="ml-4 mr-10 w-full"
                                    onClick={() => {
                                        selectedTabs.length == 0
                                            ? openTab(tab)
                                            : handleTabSelect(index);
                                    }}
                                >
                                    <span className="h-full w-9g/12 flex items-center ">
                                        <img src={tab.favIconUrl} className="inline h-4 w-4 mr-3 aspect-square" />
                                        <span className="align-middle whitespace-nowrap overflow-hidden text-ellipsis">{tab.title}</span>
                                    </span>
                                </span>
                            </span>

                            <span
                                className={
                                    // "invisible inline-flex gap-3 mr-3 z-10 justify-self-end " +
                                    "opacity-0 transition inline-flex gap-3 pl-9 mr-3 z-10 justify-self-end absolute top-auto right-3 bg-gradient-to-r from-transparent to-gray-200 to-20% " +
                                    (selectedTabs.length == 0
                                        ? "group-hover:opacity-100"
                                        : "")
                                }
                            >
                                <span
                                    title="Copy Link"
                                    className={styles.hoverButton}
                                    onClick={() => {
                                        copyLink(tab.url);
                                    }}
                                >
                                    <GoPaste />
                                </span>
                                <span
                                    title="Save as Resource"
                                    className={styles.hoverButton}
                                >
                                    <GoBookmark />
                                </span>
                                <span
                                    title="Close"
                                    className={styles.hoverButton}
                                    onClick={() => {
                                        closeTab(tab.id);
                                    }}
                                >
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
