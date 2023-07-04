"use client";
import React from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";

type Props = {};

const styles = {
    container: "w-screen h-screen bg-slate-300",
};

const LoginPage = (props: Props) => {
    const session = useSession();

    if (session.status === "authenticated") {
        return redirect("/");
    }

    const handleClick = () => {
        signIn("github");
    };

    return (
        <div className={styles.container}>
            <h1>You are not logged-in yet 😬</h1>
            <h2>Let's get you logged-in! 😎</h2>
            <button onClick={handleClick}>Login with GitHub</button>
        </div>
    );
};

export default LoginPage;
