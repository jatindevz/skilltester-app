import { NextResponse } from "next/server";
import { generatePrompt } from "@/dummy/prompt";

export async function POST(request: Request) {
    try {
        const { template, data } = await request.json();
        console.log("Template:", template);
        console.log("Data:", data);
        const prompt = generatePrompt(template, data);
        console.log("Generated Prompt:", prompt);
        if (!prompt) {
            console.log("Prompt is required");
            return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
        }

        if (!process.env.FLASHCARD_AI_KEY) {
            console.error("API key not configured");
            return NextResponse.json({ message: "API key not configured" }, { status: 500 });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.FLASHCARD_AI_KEY}`,
                "Content-Type": "application/json",
                // Optional headers - remove or replace with real values if needed
                // "HTTP-Referer": "https://yourdomain.com",
                // "X-Title": "Your App Name",
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API error:", response.status, errorText);
            return new NextResponse(`Error: ${response.status} - ${errorText}`, { status: response.status });
        }

        const dataset = await response.json();
        const assistantMessage = dataset.choices?.[0]?.message?.content;

        if (!assistantMessage) {
            console.error("Invalid AI response structure:", JSON.stringify(dataset));
            return NextResponse.json({ message: "Invalid AI response" }, { status: 500 });
        }

        return NextResponse.json({ message: assistantMessage }, { status: 200 });

    } catch (error) {
        console.error("Unhandled error:", error);
        return NextResponse.json({ message: "Internal Server Error yaha se hai textmsg" }, { status: 500 });
    }
}
