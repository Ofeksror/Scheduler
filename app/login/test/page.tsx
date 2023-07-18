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
            <button onClick={handler}>Click to try</button>
        </div>
    );
};

export default testPage;
