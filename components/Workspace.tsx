"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { tabType, useSelectedWorkspace } from "@/utilities/WorkspaceContext";

import TabsContainer from "@/components/TabsContainer";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import { useDatabase } from "@/utilities/databaseContext";

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
    const { refreshWorkspace } = useDatabase();
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    // Handle switching to different workspaces
    useEffect(() => {
        setWorkspaceTitle(selectedWorkspace?.title || "Unsaved Workspace");
    }, [selectedWorkspace]);

    // Unsaved Workspace
    // TODO: Render something else if it is unsaved workspace

    // Saved Workspace
    const [workspaceTitle, setWorkspaceTitle] = useState<string>(
        selectedWorkspace?.title || ""
    );
    const titleInputRef = useRef<any>(null);
    
    // Unselected Workspace
    if (selectedWorkspace === null) {
        // Loading Screen
        return (
            <div className="h-full w-full flex items-center justify-center">
                <h1 className="text-gray-500">No workspace selected</h1>
            </div>
        );
    }
    
    const handleKeyDown = (e: { key: string }) => {
        if (titleInputRef === null || titleInputRef.current === null) return;

        if (e.key === "Enter") {
            titleInputRef.current.blur(); // Remove focus from input

            // Update title (Selected Workspace: visually displayed)
            setSelectedWorkspace({
                ...selectedWorkspace,
                title: workspaceTitle,
            });

            // Update title on database
            axios({
                method: "put",
                url: `/api/workspaces/title/`,
                data: {
                    workspaceId: selectedWorkspace._id,
                    title: workspaceTitle
                }
            })
                .then((res) => {
                    refreshWorkspace(res.data.workspace);
                    setSelectedWorkspace(res.data.workspace);
                })
                .catch((error) => {
                    console.warn(error);
                })
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
                <p>ID: {selectedWorkspace._id.toString()}</p>
                
                {/* <DragDropContext onDragEnd={onDragEnd}> */}
                <TabsContainer />
                {/* </DragDropContext> */}
            </div>
        </div>
    );
};

export default Workspace;
