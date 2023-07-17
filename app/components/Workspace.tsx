"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { tabType, useSelectedWorkspace } from "../utilities/WorkspaceContext";

import TabsContainer from "./TabsContainer";
import { DragDropContext } from "react-beautiful-dnd";

type Props = {};

const styles = {
    container: "px-12 py-4 flex-1 overflow-auto w-full relative",
    headContainer: "text-2xl",
    title: "",
};

const onDragEnd = (result: any) => {
    // TODO
}

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
                <div className={styles.headContainer}>
                    <h1>
                        Unsaved Workspace🤭{" "}
                        <span className="text-lg text-slate-600">
                            ID#{selectedWorkspace.id}
                        </span>
                    </h1>
                </div>

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
                
                <DragDropContext onDragEnd={onDragEnd}>
                    <TabsContainer />
                </DragDropContext>
            </div>
        </div>
    );
};

export default Workspace;
