"use client";
import { ObjectId } from "mongoose";
import React, { useState } from "react";

interface Props {
    workspaceId: ObjectId;
}

const NewTab = (props: Props) => {
    const [tabTitle, setTabTitle] = useState<string>("");
    const [tabUrl, setTabUrl] = useState<string>("");
    const [isPinned, setIsPinned] = useState<boolean>(false);

    const handleFormSubmittion = () => {
        console.log("Mark I:\n/handleFormSubmittion func was called/\ndetails provided by user:\n" + {tabTitle, tabUrl, isPinned});

        
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
