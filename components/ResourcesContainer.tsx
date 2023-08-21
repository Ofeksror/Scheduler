"use client"
import { useSelectedWorkspace } from '@/utilities/WorkspaceContext'
import React from 'react'

type Props = {}

const ResourcesContainer = (props: Props) => {

    const { selectedWorkspace } = useSelectedWorkspace();


    return (
        <div>
            <ul>
                {
                    selectedWorkspace?.resources?.map((resource, index) => 
                        <li key={index}>{resource.url} | {resource.title} | {resource.favIconUrl}</li>
                    )
                }
            </ul>
        </div>
    )
}

export default ResourcesContainer