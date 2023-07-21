import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { tabType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Add a new tab to workspaceId
export async function POST(req: NextRequest) {
    
    const {workspaceId, newTab} = await req.json().then((data: {
        workspaceId: ObjectId,
        newTab: tabType
    }) => {
        const workspaceId = data.workspaceId;
        const newTab = data.newTab;

        return {workspaceId, newTab};
    } );
    
    await dbConnect();

    // Try to find workspace
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
        return NextResponse.json({error: "Invalid Workspace ID! Could not find workspace in database"}, {status: 400});
    }

    // Update workspace tabs
    workspace.tabs.push(newTab);
    workspace.save();

    // Return updated workspace object with OK status
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}