import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"; // https://stackoverflow.com/questions/76503606/next-auth-error-adapter-is-not-assignable-to-type-adapter-undefined
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/app/lib/mongodb";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/models/User";
import md5 from "md5";

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                await dbConnect();

                const user = await User.findOne({
                    email: credentials?.email,
                });

                if (!user) throw new Error("User not found");

                // Compare hashed passwords
                if (
                    user.hashedPassword !== md5(credentials?.password as string)
                )
                    throw new Error("Incorrect password");

                return user;
            },
        }),
    ],
    debug: process.env.NODE_ENV === "development",
    adapter: MongoDBAdapter(clientPromise),
});

export { handler as GET, handler as POST };
