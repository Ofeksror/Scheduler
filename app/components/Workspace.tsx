"use client";
import React, { useState, useEffect, useRef } from "react";
import { unsavedWorkspaces, savedWorkspaces } from "../utilities/database";

type Props = {
    selectedWorkspaceId: number | null;
};

const styles = {
    container: "",
    headContainer: "",
    title: "",
};

const Workspace = (props: Props) => {
    const [workspaceTitle, setWorkspaceTitle] = useState<string>("");
    const titleInputRef = useRef(null);

    const handleKeyDown = (e: { key: string }) => {
        if (titleInputRef == null) return;
        if (e.key === "Enter") {
            titleInputRef.current.blur();

            // TODO: Update Title
            console.log("TODO!");
        }
    };

    useEffect(() => {
        setWorkspaceTitle("Job hunting");
    }, []);

    if (props.selectedWorkspaceId == null) {
        return (
            <div className={styles.container}>
                <p>Nothing selected :)</p>
            </div>
        );
    }

    let wkspc = null;

    // Find the right workspace
    for (let i = 0; i < unsavedWorkspaces.length; i++) {
        if (unsavedWorkspaces[i].id == props.selectedWorkspaceId) {
            wkspc = unsavedWorkspaces[i];
        }
    }

    for (let i = 0; i < savedWorkspaces.length; i++) {
        if (savedWorkspaces[i].id == props.selectedWorkspaceId) {
            wkspc = savedWorkspaces[i];
        }
    }

    return (
        <div className={styles.container}>
            {/* Title */}
            <div className={styles.headContainer}>
                <input
                    type="text"
                    ref={titleInputRef}
                    className={styles.title}
                    value={workspaceTitle}
                    onChange={(e) => {
                        setWorkspaceTitle(e.target.value);
                    }}
                    onKeyDown={handleKeyDown}
                ></input>
            </div>
            <p>{workspaceTitle}</p>
            <p>{wkspc.id}</p>
        </div>
    );
};

export default Workspace;
