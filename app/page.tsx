"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Head from 'next/head'

import { useEffect, useRef } from "react";

import Sidebar from "@/components/Sidebar";
import Workspace from "@/components/Workspace";

import { useDatabase } from "@/utilities/databaseContext";
import { Toaster } from "@/components/ui/toaster";
import ExtensionAdapter from "@/components/ExtensionAdapter";

export const metadata = {
    title: 'Tab Manager',
}

const styles = {
    rootContainer: "h-screen w-screen",
    outerContainer: "w-full h-full flex",
    mainContent: "bg-gray-50 w-full h-full",
};

export default function Home() {
    const session = useSession();
    const { refreshWorkspaces } = useDatabase();

    const hasRun = useRef(false);

    useEffect(() => {
        if (session.status === "unauthenticated") return redirect("/login");

        if (session.status === "authenticated" && !hasRun.current) {
            // Initially refresh workspaces only once
            refreshWorkspaces();
            hasRun.current = true;
        }
    }, [session]);


    return (
        <div className={styles.rootContainer}>

            <div className={styles.outerContainer}>
                <Sidebar />
                <div className={styles.mainContent}>
                    <Workspace />
                </div>
            </div>

            <ExtensionAdapter />

            <Toaster />
        </div>
    );
}
