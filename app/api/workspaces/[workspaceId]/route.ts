import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import Workspace from "@/app/models/Workspace";
import { workspaceType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongodb";
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

// Get a list of users referencing workspaceId
const getUsersReferencingWorkspace = async (workspaceId: string) => {
    const users = await User.find({ workspaces: new ObjectId(workspaceId) });
    return users;
};

// Remove reference to workspaceId from all users.
const deleteWorkspaceReferences = async (workspaceId: string) => {
    await dbConnect();

    const users = await getUsersReferencingWorkspace(workspaceId);

    users.forEach(async (user: any) => {
        // Remove reference to workspace from user
        const indexInUserWorkspaces = user.workspaces.findIndex(
            (workspaceIterId: ObjectId) =>
                workspaceIterId.toString() == workspaceId
        );

        if (indexInUserWorkspaces !== -1) {
            user.workspaces = [
                ...user.workspaces.splice(0, indexInUserWorkspaces),
                ...user.workspaces.splice(indexInUserWorkspaces + 1),
            ];
            user.save();
        }
    });
};

// Delete a workspace from an Id , and deletes all references to that workspace
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