import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

type Props = {}

const NewWorkspace = (props: Props) => {
  return (
    <div>
        <Dialog>
            <DialogTrigger>New Workspace</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogHeader>New Workspace</DialogHeader>
                    <DialogDescription>Hello please create a new workspace thank you</DialogDescription>
                </DialogHeader>
                <DialogDescription>Hello please create a new workspace thank you</DialogDescription>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default NewWorkspace