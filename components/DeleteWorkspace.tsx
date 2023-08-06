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
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import { Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast";

type Props = {};

const DeleteWorkspace = (props: Props) => {

    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();
    const { updateDeletedWorkspace } = useDatabase();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [wait, setWait] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean>(false);

    const [titleInput, setTitleInput] = useState<string>("");

    const submitForm = async () => {
        // Disable button to avoid spam
        setWait(true);

        // If the title is incorrect notify the user
        if (titleInput !== selectedWorkspace?.title) {
            setError(true);
            setWait(false);
            return;
        }
        
        // Delete workspace
        await axios({
            method: "delete",
            url: `/api/workspaces/${selectedWorkspace._id}/`,
        })
        .catch((error) => {
            console.warn(error);
        });

        // Update client-side
        updateDeletedWorkspace(selectedWorkspace._id);
        setSelectedWorkspace(null);

        // Notify User
        toast({
            description: `Deleted workspace ${titleInput}`,
            duration: 4000
        })

        // Close dialog
        setDialogOpen(false);
    }

    useEffect(() => {
        setIsCorrect(false);
        setError(false);

        if (titleInput == selectedWorkspace?.title) {
            setIsCorrect(true);
        }
    }, [titleInput])

    useEffect(() => {
        setDialogOpen(false);
        setWait(false);
        setError(false);
        setIsCorrect(false);
        setTitleInput("");
    }, [selectedWorkspace])

    const preventCopyPaste = (e: any) => {
        e.preventDefault()
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button className="aspect-square w-8 h-8 p-1 bg-gray-300 hover:bg-gray-400">
                    <Trash className="w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Your Workspace</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <p className="select-none mb-3">Please enter the name of your workspace, <span className="font-bold">{selectedWorkspace?.title}</span>, if you wish to permanently delete it.</p>
                    <Input
                        className={
                            error ? "border-red-400 focus-visible:ring-red-100" : ""
                        }
                        type="text"
                        onCopy={(e) => preventCopyPaste(e)}  
                        onPaste={(e) => preventCopyPaste(e)}  
                        onCut={(e) => preventCopyPaste(e)}
                        autoComplete="off"
                        placeholder="Enter the name of your workspace"
                        value={titleInput}
                        onChange={(e) => {
                            setTitleInput(e.target.value);
                        }}
                    />
                </DialogDescription>
                <DialogFooter>
                    <Button type="submit" onClick={submitForm} disabled={wait}
                        className={isCorrect ? "bg-red-500 hover:bg-red-600" : ""}
                    >Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteWorkspace;
