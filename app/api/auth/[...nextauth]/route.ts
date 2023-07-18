import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // https://stackoverflow.com/questions/76503606/next-auth-error-adapter-is-not-assignable-to-type-adapter-undefined
import clientPromise from "@/app/lib/mongodb";

import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/models/User";
import md5 from "md5";
import dbConnect from "@/app/lib/dbConnect";

const handler = NextAuth({
    session: {
        strategy: "jwt",
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

                // Authorize user
                return { userFound };
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
