"use client";
import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster";

type Props = {};

const LoginPage = (props: Props) => {
    const session = useSession();
    const { toast } = useToast()

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [authTypeLogin, setAuthTypeLogin] = useState<boolean>(true);
    const switchAuthType = () => {
        setAuthTypeLogin(!authTypeLogin);
    };

    useEffect(() => {
        if (session.status === "authenticated") return redirect("/");
    }, [session]);

    const loginUser = async (e: any) => {
        // Validate form
        // Ignore validating the form again if the user has just registered
        if (authTypeLogin) {
            if (!email || !password) {
                toast({
                    variant: "destructive",
                    title: "Invalid Values",
                    description: "Missing credentials! Please fill the entire form"
                });
                return;
            }
            if (!email.match(/^\S+@\S+\.\S+$/)) {
                toast({
                    variant: "destructive",
                    title: "Invalid Values",
                    description: "Invalid Email Address!"
                });
                return;
            }
        }

        await signIn("credentials", {
            email: email,
            password: password,
            redirect: false,
        })
        .then((res) => {
            console.log(res);
            if (res?.hasOwnProperty("error") && res.error !== null) {
                toast({
                    variant: "destructive",
                    title: "Failed to Log In",
                    description: res?.error
                });
            }
            else {
                redirect("/");
            }
        })
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
            toast({
                variant: "destructive",
                title: "Invalid Values",
                description: "Missing credentials! Please fill the entire form"
            });
            return;
        }
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            toast({
                variant: "destructive",
                title: "Invalid Values",
                description: "Invalid Email Address!"
            });
            return;
        }
        if (repeatedPassword !== password) {
            toast({
                variant: "destructive",
                title: "Invalid Values",
                description: "Passwords don't match!"
            });
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
            } else if (response.status == 400) {
                // Email already exists
                toast({
                    variant: "destructive",
                    title: "Invalid Values",
                    description: "Email already exists! Please use a different one or login."
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something Went Wrong."
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something Went Wrong. " + err
            });
        }

        // Login User
        loginUser(e);
    };

    return (
        <div className="bg-gray-200 w-screen h-screen flex items-center justify-center">
            <div className="bg-gray-100 w-full max-w-lg rounded-md shadow-lg py-12 px-8 text-center">
                <h1 className="text-2xl font-bold">{authTypeLogin ? "Log in" : "Register"}</h1>
                <div className="text-sm font-light mt-1">
                    <span>
                        {authTypeLogin ? "New here? " : "Already registered? "}
                        <span onClick={switchAuthType} className="text-blue-400">
                            {authTypeLogin ? "Register" : "Log in"}
                        </span>
                    </span>
                </div>

                {authTypeLogin ? (
                    <form className="w-full max-w-sm mx-auto mt-6 flex flex-col gap-2">
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="bg-gray-100"
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="bg-gray-100"
                        />
                    </form>
                ) : (
                    <form className="w-full max-w-sm mx-auto mt-6 flex flex-col gap-2">
                        <Input
                            placeholder="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-gray-100"
                        />
                        <Input
                            placeholder="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-gray-100"
                        />
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="bg-gray-100"
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="bg-gray-100"
                        />
                        <Input
                            placeholder="Repeat Password"
                            value={repeatedPassword}
                            onChange={(e) =>
                                setRepeatedPassword(e.target.value)
                            }
                            type="password"
                            className="bg-gray-100"
                        />
                    </form>
                )}

                <Button
                    onClick={authTypeLogin ? loginUser : registerUser}
                    className="mt-7"
                >
                    {authTypeLogin ? "Login" : "Register"}
                </Button>
            </div>
            <Toaster />
        </div>
    );
};

export default LoginPage;
