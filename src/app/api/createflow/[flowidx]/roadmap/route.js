// src/app/api/createflow/[flowidx]/roadmap/route.js
import { NextResponse } from "next/server";
import { extractFromAIResponse } from "@/myhooks/hooks";
import { getFlow, callAIService, errorResponse } from "@/lib/route-helpers";

export async function POST(req, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { userDoc, flow } = result;

        // Generate roadmap
        const aiMessage = await callAIService(
            req,
            "Roadmap",
            [flow.quizLogs, flow.analysis, flow.skills]
        );

        const roadmap = await extractFromAIResponse({ message: aiMessage });
        flow.roadmap.roadmapdata = roadmap.roadmap;

        await userDoc.save();
        return NextResponse.json({
            success: true,
            message: "Roadmap generated successfully"
        });

    } catch (error) {
        console.error("Roadmap POST error:", error);
        return errorResponse("Failed to generate roadmap", 500);
    }
}

export async function GET(_, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { flow } = result;
        return NextResponse.json({
            success: true,
            roadmap: flow.roadmap,
            flowdata: flow
        });

    } catch (error) {
        console.error("Roadmap GET error:", error);
        return errorResponse("Failed to fetch roadmap", 500);
    }
}