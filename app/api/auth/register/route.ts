import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

import md5 from "md5";

// ==================================================================================== //

export async function POST(req: NextRequest) {
    await dbConnect();
    const data = await req.json();

    const databaseUser = await User.findOne({ email: data.email });

    if (databaseUser) {
        console.log("Email already exists!");
        return NextResponse.json(
            { message: "Email already exists" },
            { status: 400 }
        );
    }

    const hashedPassword = await md5(data.password);

    let responseMessage;
    let responseUser;
    let responseStatus;

    await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        hashedPassword,
        workspaces: [],
    })
        .then((newUser) => {
            responseMessage = "Successfully created new user.";
            responseUser = newUser;
            responseStatus = 200;
        })
        .catch((err) => {
            console.error(`Error from register route: ${err}`);
            responseMessage = err;
            responseStatus = 400;
        });

    if (responseUser) {
        return NextResponse.json(
            { message: responseMessage, user: responseUser },
            { status: responseStatus }
        );
    } else {
        return NextResponse.json(
            { message: responseMessage },
            { status: responseStatus }
        );
    }
}
