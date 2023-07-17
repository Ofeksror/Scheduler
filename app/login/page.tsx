"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";

type Props = {};

const styles = {
    container: "w-screen h-screen bg-slate-300",
    header: "",
    switcherContainer: "",
    providersContainer: "",

};

const LoginPage = (props: Props) => {
    const session = useSession();
    
    useEffect(() => {
        if (session.status === "authenticated") {
            return redirect("/");
        }
    }, [session])

    const [email, setEmail] = useState<string>("");
    const emailRegex = /^\S+@\S+\.\S+$/;
    const [password, setPassword] = useState<string>("");

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [authTypeLogin, setAuthTypeLogin] = useState<boolean>(true);
    const switchAuthType = () => {
        setAuthTypeLogin(!authTypeLogin);
    };

    const providers = ["GitHub"];
    const handleProviderAuth = (provider: string) => {
        signIn(provider);
    };


    const credentialsAuthenticate = async () => {
        // TODO
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>{authTypeLogin ? "Log in🤗" : "Register👋"}</h1>
            </div>
            <div className={styles.switcherContainer}>
                {authTypeLogin ? (
                    <span>
                        New here? <span onClick={switchAuthType}>Register</span>
                    </span>
                ) : (
                    <span>
                        Already registered?
                        <span onClick={switchAuthType}>Log in</span>
                    </span>
                )}
            </div>

            <div className={styles.providersContainer}>
                {providers.map((provider: string) => (
                    <button
                        onClick={() => {
                            handleProviderAuth(provider.toLowerCase());
                        }}
                    >
                        Continue with {provider}
                    </button>
                ))}
            </div>

            {authTypeLogin ? (
                <div>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    ></input>
                    <input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    ></input>
                </div>
            ) : (
                <div>
                    <input
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    ></input>
                    <input
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></input>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    ></input>
                    <input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                    ></input>
                    <input
                        placeholder="Repeat Password"
                        value={repeatedPassword}
                        onChange={(e) => setRepeatedPassword(e.target.value)}
                        type="password"
                    ></input>
                </div>
            )}

            <button onClick={credentialsAuthenticate}>
                {authTypeLogin ? "Login" : "Register"}
            </button>
        </div>
    );
};

export default LoginPage;
