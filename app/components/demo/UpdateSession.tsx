"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { ObjectId } from "mongodb";

type Props = {};

const UpdateSession = (props: Props) => {
    const { data: session, update, status } = useSession();

    const [testInput, setTestInput] = useState<string>("");

    const updateSessionHandler = async () => {
        console.log(testInput);

        const one = "asdasd";
        const two = "asdas";

        if (!session?.user?.workspaces)
            return;

        const prevWorkspaces = session.user.workspaces;
        console.log(prevWorkspaces);

        await update({
            ...session,
            user: {
                ...session?.user,
                workspaces: [
                    ...prevWorkspaces,
                    one,
                    two,
                ],
            },
        });
    };
    const logSessionHandler = async () => {
        console.log(session);
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
        </div>
    );
};

export default UpdateSession;
