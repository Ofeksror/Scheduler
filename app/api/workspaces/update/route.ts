import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { tabType } from "@/utilities/WorkspaceContext";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

/* ================================================ //
// PUT: Gets a new workspace object and updates the one found in database
// Parameters:
    1. route parameter: The workspace ID to update 
    2. JSON body: The new workspace object to update in DB 
// ================================================ */
export async function PUT(req: NextRequest) {
    const newWorkspace = await req.json().then((data) => data.workspace);

    await dbConnect();

    // Find workspace in DB
    const workspace = await Workspace.findOne({ _id: newWorkspace._id });

    if (!workspace)
        return NextResponse.json({error: "Invalid Workspace ID! Could not find workspace in database"}, {status: 400})

    // Update values in DB
    workspace.title = newWorkspace.title;
    
    workspace.tabs = [];
    newWorkspace.tabs.forEach((tab: tabType) => {
        if (tab._id === null) {
            tab._id = new ObjectId();
        }
        workspace.tabs.push(tab);
    });

    // Save workspace model
    workspace.save();

    // Return the workspace
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}
