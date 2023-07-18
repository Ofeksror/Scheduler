import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

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
    let responseStatus;

    await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        hashedPassword,
    })
        .then((save) => {
            console.log(`FROM save: ${save}`);
            responseMessage = "Successfully created new user.";
            responseStatus = 200;
        })
        .catch((err) => {
            console.error(`Error from register route: ${err}`);
            responseMessage = err;
            responseStatus = 400;
        });

    return NextResponse.json(
        { message: responseMessage },
        { status: responseStatus }
    );
}
