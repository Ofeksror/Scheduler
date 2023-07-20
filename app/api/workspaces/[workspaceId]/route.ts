import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Get workspace from an Id
export async function GET(req: NextRequest, { params }: { params: { workspaceId: ObjectId } }) {
    
    // TODO: Check if workspaceId is not of type ObjectId  

    const workspace = await Workspace.findOne({ _id: params.workspaceId });

    if (!workspace) {
        return NextResponse.json({error: "Workspace doesn't exist!"}, {status: 400});
    }

    return NextResponse.json({ workspace: workspace }, { status: 200 });
}