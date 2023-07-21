import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import Workspace from "@/app/models/Workspace";
import { tabType, workspaceType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

import { deleteWorkspaceReferences } from "./helpers"

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
            { error: "Workspace not found or is already deleted" },
            { status: 400 }
        );

    return NextResponse.json({}, { status: 200 });
}