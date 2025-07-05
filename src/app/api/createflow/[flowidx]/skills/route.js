// src/app/api/createflow/[flowidx]/skills/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { extractFromAIResponse } from "@/myhooks/hooks";
import { getFlow, callAIService, errorResponse } from "@/lib/route-helpers";

export async function POST(req, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { userDoc, flow } = result;
        const { skills: newSkills } = await req.json();

        // Validate skills
        if (!Array.isArray(newSkills) || newSkills.length === 0) {
            return errorResponse("Skills must be a non-empty array", 400);
        }

        // Update skills
        flow.skills.name = newSkills;

        // Generate quiz
        const aiMessage = await callAIService(
            req,
            "skill-based-quiz",
            { skills: newSkills.join(", ") }
        );

        const quiz = await extractFromAIResponse({ message: aiMessage });

        // Transform quiz questions
        flow.quizLogs = {
            score: 0,
            questions: quiz.map((q, idx) => ({
                questionNo: idx + 1,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                userAnswer: " ",
                isCorrect: false,
                explanation: q.explanation
            })),
            createdAt: new Date()
        };

        await userDoc.save();
        return NextResponse.json({
            success: true,
            message: `Skills updated and quiz generated`,
            data: flow.skills,
            quiz: flow.quizLogs.questions
        });

    } catch (error) {
        console.error("Skills POST error:", error);
        return errorResponse("Failed to update skills", 500);
    }
}

export async function GET(_, context) {
    try {
        const result = await getFlow(context);
        if (result.error) return errorResponse(result.error.message, result.error.status);

        const { flow } = result;
        const quizLog = flow.quizLogs || {};

        if (!quizLog.questions || quizLog.questions.length === 0) {
            return errorResponse("No quiz found to update", 400);
        }

        return NextResponse.json({
            success: true,
            score: quizLog.score,
            quiz: quizLog.questions,
            total: quizLog.questions.length
        });

    } catch (error) {
        console.error("Skills GET error:", error);
        return errorResponse("Failed to fetch skills", 500);
    }
}