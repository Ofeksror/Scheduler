import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Update the title of workspace by ID.
export async function PUT(req: NextRequest) {
    await dbConnect();

    // Get the new title
    // const { workspaceId, title } = await req.json().then((data) => {data.workspaceId, data.title} );
    const {workspaceId, title} = await req.json().then((data: {
        workspaceId: ObjectId,
        title: string
    }) => {
        const workspaceId = data.workspaceId;
        const title = data.title;

        return {workspaceId, title};
    } );

    // Try to update the title
    const res = await Workspace.updateOne(
        { _id: workspaceId },
        { title }
    );

    // Workspace not found
    if (res.matchedCount === 0)
        return NextResponse.json(
            {
                error: "Invalid Workspace! Could not find workspace in database.",
            },
            { status: 400 }
        );

    // Return with OK status
    return NextResponse.json({ status: 200 });
}
