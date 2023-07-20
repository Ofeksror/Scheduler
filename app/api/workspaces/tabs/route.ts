import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { tabType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Add a new tab to workspaceId
export async function POST(req: NextRequest) {
    await dbConnect();

    const newTab = await req.json().then((data) => data.newTab);

    // Method 1
    /*
    const workspace = await Workspace.findOne({ _id: params.workspaceId });
    workspace.tabs.push(newTab);
    workspace.save();
    */

    // Method 2

    const res = await Workspace.updateOne(
        { _id: params.workspaceId },
        { $push: { tabs: newTab } }
    );

    console.log(res);

    // Try to update the title
    // const res = await Workspace.updateOne(
    //     { _id: params.workspaceId },
    //     { $push: { tabs: params.newTab } },
    // );

    // console.log(res);

    // if (res.matchedCount === 0)
    //     return NextResponse.json(
    //         { error: "Invalid Workspace! Could not find workspace in database." },
    //         { status: 400 }
    //     );

    return NextResponse.json({ status: 200 });
}
