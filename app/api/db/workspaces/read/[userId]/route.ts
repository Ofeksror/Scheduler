import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import Workspace from "@/app/models/Workspace";
import { workspaceType } from "@/app/utilities/WorkspaceContext";
import { ObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    await dbConnect();

    const user = await User.findOne({_id: params.userId});
    console.log(user);

    const workspaces: workspaceType[] = user.workspaces.map(async (_id: ObjectId) => {
        const that = await Workspace.findOne({_id});
        console.log(that);
        return that;
    })
    
    console.log(workspaces);

    return NextResponse.json({ workspaces: workspaces }, { status: 200 });
}
