import React, {
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { signOut, useSession } from "next-auth/react";

import {
    useSelectedWorkspace,
    Workspace,
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

import { Settings, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ObjectId } from "mongodb";

type Props = {};

const styles = {
    sidebarContainer: "flex-none w-60 h-full bg-gray-200 px-4 py-6 relative",
    logo: "text-xl text-gray-800 bg-gray-300 p-4 flex place-content-center rounded-xl",
    workspacesContainer: "font-medium my-8",
    workspaces: "mt-2 flex flex-col gap-1 font-normal text-sm",
    workspaceItem:
        "hover:bg-gray-300 hover:cursor-pointer py-auto px-3 rounded transition h-7 flex items-center",
    selectedWorkspaceItem:
        "bg-gray-300 hover:bg-gray-300 hover:cursor-pointer h-7 px-3 rounded flex items-center",
    divider: "w-4/5 h-1 border-0 rounded bg-slate-500 mx-auto",
    footer: "absolute bottom-0 right-0 px-4 py-6 w-full h-auto flex place-content-between",
    settings: "rounded-full bg-gray-300 flex justify-center items-center p-2",
};

const Sidebar = (props: Props) => {
    const {
        savedWorkspaces,
        unsavedWorkspaces,
        setUnsavedWorkspaces,
        setSavedWorkspaces,
    } = useDatabase();

    const { selectedWorkspace, switchWorkspace } = useSelectedWorkspace();
    const selectedWorkspaceRef = useRef(selectedWorkspace);
    useEffect(() => {
        selectedWorkspaceRef.current = selectedWorkspace;
    }, [selectedWorkspace])



    // const [isLoading, setIsLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     setIsLoading(true);

    //     if (savedWorkspaces != null) {
    //         setIsLoading(false);
    //     }
    // }, [savedWorkspaces]);

    const session = useSession();

    const handleSelectWorkspace = async (workspaceId: ObjectId) => {
        if (selectedWorkspaceRef.current?._id == workspaceId) {
            console.log("User trying to reopen the same workspace");
            return;
        }

        // Switch workspace
        switchWorkspace(workspaceId);

    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.logo}>Tab Manager</div>

            {/* Saved Workspaces */}
            <div className={styles.workspacesContainer}>
                <h2>Saved Workspaces</h2>

                <ul className={styles.workspaces}>
                    {(savedWorkspaces == null) ? (
                        <>
                            <li>
                                <Skeleton
                                    className={
                                        styles.workspaceItem +
                                        " h-6 hover:cursor-default"
                                    }
                                />
                            </li>
                            <li>
                                <Skeleton
                                    className={
                                        styles.workspaceItem +
                                        " h-6 w-3/4 hover:cursor-default"
                                    }
                                />
                            </li>
                        </>
                    ) : (
                        savedWorkspaces.length === 0
                            ? (<li className="text-gray-500">Empty</li>)
                            : (
                            savedWorkspaces.map((workspaceData, index) => {
                                return (
                                    <Workspace
                                        key={index}
                                        data={workspaceData}
                                        isSelected={
                                            selectedWorkspace?._id ==
                                            workspaceData._id
                                        }
                                        onClickHandler={handleSelectWorkspace}
                                    />
                                );
                            })
                        )
                    )
                }
                </ul>
            </div>

            <div className={styles.footer}>
                {/* Settings */}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className={styles.settings}>
                            <Settings
                                size={24}
                                color="#27272a"
                                strokeWidth={1.5}
                            />
                        </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => {
                                console.log(session);
                            }}
                        >
                            Log Session
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                signOut();
                            }}
                        >
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* New workspace */}
                <NewWorkspace />
            </div>
        </div>
    );
};

type WorkspaceProps = {
    data: Workspace;
    isSelected: boolean;
    onClickHandler: (workspaceId: ObjectId) => void;
};

const Workspace = ({ data, isSelected, onClickHandler }: WorkspaceProps) => {
    
    const unselectWorkspace = async () => {
        window.postMessage({
            event: "WEB_WORKSPACE_CLOSE",
        })
    }
    
    return (
        <li
            className={
                isSelected ? styles.selectedWorkspaceItem : styles.workspaceItem
            }
            key={data._id.toString()}
            id={data._id.toString()}
        >
            <span className="flex justify-between w-full h-full items-center group">
                <span onClick={(e) => {onClickHandler(data._id)}} className="align-middle" >
                    {data.title ? data.title : "Untitled Workspace"}
                </span>

                {
                    isSelected ?
                        (<>
                            <span onClick={unselectWorkspace} className="opacity-0 group-hover:opacity-100 transition text-gray-500 hover:bg-gray-200 rounded-full p-[1px]">
                                <X className="h-4 w-4" />
                            </span>
                        </>)    
                    : (<></>)
                }
            </span>
        </li>
    );
};

export default Sidebar;
