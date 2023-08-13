"use client";
import React, { useRef, useState } from "react";

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

import { Plus } from "lucide-react"

type Props = {};

const NewWorkspace = (props: Props) => {
    const session = useSession();
    const { refreshWorkspace } = useDatabase();
    const { switchWorkspace } = useSelectedWorkspace();

    const [title, setTitle] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);

    const submitForm = async () => {
        // Disable button to avoid spam
        setWait(true);

        // Create the new workspace
        const workspace = await axios({
            method: "post",
            url: `/api/workspaces/new/`,
            data: {
                title: title || "Untitled workspace",
                tabsUrls: []
            },
        })
            .then((res) => {
                return res.data.workspace
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
                workspaceId: workspace._id
            }
        })
            .then((res) => {

                if (res.status === 201) {
                    // Nothing changed.
                    console.log("Nothing changed");
                    return;
                }

                console.log("✅ :: New workspace successfully attached to user >>")
            })
            .catch((error) => {
                console.warn(error);
            })

        // TODO: Update Session
        

        // Update client-side
        switchWorkspace(workspace)

        // Reset data
        setDialogOpen(false);
        setTitle("");
        setWait(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <span className="rounded-full bg-gray-300 flex justify-center items-center p-2"><Plus size={24} color="#27272a" strokeWidth={1.5}/></span>
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
                </DialogDescription>
                <DialogFooter>
                    <Button type="submit" onClick={submitForm} disabled={wait}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewWorkspace;
