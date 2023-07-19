"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

type Props = {};

const testPage = (props: Props) => {
    const session = useSession();

    useEffect(() => {
        console.log(session.status);

        if (session.status === "authenticated") return redirect("/");
    }, [session]);

    // console.log(session);

    const handler = async (e: any) => {
        e.preventDefault();
        const email = "test@test.test";
        const password = "test";

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
    };

    return (
        <div>
            <p>Email: <span className="italic">test@test.test</span></p>
            <p>Password: <span className="italic">test</span></p>
            <button onClick={handler}>Click to Authenticate via demo user</button>
        </div>
    );
};

export default testPage;
