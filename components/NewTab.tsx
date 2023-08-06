"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { BsPinAngleFill } from "react-icons/bs";
import { useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import { useDatabase } from "@/utilities/databaseContext";
import axios from "axios";

type Props = {};

// "bg-gray-100 h-10 py-auto px-1 text-sm hover:bg-gray-200 transition flex justify-between items-center group cursor-pointer rounded-md",

const NewTab = (props: Props) => {
    const { refreshWorkspace } = useDatabase();
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    const [isPinned, setIsPinned] = useState<boolean>(false);
    const [tabUrl, setTabUrl] = useState<string>("");

    if (!selectedWorkspace) {
        return <></>;
    }

    const addNewTab = async () => {

        // TODO: Disable button for now

        // TODO: Validate URL value

        // TODO: Get the title of the URL


        const tabDefaultUrl = await getURLTitle(tabUrl) || "Untitled";

        axios({
            method: "post",
            url: `/api/workspaces/tabs/`,
            data: {
                workspaceId: selectedWorkspace._id,
                newTab: {
                    url: tabUrl,
                    title: tabDefaultUrl,
                    pinned: isPinned,
                },
            },
        })
            .then((res) => {
                refreshWorkspace(res.data.workspace);
                setSelectedWorkspace(res.data.workspace);
            })
            .catch((error) => {
                console.warn(error);
            });

        setIsPinned(false);
        setTabUrl("");
    };

    return (
        <div className="mt-6 w-full h-10 py-auto px-5 bg-gray-100 flex items-center justify-between rounded-md">
            <div className=" flex flex-row items-center flex-1">
                <Input
                    placeholder="URL"
                    value={tabUrl}
                    onChange={(e) => {
                        setTabUrl(e.target.value);
                    }}
                    className="text-sm h-8 bg-gray-50 max-w-lg"
                />

                <Toggle
                    aria-label="Pin tab"
                    pressed={isPinned}
                    onPressedChange={setIsPinned}
                    className="mx-2 h-8 w-7 p-1.5 hover:bg-gray-200 data-[state=on]:bg-gray-200"
                >
                    <BsPinAngleFill className="w-full h-full text-gray-700" />
                </Toggle>
            </div>

            <Button onClick={addNewTab}
                className="text-sm h-8 bg-gray-200 hover:bg-gray-300 text-gray-800 font-normal whitespace-nowrap overflow-hidden"
            >
                Add a new tab
            </Button>
        </div>
    );
};

export default NewTab;
