import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { tabType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

/* ================================================ //
// POST: Add a tab to workspace
// Parameters:
//  1. JSON Body: workspaceId - ID of workspace 
//  2. JSON Body: newTab - New tab to add to workspace 
// Returns:
//  - Updated workspace
// ================================================ */
export async function POST(req: NextRequest) {
    const { workspaceId, newTab } = await req
        .json()
        .then((data: { workspaceId: ObjectId; newTab: tabType }) => {
            const workspaceId = data.workspaceId;
            const newTab = data.newTab;

            return { workspaceId, newTab };
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

    // Update workspace tabs
    workspace.tabs.push(newTab);
    workspace.save();

    // Return updated workspace object with OK status
    return NextResponse.json({ workspace: workspace }, { status: 200 });
}

/* ================================================ //
// DELETE: Delete a tab from workspace
// Parameters:
//  1. JSON Body: workspaceId - ID of workspace 
//  2. JSON Body: tabId - ID of tab to remove from workspace 
// Returns:
//  - Updated workspace
// ================================================ */
export async function PUT(req: NextRequest) {
    const { workspaceId, tabId } = await req
        .json()
        .then((data: { workspaceId: ObjectId; tabId: string }) => {
            const workspaceId = new ObjectId(data.workspaceId);
            const tabId = new ObjectId(data.tabId);

            return { workspaceId, tabId };
        });

    // Try to find workspace
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace)
        return NextResponse.json(
            {
                error: "Invalid Workspace ID! Could not find workspace in database",
            },
            { status: 400 }
        );

    // Attempt to delete tab from workspace
    const tabIndexInWorkspace = workspace.tabs.findIndex(
        (workspaceTab: any) => tabId.equals(workspaceTab._id)
    );
    if (tabIndexInWorkspace === -1)
        return NextResponse.json(
            { error: "Could not find tab in workspace." },
            { status: 400 }
        );

    workspace.tabs = [
        ...workspace.tabs.splice(0, tabIndexInWorkspace),
        ...workspace.tabs.splice(tabIndexInWorkspace + 1),
    ];
    workspace.save();

    return NextResponse.json({ workspace: workspace }, { status: 200 });
}


/* ================================================ //
// PATCH: Update workspace's tab details
// Parameters:
//  1. JSON Body: workspaceId - ID of workspace 
//  2. JSON Body: updatedTab - tab object to replace
// Returns:
//  - Updated workspace
// ================================================ */
export async function PATCH(req: NextRequest) {
    const { workspaceId, updatedTab, tabId } = await req
        .json()
        .then((data: { workspaceId: ObjectId; updatedTab: tabType }) => {
            const workspaceId = new ObjectId(data.workspaceId);
            const updatedTab = data.updatedTab;
            const tabId = new ObjectId(data.updatedTab._id);

            return { workspaceId, updatedTab, tabId };
        });

    // Try to find workspace
    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace)
        return NextResponse.json(
            {
                error: "Invalid Workspace ID! Could not find workspace in database",
            },
            { status: 400 }
        );

    // Attempt to delete tab from workspace
    const tabIndexInWorkspace = workspace.tabs.findIndex(
        (workspaceTab: any) => tabId.equals(workspaceTab._id)
    );
    if (tabIndexInWorkspace === -1)
        return NextResponse.json(
            { error: "Could not find tab in workspace." },
            { status: 400 }
        );

    workspace.tabs[tabIndexInWorkspace] = updatedTab
    workspace.save();

    return NextResponse.json({ workspace: workspace }, { status: 200 });
}

