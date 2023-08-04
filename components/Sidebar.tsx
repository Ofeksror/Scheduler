import React, { Dispatch, SetStateAction, useContext, useEffect } from "react";

import { signOut, useSession } from "next-auth/react";

import {
    useSelectedWorkspace,
    workspaceType,
} from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewWorkspace from "./NewWorkspace";

import { Settings, Plus } from 'lucide-react';

type Props = {};

const styles = {
    sidebarContainer: "flex-none w-60 h-full bg-gray-200 p-4 relative",
    logo: "text-xl text-gray-800 bg-gray-300 p-4 flex place-content-center rounded-xl",
    workspacesContainer: "font-medium my-8",
    workspaces: "mt-2 flex flex-col gap-1 font-normal text-sm",
    workspaceItem:
        "hover:bg-gray-300 hover:cursor-pointer py-1 px-3 rounded",
    selectedWorkspaceItem:
        "bg-gray-300 hover:bg-gray-300 hover:cursor-pointer py-1 px-3 rounded",
    divider: "w-4/5 h-1 border-0 rounded bg-slate-500 mx-auto",
    footer: "absolute bottom-0 right-0 p-4 w-full h-auto flex place-content-between",
    settings:
        "rounded-full bg-gray-300 flex justify-center items-center p-2",
};

const Sidebar = (props: Props) => {
    const {
        savedWorkspaces,
        unsavedWorkspaces,
        setUnsavedWorkspaces,
        setSavedWorkspaces,
    } = useDatabase();

    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    const handleSelectWorkspace = (data: workspaceType) => {
        setSelectedWorkspace(data);
    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.logo}>Tab Manager</div>

            {/* Saved Workspaces */}
            <div className={styles.workspacesContainer}>
                <h2>Saved Workspaces</h2>

                <ul className={styles.workspaces}>
                    {savedWorkspaces.map((workspaceData, index) => {
                        return (
                            <Workspace
                                data={workspaceData}
                                isSelected={
                                    selectedWorkspace?._id == workspaceData._id
                                }
                                onClickHandler={handleSelectWorkspace}
                                key={index}
                            />
                        );
                    })}
                </ul>
            </div>

            <div className={styles.footer}>
                {/* Settings */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className={styles.settings}><Settings size={24} color="#27272a" strokeWidth={1.5}/></div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {signOut()}}>Sign Out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* New workspace */}
                <NewWorkspace />
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
            id={data._id.toString()}
            onClick={(e) => onClickHandler(data)}
        >
            {data.title ? data.title : "Unsaved Workspace"}
        </li>
    );
};

export default Sidebar;
