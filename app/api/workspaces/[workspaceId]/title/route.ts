import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Update the title of workspace by ID.
export async function PUT(
    req: NextRequest,
    { params }: { params: { workspaceId: ObjectId } }
) {

    await dbConnect();

    // Get the new title
    const title = await req.json().then((data) => data.title);

    // Try to update the title
    const res = await Workspace.updateOne({_id: params.workspaceId}, {title})

    if (res.modifiedCount !== 1)
        return NextResponse.json({ error: "Workspace not found!" }, { status: 400 });
    
    // Find workspace in DB
    const workspace = await Workspace.findOne({ _id: params.workspaceId });
    if (!workspace) {
        return NextResponse.json(
            { error: "Workspace doesn't exist!" },
            { status: 400 }
        );
    }
    
    // Return the updated workspace object
    return NextResponse.json({ workspace: workspace }, { status: 400 });

}
