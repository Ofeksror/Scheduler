import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";

import {
    useSelectedWorkspace,
    workspaceType,
} from "../utilities/WorkspaceContext";
import { useDatabase } from "../utilities/databaseContext";

type Props = {};

const styles = {
    sidebarContainer: "relative float-left w-60 h-full bg-slate-400 p-4",
    logo: "text-xl font-bold text-white bg-slate-500 p-4 flex place-content-center",
    workspacesContainer: "bg-slate-300 my-8",
    workspaces: "",
    workspaceItem:
        "bg-slate-400 hover:bg-slate-500 hover:cursor-pointer p-2 my-1",
    selectedWorkspaceItem:
        "bg-slate-500 hover:bg-slate-500 hover:cursor-pointer p-2 my-1",
    divider: "w-4/5 h-1 border-0 rounded bg-slate-500 mx-auto",
    footer: "absolute bottom-0 right-0 p-4 w-full h-auto flex place-content-between",
    avatar: "rounded-full bg-slate-600 flex justify-center items-center w-14 h-14",
    settings:
        "rounded-full bg-slate-600 flex justify-center items-center w-14 h-14",
};

const Sidebar = (props: Props) => {
    const {
        savedWorkspaces,
        unsavedWorkspaces,
        setUnsavedWorkspaces,
        setSavedWorkspaces,
    } = useDatabase();

    useEffect(() => {
        setUnsavedWorkspaces([
            {
                id: 1,
                tabs: ["asdasd", "12121", "vbbvcbvc", "223213"],
            },
            {
                id: 2,
                tabs: ["2Asdsadsa", "2bdd", "2cccs", "2dddd"],
            },
            {
                id: 3,
                tabs: ["3aaa", "3bb", "3ccc", "4dd"],
            },
        ]);
        setSavedWorkspaces([
            {
                id: 4,
                title: "Job Hunting",
                tabs: ["LinkedIn", "TechMonster", "AllJobs"],
            },
            {
                id: 5,
                title: "Learning Software",
                tabs: ["StackOverflow", "TailwindCSS", "Vercel", "React Docs"],
            },
            {
                id: 6,
                title: "Learning Finance",
                tabs: ["Graham Stephan", "Rich Dad Poor Dad", "Calcalist"],
            },
            {
                id: 7,
                title: "Style Glow Up",
                tabs: [
                    "Top 10 Perfumes",
                    "Old Money Fashion Stores",
                    "ZARA",
                    "Pull & Bear",
                ],
            },
        ]);
    }, []);

    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    const handleSelectWorkspace = (data: workspaceType) => {
        setSelectedWorkspace(data);
    };

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
                                isSelected={
                                    selectedWorkspace?.id == workspaceData.id
                                }
                                onClickHandler={handleSelectWorkspace}
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
                                isSelected={
                                    selectedWorkspace?.id == workspaceData.id
                                }
                                onClickHandler={handleSelectWorkspace}
                            />
                        );
                    })}
                </ul>
            </div>

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
    data: workspaceType;
    isSelected: boolean;
    onClickHandler: (data: workspaceType) => void;
};

const Workspace = ({ data, isSelected, onClickHandler }: WorkspaceProps) => {
    return (
        <li
            className={
                isSelected ? styles.selectedWorkspaceItem : styles.workspaceItem
            }
            id={data.id.toString()}
            onClick={(e) => onClickHandler(data)}
        >
            {data.title ? data.title : "Unsaved Workspace"}
        </li>
    );
};

export default Sidebar;
