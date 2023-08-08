"use client"
import React, { useEffect } from 'react'
import { useSelectedWorkspace } from '@/utilities/WorkspaceContext';
import { useDatabase } from '@/utilities/databaseContext';
import { useSession } from 'next-auth/react';

type Props = {}

const ExtensionHelpers = (props: Props) => {
    const session = useSession();
    const {selectedWorkspace} = useSelectedWorkspace();
    const { refreshWorkspaces } = useDatabase();

    if (!session || session.data === null || session.data?.user === undefined || selectedWorkspace === null) {
        console.log("Nothing to show");
        return <></>;
    }

    return (
    <div className="">
        <p id="userId">{session.data.user._id.toString()}</p>
        <p id="selectedWorkspaceId">{selectedWorkspace?._id.toString()}</p>
        {/* <button onClick={} ></button> */}
    </div>
  )
}

export default ExtensionHelpers