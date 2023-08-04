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

type Props = {};

const NewWorkspace = (props: Props) => {
    const [title, setTitle] = useState<string>("");

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const submitForm = () => {
        console.log(title);

        axios({
            method: "post",
            url: `/api/workspaces/new/`,
            data: {
                title: title,
                tabs: []
            },
        })
            .then((res) => {
                // Attach workspace to user
                
                refreshWorkspace(res.data.workspace);
                setSelectedWorkspace(res.data.workspace);
            })
            .catch((error) => {
                console.warn(error);
            });

            // TODO: Attach workspace to user!

        // Reset data
        setDialogOpen(false);
        setTitle("");
    };

    return (
        <div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>New Workspace</DialogTrigger>

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
                        <Button type="submit" onClick={submitForm}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewWorkspace;
