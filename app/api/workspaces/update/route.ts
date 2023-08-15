import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { Tab } from "@/utilities/WorkspaceContext";
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

    console.log(newWorkspace);

    await dbConnect();

    // Find workspace in DB
    const workspace = await Workspace.findOne({ _id: newWorkspace._id });

    console.log(workspace);

    if (!workspace)
        return NextResponse.json({error: "Invalid Workspace ID! Could not find workspace in database"}, {status: 400})

    // Update values in DB
    if (newWorkspace.hasOwnProperty("title")) {
        workspace.title = newWorkspace.title;
    }
    if (newWorkspace.hasOwnProperty("tabsUrls")) {
        workspace.tabsUrls = newWorkspace.tabsUrls
    }

    // Save workspace model
    workspace.save();

    console.log(workspace);

    // Return the workspace
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}
