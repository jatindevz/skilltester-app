'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

const RoadmapPage = () => {
    const { flowid } = useParams();
    const [roadmap, setRoadmapData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const router = useRouter();

    const fetchRoadmapData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(false);
            const { data } = await axios.get(`/api/createflow/${flowid}/roadmap`);

            if (!data?.success) {
                throw new Error(data?.message || 'Failed to fetch roadmap data');
            }

            setRoadmapData(data.roadmap);
        } catch (error) {
            console.error('Roadmap fetch error:', error);
            setError(true);
            toast.error(error.message || 'Failed to load roadmap');
        } finally {
            setIsLoading(false);
        }
    }, [flowid]);

    useEffect(() => {
        if (flowid) fetchRoadmapData();
    }, [flowid, fetchRoadmapData]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#051014] p-6">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] mb-4"></div>
                    <div className="h-6 w-64 bg-[#2E2F2F] rounded mb-4"></div>
                    <div className="h-4 w-48 bg-[#2E2F2F] rounded"></div>
                </div>
                <p className="mt-8 text-[#ACBDBA] text-lg">Building your personalized learning roadmap...</p>
            </div>
        );
    }

    if (error || !roadmap) {
        return (
            <div className="max-w-3xl mx-auto p-6 min-h-screen bg-[#051014] flex flex-col items-center justify-center text-center">
                <p className="text-[#C2D6D6] text-xl mb-6">Failed to load roadmap data</p>
                <div className="flex gap-3">
                    <Button
                        onClick={fetchRoadmapData}
                        className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={() => router.push(`/dashboard/${flowid}/skills`)}
                        className="border border-[#2E2F2F] text-[#C2D6D6] hover:bg-[#2E2F2F]/50"
                    >
                        Edit Skills
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#051014] min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button
                        onClick={() => router.push(`/dashboard`)}
                        className="flex items-center gap-1 text-[#C2D6D6] bg-[#2E2F2F] hover:bg-[#2E2F2F]/80"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Dashboard
                    </Button>
                </div>

                <Card className="bg-[#051014] border-[#2E2F2F] mb-10">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">
                            Personalized Learning Roadmap
                        </CardTitle>
                        <CardDescription className="text-[#ACBDBA] mt-2 max-w-2xl mx-auto">
                            Your customized path to mastering your selected skills
                        </CardDescription>
                    </CardHeader>
                </Card>

                <div className="space-y-8">
                    {roadmap.roadmapdata.map((stage, index) => (
                        <StageSection
                            key={stage.stage}
                            stage={stage}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Stage Section Component
const StageSection = ({ stage, index }) => (
    <Card className="bg-[#051014] border-[#2E2F2F]">
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                    <div className="bg-[#2E2F2F] w-10 h-10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">
                            {index + 1}
                        </span>
                    </div>
                    <CardTitle className="text-xl text-[#C2D6D6]">
                        {stage.stage}
                    </CardTitle>
                </div>
                <div className="bg-[#2E2F2F] px-3 py-1 rounded-full text-[#ACBDBA] text-sm">
                    {stage.duration}
                </div>
            </div>
        </CardHeader>

        <CardContent className="space-y-6">
            <RoadmapSection
                title="Topics to Master"
                items={stage.topics}
                isList={true}
            />

            <RoadmapSection
                title="Learning Resources"
                items={stage.resources}
                renderItem={(res) => (
                    <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A599B5] hover:text-[#ACBDBA] transition-colors hover:underline"
                    >
                        {res.title}
                    </a>
                )}
            />

            <RoadmapSection
                title="Practical Projects"
                items={stage.projects}
                renderItem={(proj) => (
                    <div>
                        <h4 className="font-medium text-[#C2D6D6]">{proj.name}</h4>
                        <p className="text-[#ACBDBA] mt-1">{proj.description}</p>
                    </div>
                )}
            />
        </CardContent>
    </Card>
);

// Roadmap Section Component
const RoadmapSection = ({ title, items, isList = false, renderItem }) => {
    if (!items?.length) return null;

    return (
        <div>
            <h3 className="text-lg font-medium text-[#ACBDBA] mb-3 border-b border-[#2E2F2F] pb-2">
                {title}
            </h3>

            {isList ? (
                <ul className="space-y-2 pl-5">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                            <span className="text-[#A599B5] mr-2">•</span>
                            <span className="text-[#C2D6D6]">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <Card
                            key={idx}
                            className="bg-[#051014] border-[#2E2F2F] p-4"
                        >
                            {renderItem(item)}
                        </Card>
                    ))}
                </div>
            )}
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

const CardDescription = ({ children, className }) => (
    <p className={`text-sm ${className}`}>
        {children}
    </p>
);

export default RoadmapPage;