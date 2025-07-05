// src/app/api/createflow/route.js
import dbConnect from "@/lib/database";
import Usermodel from "@/model/user.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


export async function POST(req) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user || !user._id) {
        console.log("User not authenticated");
        return NextResponse.json({
            success: false,
            message: "User not authenticated",
        }, { status: 401 });
    }

    const { flowname } = await req.json();

    if (!flowname) {
        console.log("Flow name is required");
        return NextResponse.json({ message: "Flow name is required" }, { status: 400 });
    }

    try {
        console.log(user._id);
        
        const dbUser = await Usermodel.findById(user._id);

        if (!dbUser) {
            console.log("User not found");
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const flowIdx = dbUser.flow.length + 1;

        const newFlow = {
            flowIdx,
            flowname,
            skills: { name: [] },
            quizLogs: {
                score: 0,
                questions: [],
                createdAt: new Date(),
            },
            analysis: {
                summary: " ",
                strongTopics: [],
                weakTopics: [],
                reasoning: "     ",
                createdAt: new Date(),
            },
            roadmap: {
                roadmapdata: [],
                createdAt: new Date(),
            },
            createdAt: new Date(),
        };

        dbUser.flow.push(newFlow);
        await dbUser.save();

        const savedFlow = dbUser.flow[dbUser.flow.length - 1];

        return NextResponse.json({ message: "Flow created successfully", flow: savedFlow, flowid: savedFlow._id }, { status: 200 });

    } catch (error) {
        console.error("Error creating flow:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}


export async function GET(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const userDoc = await Usermodel.findById(user._id);
    if (!userDoc) {
        console.warn("User not found");
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, flow: userDoc.flow, message: "Success" }, { status: 200 });
}

export async function DELETE(req) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const userDoc = await Usermodel.findById(user._id);
    if (!userDoc) {
        console.warn("User not found");
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const { id } = await req.json();
    const flow = userDoc.flow.find(f => f._id?.toString() === id);
    if (!flow) {
        console.warn("Flow not found");
        return NextResponse.json({ success: false, message: "Flow not found" }, { status: 404 });
    }
    userDoc.flow = userDoc.flow.filter(f => f._id?.toString() !== id);
    await userDoc.save();
    return NextResponse.json({ success: true, message: "Flow deleted successfully" }, { status: 200 });
}