import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { tabType } from "@/utilities/WorkspaceContext";
import { NextRequest, NextResponse } from "next/server";

// ======================================================================= //

type newWorkspaceType = {
    title?: string;
    tabs?: tabType[];
};

/* ================================================ //
// POST: Create a new workspace
// Parameters:
//   1. JSON body: title of workspace and tabs to add to it 
// Returns:
//   - the newly created workspace
// ================================================ */
export async function POST(req: NextRequest) {
    await dbConnect();

    const { title, tabs } = await req.json().then((data: newWorkspaceType) => {
        const title = data.title;
        const tabs = data.tabs;

        return { title, tabs };
    });

    const newWorkspace = await Workspace.create({
        title: title || "New Workspace",
        tabs: tabs || [],
    });

    return NextResponse.json({ workspace: newWorkspace }, { status: 200 });
}
