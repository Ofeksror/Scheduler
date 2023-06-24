import React from "react";
import { useEffect, useState } from "react";

type Props = {};

const styles = {
    sidebarContainer: "",
};

const Sidebar = (props: Props) => {
    const [savedWorkspaces, setSavedWorkspaces] = useState<number[]>([]);
    const [unsavedWorkspaces, setUnsavedWorkspaces] = useState<number[]>([]);

    useEffect(() => {
        // Fetch Unsaved workspaces from cache
        setUnsavedWorkspaces([1, 2, 3]);

        // Fetch Saved workspaces (ids)
        setSavedWorkspaces([5, 6, 8]);
    }, []);

    return (
        <div className={styles.sidebarContainer}>
            {/* Unsaved Workspaces */}
            <div>
                {unsavedWorkspaces.map((workspace) => {
                    return <h1>{workspace}</h1>;
                })}
            </div>

            <hr></hr>

            {/* Unsaved Workspaces */}
            <div>
                {savedWorkspaces.map((workspace) => {
                    return <h1>{workspace}</h1>;
                })}
            </div>
        </div>
    );
};

export default Sidebar;
