// lib/route-helpers.js
import dbConnect from "@/lib/database";
import Usermodel from "@/model/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import axios from "axios";

// Common flow retrieval logic
export async function getFlow(context) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user || !user._id) {
        return { error: { status: 401, message: "User not authenticated" } };
    }

    const userDoc = await Usermodel.findById(user._id);
    if (!userDoc) {
        return { error: { status: 404, message: "User not found" } };
    }

    const { flowidx } = await context.params;
    const flow = userDoc.flow.find(f => f._id?.toString() === flowidx);

    if (!flow) {
        return { error: { status: 404, message: "Flow not found" } };
    }

    return { userDoc, flow };
}

// Common AI service call
export async function callAIService(req, template, data) {
    const origin = req.nextUrl.origin;
    await new Promise(resolve => {
        setTimeout(resolve, 5000); // 5000ms = 5 seconds
    });
    const response = await axios.post(`${origin}/api/fetchdata`, {
        template,
        data
    });
    return response.data?.message;
}

// Common error response
export function errorResponse(message, status = 500) {
    return NextResponse.json({ success: false, message }, { status });
}