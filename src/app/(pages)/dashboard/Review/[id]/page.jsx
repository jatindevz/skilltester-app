'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
// import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { LoadingView, ErrorView } from '@/components/common';

// Reusable StageSection Component
const StageSection = ({ stage, index }) => {
    return (
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
};

// Reusable RoadmapSection Component
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

// Reusable FlowInfo Component
const FlowInfo = ({ flowdata }) => {
    if (!flowdata) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 border rounded border-[#2E2F2F] p-2">
            <span className="text-[#C2D6D6] font-medium">{flowdata?.flowIdx}</span>
            <span className="text-[#C2D6D6] truncate max-w-xs">{flowdata?.flowname}</span>
            <div className="flex flex-wrap gap-2">
                {flowdata.skills?.name?.map((skill, idx) => (
                    <span
                        key={idx}
                        className="bg-[#2E2F2F] text-[#ACBDBA] px-2 py-1 rounded text-xs"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
};

// Main RoadmapPage Component
const RoadmapPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [roadmap, setRoadmapData] = useState(null);
    const [flowdata, setFlowdata] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchRoadmapData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(false);
            const { data } = await axios.get(`/api/createflow/${id}/roadmap`);

            if (!data?.success) {
                throw new Error(data?.message || 'Failed to fetch roadmap data');
            }

            setFlowdata(data.flowdata);
            setRoadmapData(data.roadmap);
        } catch (error) {
            console.error('Roadmap fetch error:', error);
            setError(true);
            toast.error(error.message || 'Failed to load roadmap');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchRoadmapData();
    }, [id, fetchRoadmapData]);

    if (isLoading) {
        return <LoadingView text="Building your learning roadmap..." />;
    }

    if (error || !roadmap) {
        return (
            <ErrorView
                title="Failed to load roadmap data"
                retry={fetchRoadmapData}
                secondaryAction={() => router.push(`/dashboard/${id}/skills`)}
                secondaryText="Edit Skills"
            />
        );
    }

    return (
        <div className="bg-[#051014] min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <Button
                        onClick={() => router.push(`/dashboard`)}
                        className="flex items-center gap-1 text-[#C2D6D6] bg-[#2E2F2F] hover:bg-[#2E2F2F]/80"
                        icon={<ChevronLeft className="h-4 w-4" />}
                    >
                        Dashboard
                    </Button>

                    <FlowInfo flowdata={flowdata} />
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
                            key={`${stage.stage}-${index}`}
                            stage={stage}
                            index={index}
                        />
                    ))}
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

const CardDescription = ({ children, className }) => (
    <p className={`text-sm ${className}`}>
        {children}
    </p>
);


export default RoadmapPage;