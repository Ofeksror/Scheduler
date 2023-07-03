"use client";
import React from "react";
import { signIn } from "next-auth/react";

type Props = {};

const styles = {
    container: "w-screen h-screen bg-slate-300",
};

const LoginPage = (props: Props) => {
    const handleClick = () => {
        signIn("github");
    };
    return (
        <div className={styles.container}>
            <button onClick={handleClick}>Login with GitHub</button>
        </div>
    );
};

export default LoginPage;
