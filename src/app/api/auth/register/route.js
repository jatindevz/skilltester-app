import dbConnect from "@/lib/database";
import bcrypt from "bcryptjs";
import Usermodel from "@/model/user.model";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        const existingEmailUser = await Usermodel.findOne({ email });
        const existingUsernameUser = await Usermodel.findOne({ username });

        // ❌ Username is already taken by someone else
        if (existingUsernameUser && existingUsernameUser.email !== email) {
            return NextResponse.json(
                { success: false, message: "Username already taken" },
                { status: 400 }
            );
        }

        // 🔐 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔢 Generate verification code and expiry
        const verifycode = crypto.randomInt(100000, 999999).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        let savedUser;

        // ✏️ If user already exists by email
        if (existingEmailUser) {
            if (existingEmailUser.isVerified) {
                return NextResponse.json(
                    { success: false, message: "User already exists and is verified" },
                    { status: 400 }
                );
            }

            // 🔄 Update unverified user
            savedUser = await Usermodel.findOneAndUpdate(
                { email },
                {
                    $set: {
                        username,
                        password: hashedPassword,
                        isVerified: false,
                        verifycode,
                        verifycodeexpire: expiryDate,
                    },
                },
                { new: true }
            );
        } else {
            // 🆕 Create new user with empty `flow` array
            const newUser = new Usermodel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifycode,
                verifycodeexpire: expiryDate,
            });

            savedUser = await newUser.save();
        }

        return NextResponse.json({
            success: true,
            message: "User registered. Verification code sent.",
            userId: savedUser._id,
        });

    } catch (error) {
        console.error("Error in registration:", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
