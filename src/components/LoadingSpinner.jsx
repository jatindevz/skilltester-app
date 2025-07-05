// components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative">
                {/* Outer ring with gradient */}
                <div className="w-16 h-16 rounded-full border-4 border-[#051014]">
                    {/* Inner spinning gradient ring */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-[#A599B5] border-r-[#ACBDBA] animate-spin">
                        {/* Inner circle with gradient */}
                        <div className="absolute inset-0 m-1 rounded-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] opacity-20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-lg text-[#ACBDBA] animate-pulse">
                {text}
            </p>
        </div>
    );
};

export const FullPageLoader = ({ text = "Loading..." }) => {
    return (
        <div className="fixed inset-0 bg-[#051014] bg-opacity-90 z-50 flex flex-col items-center justify-center">
            <LoadingSpinner text={text} />
        </div>
    );
};

export default LoadingSpinner;