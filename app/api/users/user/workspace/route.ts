import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Workspace from "@/models/Workspace";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

// ======================================================================= //

/* ================================================ //
// PUT: Attach to User (userId) a workspace (workspaceId)  
// Parameters:
//   1. JSON body: userId 
//   2. JSON body: workspaceId 
// Returns:
//   - User's updated list of workspaces
// Status Codes:
//   - 200: Successfully added
//   - 201: Nothing changed
//   - 400: Something went wrong
// ================================================ */
export async function PUT(req: NextRequest) {
    await dbConnect();

    // Get parameters from request body
    const { userId, workspaceId } = await req
        .json()
        .then((data: { userId: string; workspaceId: string }) => {
            const userId = new ObjectId(data.userId);
            const workspaceId = new ObjectId(data.workspaceId);
            return { userId, workspaceId };
        });

    // Find user
    const user = await User.findOne({ _id: userId });
    if (!user)
        return NextResponse.json(
            { error: "Invalid User ID. User was not found in DB" },
            { status: 400 }
        );

    // Check if workspace exists
    if ((await Workspace.findById(workspaceId)) === null)
        return NextResponse.json(
            { error: "Invalid Workspace ID. Workspace was not found in DB" },
            { status: 400 }
        );

    // Check if workspace already exists
    if (user.workspaces.includes(workspaceId))
        return NextResponse.json(
            { message: "Workspace already associated with user" },
            { status: 201 }
        );

    // Add new workspace
    user.workspaces.push(workspaceId);
    user.save();

    return NextResponse.json({ workspaces: user.workspaces }, { status: 200 });
}
