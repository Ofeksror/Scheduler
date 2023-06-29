"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelectedWorkspace } from "../utilities/WorkspaceContext";

type Props = {};

const styles = {
    container: "",
    headContainer: "",
    title: "",
};

const TabsContainer = ({ tabs }: { tabs: string[] }) => {
    return (
        <div>
            <h1>Tabs</h1>
            <ul>
                {tabs.map((tab, index) => {
                    return (
                        <li>
                            <span>[ ]</span>
                            <span key={index}>{tab}</span>
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
        return <h1>Please select a workspace.</h1>;
    }

    // Unsaved Workspace
    if (!selectedWorkspace.title && selectedWorkspace.id) {
        return (
            <div>
                <h1>Unsaved Workspace :)</h1>
                <p>ID: {selectedWorkspace.id}</p>

                <TabsContainer tabs={selectedWorkspace.tabs} />
            </div>
        );
    }

    // Saved Workspace
    const [workspaceTitle, setWorkspaceTitle] = useState<string>(
        selectedWorkspace.title || ""
    );
    const titleInputRef = useRef(null);

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
