import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Update the title of workspace by ID.
export async function PUT(req: NextRequest) {
    const { workspaceId, title } = await req
        .json()
        .then((data: { workspaceId: ObjectId; title: string }) => {
            const workspaceId = data.workspaceId;
            const title = data.title;

            return { workspaceId, title };
        });

    await dbConnect();

    // Try to find workspace
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
        return NextResponse.json(
            {
                error: "Invalid Workspace ID! Could not find workspace in database",
            },
            { status: 400 }
        );
    }

    // Update workspace title
    workspace.title = title;
    await workspace.save();

    // Return updated workspace object with OK status
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}
