import dbConnect from "@/lib/dbConnect";
import Workspace from "@/models/Workspace";
import { NextRequest, NextResponse } from "next/server";

// ======================================================================= //

type newWorkspaceType = {
    title?: string;
    tabsUrls?: string[];
};

/* ================================================ //
// POST: Create a new workspace
// Parameters:
//   1. JSON body: title of workspace and tabs to add to it 
// Returns:
//   - the newly created workspace
// ================================================ */
export async function POST(req: NextRequest) {
    await dbConnect();

    const { title, tabsUrls } = await req.json().then((data: newWorkspaceType) => {
        const title = data.title;
        const tabsUrls = data.tabsUrls;

        return { title, tabsUrls };
    });

    console.log(title);
    console.log(tabsUrls);

    const newWorkspace = await Workspace.create({
        title: title || "New Workspace",
        tabsUrls: tabsUrls || [],
    });

    console.log(newWorkspace);

    return NextResponse.json({ workspace: newWorkspace }, { status: 200 });
}
