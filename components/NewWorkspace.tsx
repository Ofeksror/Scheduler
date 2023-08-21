"use client";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDatabase } from "@/utilities/databaseContext";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";

import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {};

const NewWorkspace = (props: Props) => {
    const session = useSession();
    const { refreshWorkspace } = useDatabase();
    const { selectedWorkspace, switchWorkspace } = useSelectedWorkspace();

    const [title, setTitle] = useState<string>("");
    const [getInitialTabs, setGetInitialTabs] = useState<boolean>(false);

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);

    useEffect(() => {
        setDialogOpen(false);
        setTitle("");
        setWait(false);
        setGetInitialTabs(false);
    }, [selectedWorkspace])

    const submitForm = async () => {
        // Disable button to avoid spam
        setWait(true);

        if (getInitialTabs) {
            window.postMessage({
                event: "WEB_WORKSPACE_NEW",
                workspaceTitle: title || "Untitled Workspace",
            });

            return;
        }

        // Create the new workspace
        const workspace = await axios({
            method: "post",
            url: `/api/workspaces/new/`,
            data: {
                title: title || "Untitled workspace",
                tabsUrls: [],
                resources: []
            },
        })
            .then((res) => {
                return res.data.workspace;
            })
            .catch((error) => {
                console.warn(error);
            });

        // Attach new workspace to user
        axios({
            method: "put",
            url: "/api/users/user/workspace/",
            data: {
                userId: session.data?.user?._id,
                workspaceId: workspace._id,
            },
        })
            .then((res) => {
                if (res.status === 201) {
                    // Nothing changed.
                    console.log("Nothing changed");
                    return;
                }

                console.log(
                    "✅ :: New workspace successfully attached to user >>"
                );
            })
            .catch((error) => {
                console.warn(error);
            });

        // Update client-side
        refreshWorkspace(workspace);

        // Reset data
        setDialogOpen(false);
        setTitle("");
        setWait(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <span className="rounded-full bg-gray-300 flex justify-center items-center p-2">
                    <Plus size={24} color="#27272a" strokeWidth={1.5} />
                </span>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a new workspace</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <Input
                        type="text"
                        placeholder="Workspace Title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />

                    {selectedWorkspace == null ? (
                        <div className="flex items-center mt-3">
                            <Checkbox
                                id="getInitialTabs"
                                checked={getInitialTabs}
                                onClick={() => {
                                    setGetInitialTabs(!getInitialTabs);
                                }}
                            />
                            <label
                                htmlFor="getInitialTabs"
                                className="text-sm ml-2"
                            >
                                Add current tabs to workspace
                            </label>
                        </div>
                    ) : (
                        <></>
                    )}
                </DialogDescription>
                <DialogFooter>
                    <Button type="submit" onClick={submitForm} disabled={wait}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewWorkspace;
