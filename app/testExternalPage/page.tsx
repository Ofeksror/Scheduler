"use client"
import { useSession } from 'next-auth/react';
import React from 'react'

type Props = {}

export default function Page() {
    const {data: session, status, update} = useSession();

    const logSessionHandler = () => {
        console.log(session);
    }

    return (
        <div>
            <button onClick={logSessionHandler}>Click me to log session</button>
        </div>
    );
}
