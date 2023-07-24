"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ObjectId } from "mongodb";
import { useDatabase } from "@/utilities/databaseContext";

type Props = {};

const UpdateSession = (props: Props) => {
    const { data: session, update, status } = useSession();

    const { savedWorkspaces } = useDatabase();

    const [testInput, setTestInput] = useState<string>("");

    const updateSessionHandler = async () => {
        console.log(testInput);

        const one = "asdasd";
        const two = "asdas";

        if (!session?.user?.workspaces) return;

        const prevWorkspaces = session.user.workspaces;
        console.log(prevWorkspaces);

        await update({
            ...session,
            user: {
                ...session?.user,
                workspaces: [...prevWorkspaces, one, two],
            },
        });
    };
    const logSessionHandler = async () => {
        console.log(session);
    };
    const logWorkspaces = () => {
        console.log(savedWorkspaces);
    };

    return (
        <div>
            <div className="bg-red-300 text-lg text-bold text-yellow-100">
                <p>{session?.user?.firstName}</p>
            </div>

            <input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
            ></input>

            <button onClick={updateSessionHandler}>update first name</button>

            <button onClick={logSessionHandler}>log session</button>

            <button onClick={logWorkspaces}>log workspaces</button>
        </div>
    );
};

export default UpdateSession;
