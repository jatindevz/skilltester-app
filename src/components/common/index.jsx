// components/common/index.jsx
import React from 'react';

// Loading View Component
export const LoadingView = ({ text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#051014] p-6">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] mb-4"></div>
            <div className="h-6 w-64 bg-[#2E2F2F] rounded mb-4"></div>
            <div className="h-4 w-48 bg-[#2E2F2F] rounded"></div>
        </div>
        <p className="mt-8 text-[#ACBDBA] text-lg">{text}</p>
    </div>
);

// Error View Component
export const ErrorView = ({
    title,
    retry,
    secondaryAction,
    secondaryText
}) => (
    <div className="max-w-3xl mx-auto p-6 min-h-screen bg-[#051014] flex flex-col items-center justify-center text-center">
        <p className="text-[#C2D6D6] text-xl mb-6">{title}</p>
        <div className="flex flex-wrap justify-center gap-3">
            <Button
                onClick={retry}
                className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014]"
            >
                Try Again
            </Button>
            {secondaryAction && (
                <Button
                    onClick={secondaryAction}
                    className="border border-[#2E2F2F] text-[#C2D6D6] hover:bg-[#2E2F2F]/50"
                >
                    {secondaryText}
                </Button>
            )}
        </div>
    </div>
);

// Enhanced Button Component with icon support
export const Button = ({
    children,
    className,
    onClick,
    icon,
    disabled
}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
    >
        {icon}
        {children}
    </button>
);