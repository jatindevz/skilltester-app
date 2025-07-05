//src/app/api/auth/[...nextauth]/option.ts

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/database";
import Usermodel from "@/model/user.model";
import { signIn } from "next-auth/react";






export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();
                try {
                    const { email, password } = credentials;
                    const user = await Usermodel.findOne({ email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (isPasswordValid) {
                        return user;
                    } else {
                        throw new Error("Invalid password");
                    }
                } catch (error) {
                    console.log(" login failed", error);

                    throw new Error(error);
                }
            },
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.username = token.username
                session.user.email = token.email
            }
            return session
        },

        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.username = user.username
                token.email = user.email

            }
            return token
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

};