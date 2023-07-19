import NextAuth, { DefaultSession } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // https://stackoverflow.com/questions/76503606/next-auth-error-adapter-is-not-assignable-to-type-adapter-undefined
import clientPromise from "@/app/lib/mongodb";

import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import md5 from "md5";
import dbConnect from "@/app/lib/dbConnect";
import { ObjectId } from "mongoose";
import { workspaceType } from "@/app/utilities/WorkspaceContext";


/* Resource for adding properties to the Session object
// https://reacthustle.com/blog/extend-user-session-nextauth-typescript */

declare module "next-auth" {
    interface User {
        email: string;
        firstName: string;
        lastName: string;
        _id: ObjectId;
        workspaces: workspaceType[];
    }
  
    interface Session extends DefaultSession {
        user?: User;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        email: string;
        firstName: string;
        lastName: string;
        userId: ObjectId;
        workspaces: workspaceType[];
    }
}

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.userId = user._id;
                token.workspaces = user.workspaces;
            }

            return token;
        },
        async session({ session, token, user }) {

            if (token && session.user) {
                session.user.email = token.email;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
                session.user._id = token.userId;
                session.user.workspaces = token.workspaces;
            }
            
            return session;
        }
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;

                await dbConnect();

                const userFound = await User.findOne({
                    email: credentials.email,
                });

                // Validate credentials
                if (!userFound) {
                    throw new Error("Email address not registered");
                }

                const hashedPassword = md5(credentials.password as string);
                if (userFound.hashedPassword !== hashedPassword) {
                    throw new Error("Invalid password");
                }

                console.log(userFound);

                // Authorize user
                return userFound;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),
});

export { handler as GET, handler as POST };
