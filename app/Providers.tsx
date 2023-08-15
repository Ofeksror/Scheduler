'use client';

import AuthProvider from "@/utilities/AuthProvider";
import { SelectedWorkspaceProvider } from "@/utilities/WorkspaceContext";
import { DatabaseProvider } from "@/utilities/databaseContext";
import { CookiesProvider } from "react-cookie";


export function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
  return (
    <CookiesProvider>
        <AuthProvider>
            <DatabaseProvider>
                <SelectedWorkspaceProvider>
                    {children}
                </SelectedWorkspaceProvider>
            </DatabaseProvider>
        </AuthProvider>
    </CookiesProvider>
  );
}