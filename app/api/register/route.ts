import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";

import md5 from "md5";

// ==================================================================================== //

export async function POST(req: NextRequest) {
    const data = await req.json();
    console.log(data);
    const { firstName, lastName, email, password } = data;

    await dbConnect();

    const databaseUser = await User.findOne({ email: email });
    
    if (databaseUser) {
        console.log("Email already exists!");
        return NextResponse.json(
            { error: "Email already exists" },
            { status: 400 }
        );
    }

    const hashedPassword = md5(password);

    const newUser = new User({
        firstName,
        lastName,
        email,
        hashedPassword,
    });

    newUser
        .save()
        .then(() => {
            return NextResponse.json(
                { message: "User created successfully" },
                { status: 200 }
            );
        })
        .catch((err: string) => {
            return NextResponse.json({ error: err }, { status: 400 });
        });
}
