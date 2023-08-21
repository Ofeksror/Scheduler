import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { Resource, Tab } from "@/utilities/WorkspaceContext";
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
    if (newWorkspace.hasOwnProperty("title")) {
        workspace.title = newWorkspace.title;
    }
    if (newWorkspace.hasOwnProperty("tabsUrls")) {
        workspace.tabsUrls = newWorkspace.tabsUrls
    }
    if (newWorkspace.hasOwnProperty("resources")) {
        const newResources = newWorkspace.resources.map((resource: Resource) => {
            if (resource.hasOwnProperty("_id")) return resource;
            return {
                ...resource,
                _id: new ObjectId()
            }
        })

        workspace.resources = newResources;
    }
    
    // Save workspace model
    workspace.save();

    // Return the workspace
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}
