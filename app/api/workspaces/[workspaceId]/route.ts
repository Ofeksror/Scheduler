import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import Workspace from "@/app/models/Workspace";
import { workspaceType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get workspace from an Id
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

// Delete a workspace from an Id
export async function DELETE(
    req: NextRequest,
    { params }: { params: { workspaceId: ObjectId } }
) {
    await dbConnect();

    // Get all the users that reference workspaceId
    const users = await User.find({workspaces: "64b79e9c7384ee78bcadc660"});

    console.log(users);

    return;
}
/*
    users.forEach(user => {
        // Find index of the workspaceId in the workspaces array
        const indexInUserWorkspaces = user.workspaces.findIndex(
            (workspaceIter: workspaceType) =>
                workspaceIter._id === params.workspaceId
            );
                
        // Remove reference to workspace from user
        if (indexInUserWorkspaces !== -1) {
            user.workspaces = [
                ...user.workspaces.splice(0, indexInUserWorkspaces),
                ...user.workspaces.splice(indexInUserWorkspaces),
            ];
            user.save();
        }
    })

    return;

    // Delete workspace from workspaces DB
    const res = await Workspace.deleteOne({ _id: params.workspaceId });

    if (res.deletedCount !== 1) {
        return NextResponse.json(
            { error: "Workspace ID not found in database." },
            { status: 400 }
        );
    }

    return NextResponse.json({ status: 200 });
}
*/