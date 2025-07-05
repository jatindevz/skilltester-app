// src/app/api/createflow/[flowidx]/analysis/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { extractFromAIResponse } from "@/myhooks/hooks";
import { getFlow, callAIService, errorResponse } from "@/lib/route-helpers";

export async function POST(req, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { userDoc, flow } = result;
        const { score, updatedQuestions } = await req.json();
        const skills = flow.skills;

        // Update quiz logs
        flow.quizLogs = { score, questions: updatedQuestions };
        await userDoc.save();

        // Get AI analysis
        const aiMessage = await callAIService(
            req,
            "Analysis",
            [updatedQuestions, skills]
        );

        flow.analysis = await extractFromAIResponse({ message: aiMessage });
        await userDoc.save();

        return NextResponse.json({
            success: true,
            message: "Quiz updated successfully"
        });

    } catch (error) {
        console.error("Analysis POST error:", error);
        return errorResponse("Failed to process analysis", 500);
    }
}

export async function GET(_, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { flow } = result;
        return NextResponse.json({
            success: true,
            score: flow.quizLogs?.score,
            analysis: flow.analysis
        });

    } catch (error) {
        console.error("Analysis GET error:", error);
        return errorResponse("Failed to fetch analysis", 500);
    }
}