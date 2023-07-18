import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import md5 from "md5";
import { signIn } from "next-auth/react";

export async function POST(req: NextRequest) {
    await dbConnect();
    const data = await req.json();

    const userFound = await User.findOne({
        email: data.email,
    });

    // Validate credentials
    if (!userFound) {
        return NextResponse.json(
            { message: "User not found! Invalid email address" },
            { status: 400 }
        );
    }

    const hashedPassword = md5(data.password as string);
    if (userFound.hashedPassword !== hashedPassword) {
        return NextResponse.json(
            { message: "Incorrect password!" },
            { status: 400 }
        );
    }

    // Authorize user
    console.log("Mark Pre V");
    const response = await signIn("credentials", {
        email: data.email,
        hashedPassword: hashedPassword,
    });

    console.log("Mark V");
    console.log(response);

    return NextResponse.json(
        { message: "Successful!", response: response },
        { status: 200 }
    );
}
