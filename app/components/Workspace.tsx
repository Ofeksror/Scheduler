"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
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
    tabText: "mx-4",
};

const TabsContainer = ({ tabs }: { tabs: string[] }) => {
    return (
        <div className={styles.tabsContainer}>
            <h1 className={styles.tabContainerHeader}>Tabs</h1>
            <ul className={styles.tabsListContainer}>
                {tabs.map((tab, index) => {
                    return (
                        <li className={styles.tabWrapper}>
                            <input type="checkbox"></input>
                            <span className={styles.tabText} key={index}>{tab}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const Workspace = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    // Unselected Workspace
    if (selectedWorkspace === null) {
        // Loading Screen
        return <h1>🔔Please select a workspace🔔</h1>;
    }

    // Unsaved Workspace
    if (!selectedWorkspace.title && selectedWorkspace.id) {
        return (
            <div className={styles.container}>
                <h1>Unsaved Workspace🤭</h1>
                <p>ID: {selectedWorkspace.id}</p>

                <TabsContainer tabs={selectedWorkspace.tabs} />
            </div>
        );
    }

    // Saved Workspace
    const [workspaceTitle, setWorkspaceTitle] = useState<string>(
        selectedWorkspace.title || ""
    );
    const titleInputRef = useRef<any>(null);

    useEffect(() => {
        setWorkspaceTitle(selectedWorkspace.title || "Unsaved Workspace");
    }, [selectedWorkspace]);

    const handleKeyDown = (e: { key: string }) => {
        if (titleInputRef === null || titleInputRef.current === null) return;

        if (e.key === "Enter") {
            titleInputRef.current.blur(); // Remove focus from input

            // Update Title
            setSelectedWorkspace({
                ...selectedWorkspace,
                title: workspaceTitle,
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.headContainer}>
                <input
                    ref={titleInputRef}
                    className={styles.title}
                    value={workspaceTitle}
                    onChange={(e) => {
                        setWorkspaceTitle(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                ></input>
            </div>
            <div>
                <p>{selectedWorkspace.title}</p>
                <p>ID: {selectedWorkspace.id}</p>
                <TabsContainer tabs={selectedWorkspace.tabs} />
            </div>
        </div>
    );
};

export default Workspace;
