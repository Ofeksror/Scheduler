// ======================================================================= //

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

/* ================================================ //
// GET: Get the list of workspace IDs of user (userId)  
// Parameters:
//   1. route parameter: userId 
// Returns:
//   - User's list of workspace ids
// Status Codes:
//   - 200: Returned the list
//   - 400: User not found
// ================================================ */
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: ObjectId } }
) {
    await dbConnect();

    // Get userId param from request body
    const user = await User.findOne({ _id: params.userId });

    if (!user) {
        return NextResponse.json(
            { error: "User doesn't exist!" },
            { status: 400 }
        );
    }

    return NextResponse.json({ workspaces: user.workspaces }, { status: 200 });
}
