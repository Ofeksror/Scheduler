import React from "react";
import { useSelectedWorkspace } from "../utilities/WorkspaceContext";

type Props = {};

const Temp = (props: Props) => {
    const { selectedWorkspace, setSelectedWorkspace } = useSelectedWorkspace();

    if (selectedWorkspace === null) {
        return <h1>Workspace Not Selected.</h1>;
    }

    return <div><p>{selectedWorkspace.id}</p></div>;
};

export default Temp;
