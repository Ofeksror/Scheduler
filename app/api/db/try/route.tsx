import dbConnect from "@/app/lib/dbConnect";
import Workspace from "@/app/models/Workspace";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    console.log("Mark I");
    console.log(req);

    await dbConnect();
    console.log("Mark II");

    const databaseUser = await Workspace.findOne({
        _id: "64b79e9c7384ee78bcadc660",
    });

    console.log("Mark III");
    console.log(databaseUser);

    return NextResponse.json({ message: "successful?" }, { status: 200 });
}
