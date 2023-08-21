import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { deleteWorkspaceReferences } from "./helpers";

// ======================================================================= //

/* ================================================ //
// GET: Get workspace from an Id
// Parameters:
    1. route parameter: ID of workspace to get 
// ================================================ */
export async function GET(
    req: NextRequest,
    { params }: { params: { workspaceId: ObjectId } }
) {
    // TODO: Check if workspaceId is not of type ObjectId

    const workspace = await Workspace.findOne({ _id: params.workspaceId });

    if (!workspace) {
        return NextResponse.json(
            { error: "Workspace doesn't exist!" },
            { status: 400 }
        );
    }

    return NextResponse.json({ workspace: workspace }, { status: 200 });
}

/* ================================================ //
// DELETE: Delete a workspace from an Id , and deletes all references to that workspace
// Parameters:
    1. route parameter: ID of workspace to delete 
// ================================================ */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    await dbConnect();

    // Delete references to workspace in users
    deleteWorkspaceReferences(params.workspaceId);

    // Delete workspace from DB
    const res = await Workspace.deleteOne({
        _id: new ObjectId(params.workspaceId),
    });
    if (res.deletedCount != 1)
        return NextResponse.json(
            { message: "Workspace not found or is already deleted" },
            { status: 201 }
        );

    return NextResponse.json({}, { status: 200 });
}

// /* ================================================ //
// // PUT: Gets a new workspace object and updates the one found in database
// // Parameters:
//     1. route parameter: The workspace ID to update 
//     2. JSON body: The new workspace object to update in DB 
// // ================================================ */
// export async function PUT(
//     req: NextRequest,
//     { params }: { params: { workspaceId: string } }
// ) {
//     const newWorkspace = await req.json().then((data) => data.workspace);

//     await dbConnect();

//     // Find workspace in DB
//     const workspace = await Workspace.findOne({ _id: params.workspaceId });

//     if (!workspace)
//         return NextResponse.json({error: "Invalid Workspace ID! Could not find workspace in database"}, {status: 400})

//     // Update title
//     workspace.title = newWorkspace.title;

//     // Update tabs
//     workspace.tabs = newWorkspace.tabs;

//     // Update resources
//     workspace.resources = newWorkspace.resources;

//     // Save workspace model
//     workspace.save();

//     return NextResponse.json({ workspace: workspace }, { status: 200 });
// }
