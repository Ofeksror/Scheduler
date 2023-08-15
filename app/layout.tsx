"use client";
import "./globals.css";
// import AuthProvider from "@/utilities/AuthProvider";
// import { CookiesProvider } from "react-cookie";
// import { DatabaseProvider } from "@/utilities/databaseContext";
// import { SelectedWorkspaceProvider } from "@/utilities/WorkspaceContext";
// import type { Metadata } from 'next'
import { Providers } from "@/app/Providers"
import favicon from "@/app/favicon.ico"

export const metadata = {
    title: "Tab Manager",
    description: "My Custom Tab Manager :)",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <title>Tab Manager</title>
                <link rel="icon" href={favicon.src} type="image/x-icon" />
            </head>

            <body>
                <Providers>{ children }</Providers>
            </body>
        </html>
    );
}
