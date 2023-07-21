import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import Workspace from "@/app/models/Workspace";
import { workspaceType } from "@/app/utilities/WorkspaceContext";
import axios from "axios";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


// Helper function
// Get all the users that reference workspaceId
const getUsersReferencingWorkspace = async (workspaceId: string) => {
    const users = await User.find({ workspaces: new ObjectId(workspaceId) });
    return users;
}

// Get all users that reference workspaceId
export async function GET(
    req: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    await dbConnect();

    const users = await getUsersReferencingWorkspace(params.workspaceId);
    
    return NextResponse.json({ users: users }, { status: 200 });
}

// Removes a workspace (workspaceId) from a user (query param userId). Returns the updated array of workspace IDs linked to userId.
// Remove reference to workspaceId from all users.
export async function DELETE(
    req: NextRequest,
    { params }: { params: { workspaceId: string } }
) {
    await dbConnect();

    const users = await getUsersReferencingWorkspace(params.workspaceId)

    users.forEach(async (user: any) => {
        // Remove reference to workspace from user
        const indexInUserWorkspaces = user.workspaces.findIndex(
            (workspaceIterId: ObjectId) =>
                workspaceIterId.toString() == params.workspaceId
        );

        if (indexInUserWorkspaces !== -1) {
            user.workspaces = [
                ...user.workspaces.splice(0, indexInUserWorkspaces),
                ...user.workspaces.splice(indexInUserWorkspaces + 1),
            ];
            user.save();
        }
    })

    return NextResponse.json({ status: 200 });
}
