'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { FullPageLoader } from '@/components/LoadingSpinner';

const Result = () => {
    const { flowid } = useParams();
    const router = useRouter();
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [changeofroute, setChangeofroute] = useState(false);

    const fetchAnalysis = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(`/api/createflow/${flowid}/analysis`);

            if (!data.success) throw new Error(data.message || 'Failed to fetch analysis');

            setAnalysis({
                score: data.score,
                summary: data.analysis.summary,
                weakTopics: data.analysis.weakTopics,
                reasoning: data.analysis.reasoning
            });
        } catch (error) {
            console.error('Error fetching analysis:', error);
            toast.error('Failed to load analysis data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (flowid) fetchAnalysis();
    }, [flowid]);

    const generateRoadmap = async () => {

        try {
            setIsGenerating(true);
            setChangeofroute(true)
            const { data } = await axios.post(`/api/createflow/${flowid}/roadmap`);

            if (data.success) {
                toast.success('Roadmap generated successfully!');
                router.push(`/dashboard/${flowid}/roadmap`);
            } else {
                throw new Error(data.message || 'Roadmap generation failed');
            }
        } catch (error) {
            console.error('Roadmap generation error:', error);
            toast.error('Failed to generate roadmap');
        } finally {
            setIsGenerating(false);
        }
    };
    if (changeofroute) {
        return (
            <FullPageLoader />
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#051014] p-6">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] mb-4"></div>
                    <div className="h-6 w-64 bg-[#2E2F2F] rounded mb-4"></div>
                    <div className="h-4 w-48 bg-[#2E2F2F] rounded"></div>
                </div>
                <p className="mt-8 text-[#ACBDBA] text-lg">Analyzing your results...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#051014] flex flex-col items-center justify-center text-center">
                <p className="text-[#C2D6D6] text-xl mb-6">No analysis data available</p>
                <div className="flex gap-3">
                    <Button
                        onClick={fetchAnalysis}
                        className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
                    >
                        Retry Analysis
                    </Button>
                    <Button
                        onClick={() => router.push(`/dashboard`)}
                        className="border border-[#2E2F2F] text-[#C2D6D6] hover:bg-[#2E2F2F]/50"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    // Calculate score percentage
    const scorePercentage = (analysis.score / 10) * 100;
    const scoreColor = scorePercentage >= 70
        ? 'from-green-400 to-teal-500'
        : scorePercentage >= 50
            ? 'from-yellow-400 to-orange-500'
            : 'from-red-500 to-pink-500';

    return (
        <div className="bg-[#051014] min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Button
                        onClick={() => router.push(`/dashboard`)}
                        className="flex items-center gap-1 text-[#C2D6D6] bg-[#2E2F2F] hover:bg-[#2E2F2F]/80"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Dashboard
                    </Button>
                </div>

                <Card className="bg-[#051014] border-[#2E2F2F] mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">
                            Quiz Results
                        </CardTitle>
                        <div className="mt-6">
                            <p className="text-xl text-[#C2D6D6]">
                                Your Score: <span className="font-bold">{analysis.score}</span> / 5
                            </p>
                            <div className="w-full bg-[#2E2F2F] rounded-full h-3 mt-4">
                                <div
                                    className={`bg-gradient-to-r ${scoreColor} h-3 rounded-full`}
                                    style={{ width: `${scorePercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-[#051014] border-[#2E2F2F]">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#C2D6D6]">
                                Performance Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[#C2D6D6] bg-[#2E2F2F] p-4 rounded-lg">
                                {analysis.summary}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051014] border-[#2E2F2F]">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#C2D6D6]">
                                Areas to Improve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {analysis.weakTopics.map((topic, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-[#A599B5] mr-2 mt-1">•</span>
                                        <span className="text-[#C2D6D6]">{topic}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#051014] border-[#2E2F2F]">
                        <CardHeader>
                            <CardTitle className="text-xl text-[#C2D6D6]">
                                Recommendations
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-[#C2D6D6] bg-[#2E2F2F] p-4 rounded-lg">
                                {analysis.reasoning}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-10 text-center">
                    <Button
                        onClick={generateRoadmap}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] px-8 py-4 text-lg font-medium"
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center">
                                <span className="animate-spin mr-2">↻</span>
                                Generating Roadmap...
                            </span>
                        ) : (
                            'Get Personalized Roadmap'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Button Component
const Button = ({ children, className, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg transition-colors ${className}`}
    >
        {children}
    </button>
);

// Card Components
const Card = ({ children, className }) => (
    <div className={`rounded-xl border ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className }) => (
    <h2 className={`text-xl font-semibold ${className}`}>
        {children}
    </h2>
);

export default Result;