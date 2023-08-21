"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";

import TabsContainer from "@/components/TabsContainer";
import ResourcesContainer from "@/components/ResourcesContainer";
import DeleteWorkspace from "@/components/DeleteWorkspace"
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import { useDatabase } from "@/utilities/databaseContext";
import SyncWorkspace from "@/components/SyncWorkspace";

type Props = {};

const styles = {
    container: "px-14 py-10 flex-1 overflow-auto w-full h-full relative",
    headContainer: "text-3xl flex justify-between max-w-4xl align-middle",
    title: "bg-transparent border-none outline-none",
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

                
                <div className="inline-flex gap-2">
                    <SyncWorkspace />
                    <DeleteWorkspace />
                </div>
            </div>
            
            <div>                
                {/* <DragDropContext onDragEnd={onDragEnd}> */}
                <TabsContainer />

                <ResourcesContainer />
                {/* </DragDropContext> */}
            </div>
        </div>
    );
};

export default Workspace;
