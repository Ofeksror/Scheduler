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
        if (session.status === "authenticated") return redirect("/");
    }, [session]);

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [authTypeLogin, setAuthTypeLogin] = useState<boolean>(true);
    const switchAuthType = () => {
        setAuthTypeLogin(!authTypeLogin);
    };

    const [formMessage, setFormMessage] = useState<string>("");

    const loginUser = async (e: any) => {
        // Validate form
        // Ignore validating the form again if the user has just registered
        if (authTypeLogin) {
            if (!email || !password) {
                setFormMessage(
                    "Missing credentials! Please fill the entire form"
                );
                return;
            }
            if (!email.match(/^\S+@\S+\.\S+$/)) {
                setFormMessage("Invalid email address!");
                return;
            }
        }

        signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        }).then((result) => {
            if (result) {
                console.log(result);
                if (result.error) setFormMessage(result.error);
            }
        });
    };

    const registerUser = async (e: any) => {
        // Validate form
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !repeatedPassword
        ) {
            setFormMessage("Missing credentials! Please fill the entire form");
            return;
        }
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            setFormMessage("Invalid email address!");
            return;
        }
        if (repeatedPassword !== password) {
            setFormMessage("Passwords don't match!");
            return;
        }

        // Register the user to the database
        try {
            const response = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                }),
            });
            if (response.status == 200) {
                // Successful, continue to login
                setFormMessage("");
                console.log("Successful");
            } else if (response.status == 400) {
                // Email already exists
                setFormMessage(
                    "Email already exists! Please use a different one or login."
                );
                console.log("Email exists");
            } else {
                setFormMessage("I have no idea.");
                console.log("What?");
            }
        } catch (err) {
            console.log(err);
        }

        // Login User
        loginUser(e);
    };

    return (
        <div className={styles.container}>
            <div className="bg-red-600 flex gap-4">
                <button onClick={() => console.log(session)}>
                    Log Session
                </button>
                <button
                    onClick={() => {
                        signIn("credentials", {
                            email: "test@test.test",
                            password: "test",
                            redirect: false,
                        });
                    }}
                >
                    Quick sign in [Demo Only]
                </button>
            </div>
            <div className={styles.header}>
                <h1>{authTypeLogin ? "Log in🤗" : "Register👋"}</h1>
            </div>
            <div className={styles.switcherContainer}>
                <span>
                    {authTypeLogin ? "New here?" : "Already registered?"}
                    <span onClick={switchAuthType}>
                        {authTypeLogin ? "Register" : "Log in"}
                    </span>
                </span>
            </div>

            <div>
                <h2>{formMessage}</h2>
            </div>

            {authTypeLogin ? (
                <form>
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
                </form>
            ) : (
                <form>
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
                </form>
            )}

            <button onClick={authTypeLogin ? loginUser : registerUser}>
                {authTypeLogin ? "Login" : "Register"}
            </button>
        </div>
    );
};

export default LoginPage;
