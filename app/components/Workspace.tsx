"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { tabType, useSelectedWorkspace } from "../utilities/WorkspaceContext";

import TabsContainer from "./TabsContainer";

type Props = {};

const styles = {
    container: "flex-1 overflow-auto w-full relative",
    headContainer: "",
    title: "",
};

const Workspace = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    // Unselected Workspace
    if (selectedWorkspace === null) {
        return;
    }

    // Unsaved Workspace
    if (!selectedWorkspace.title && selectedWorkspace.id) {
        return (
            <div className={styles.container}>
                <h1>Unsaved Workspace🤭</h1>
                <p>ID: {selectedWorkspace.id}</p>

                <TabsContainer />
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
                <TabsContainer />
            </div>
        </div>
    );
};

export default Workspace;
