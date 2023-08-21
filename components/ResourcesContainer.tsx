"use client";
import { Resource, useSelectedWorkspace } from "@/utilities/WorkspaceContext";
import React from "react";
import {
    GoPaste,
    GoBookmarkSlash
} from "react-icons/go"
import { toast } from "@/components/ui/use-toast";

type Props = {};

const ResourcesContainer = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    /* 
   
                <ul>
                { {
                    selectedWorkspace?.resources?.map((resource, index) => 
                        <li key={index}>{resource.url} | {resource.title} | {resource.favIconUrl}</li>
                    )
                } }
                </ul>
    */


    const openResource = (resourceUrl: string) => {
        window.postMessage({
            event: "WEB_RESOURCE_OPEN",
            resourceUrl
        });
    };
    
    const copyLink = (url: string) => {
        navigator.clipboard.writeText(url);

        toast({
            description: `Link copied to clipboard!`,
            duration: 2000
        })
    };

    const removeResource = (resource: Resource) => {
        if (!selectedWorkspace) return;

        const newResourcesList = selectedWorkspace.resources.filter((iter) => iter != resource);
        
        setSelectedWorkspace({
            ...selectedWorkspace,
            resources: newResourcesList
        });
    };

    return (
        <div className="w-full max-w-4xl mt-6">
            <div className="text-xl w-full mb-2">
                <h1>Resources</h1>
            </div>

            <ul>
                {selectedWorkspace?.resources?.map((resource, index) => {
                    return (
                        <li
                            className="bg-gray-100 hover:bg-gray-200 h-9 py-auto px-1 text-sm transition flex justify-between items-center group cursor-pointer rounded-md relative"
                            key={index}
                        >
                            <span className="ml-4 overflow-hidden w-full"
                                onClick={() => {
                                    openResource(resource.url);
                                }}
                            >
                                <span className="h-full w-9/12 flex items-center">
                                    <img
                                        src={resource.favIconUrl}
                                        className="inline h-4 w-4 mr-3 aspect-square"
                                    />
                                    <span className="align-middle whitespace-nowrap overflow-hidden text-ellipsis">
                                        {resource.title}
                                    </span>
                                </span>
                            </span>

                            <span
                                className="opacity-0 transition inline-flex gap-3 pl-9 mr-3 z-10 justify-self-end absolute top-auto right-3 bg-gradient-to-r from-transparent to-gray-200 to-20% group-hover:opacity-100"
                            >
                                <span
                                    title="Copy Link"
                                    className="hover:bg-gray-100 transition rounded-full p-1"
                                    onClick={() => {
                                        copyLink(resource.url);
                                    }}
                                >
                                    <GoPaste />
                                </span>
                                <span
                                    title="Save as Resource"
                                    className="hover:bg-gray-100 transition rounded-full p-1"
                                    onClick={() => {
                                        removeResource(resource);
                                    }}
                                >
                                    <GoBookmarkSlash />
                                </span>
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ResourcesContainer;
