"use client";
import { useSelectedWorkspace } from "@/app/utilities/WorkspaceContext";
import { useDatabase } from "@/app/utilities/databaseContext";
import axios from "axios";
import { ObjectId } from "mongoose";
import React, { useState } from "react";

interface Props {
    workspaceId: ObjectId;
}

const NewTab = (props: Props) => {

    const { refreshWorkspace } = useDatabase();
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    if (!selectedWorkspace)
        return <></>;

    const [tabTitle, setTabTitle] = useState<string>("");
    const [tabUrl, setTabUrl] = useState<string>("");
    const [isPinned, setIsPinned] = useState<boolean>(false);

    const handleFormSubmittion = (e: any) => {
        e.preventDefault();

        axios({
            method: "post",
            url: `/api/workspaces/tabs/`,
            data: {
                "workspaceId": selectedWorkspace._id,
                "newTab": {
                    "url": tabUrl,
                    "title": tabTitle,
                    "pinned": isPinned
                }
            }
        })
            .then((res) => {
                refreshWorkspace(res.data.workspace);
                setSelectedWorkspace(res.data.workspace);
            })
            .catch((error) => {
                console.warn(error);
            })
    }


    return (
        <div>
            <h2>Add a new tab to workspace(${props.workspaceId.toString()})</h2>

            <form>
                <input
                    placeholder="Tab URL"
                    value={tabUrl}
                    onChange={(e) => setTabUrl(e.target.value)}
                ></input>
                <input
                    placeholder="Tab Title"
                    value={tabTitle}
                    onChange={(e) => setTabTitle(e.target.value)}
                ></input>
                <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(!isPinned)}
                ></input>

                <button
                    onClick={handleFormSubmittion}
                >
                    ADd bew tab
                </button>
            </form>
        </div>
    );
};

export default NewTab;
