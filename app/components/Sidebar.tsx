import React, { Dispatch, SetStateAction } from "react";

import { unsavedWorkspaces, savedWorkspaces } from "../utilities/database";

type Props = {
    selectedWorkspaceId: number | null;
    setSelectedWorkspaceId: Dispatch<SetStateAction<number | null>>;
};

const styles = {
    sidebarContainer: "relative float-left w-60 h-full bg-slate-400 p-4",
    logo: "text-xl font-bold text-white bg-slate-500 p-4 flex place-content-center",
    workspacesContainer: "bg-slate-300 my-8",
    workspaces: "",
    workspaceItem:
        "bg-slate-400 hover:bg-slate-500 hover:cursor-pointer p-2 my-1",
    divider: "w-4/5 h-1 border-0 rounded bg-slate-500 mx-auto",
    footer: "absolute bottom-0 right-0 p-4 w-full h-auto flex place-content-between",
    avatar: "rounded-full bg-slate-600 flex justify-center items-center w-14 h-14",
    settings:
        "rounded-full bg-slate-600 flex justify-center items-center w-14 h-14",
};

const Sidebar = (props: Props) => {
    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.logo}>Tab Manager</div>

            {/* Unsaved Workspaces */}
            <div className={styles.workspacesContainer}>
                <h2>Unsaved Workspaces</h2>

                <ul className={styles.workspaces}>
                    {unsavedWorkspaces.map((workspaceData) => {
                        return (
                            <Workspace
                                data={workspaceData}
                                setId={props.setSelectedWorkspaceId}
                                selectedId={props.selectedWorkspaceId}
                            />
                        );
                    })}
                </ul>
            </div>

            <hr className={styles.divider}></hr>

            {/* Saved Workspaces */}
            <div className={styles.workspacesContainer}>
                <h2>Saved Workspaces</h2>

                <ul className={styles.workspaces}>
                    {savedWorkspaces.map((workspaceData) => {
                        return (
                            <Workspace
                                data={workspaceData}
                                setId={props.setSelectedWorkspaceId}
                                selectedId={props.selectedWorkspaceId}
                            />
                        );
                    })}
                </ul>
            </div>

            <p>{props.selectedWorkspaceId}</p>

            <div className={styles.footer}>
                {/* Account */}
                <div className={styles.avatar}>OS</div>

                {/* Settings */}
                <div className={styles.settings}>S</div>
            </div>
        </div>
    );
};

type WorkspaceProps = {
    data: {
        id: number;
        title?: string;
        tabs: string[];
    };
    setId: Dispatch<SetStateAction<number | null>>;
    selectedId: number | null;
};

const Workspace = ({ data, setId, selectedId }: WorkspaceProps) => {
    return (
        <li
            className={styles.workspaceItem}
            id={data.id.toString()}
            onClick={() => setId(data.id)}
        >
            {data.title ? data.title : "Unsaved Workspace"}
        </li>
    );
};

export default Sidebar;
