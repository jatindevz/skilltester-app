'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (res?.ok) {
                window.location.href = '/dashboard';
            } else {
                throw new Error(res?.error || 'Invalid credentials');
            }
        } catch (error) {
            alert(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#051014] p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-[#ACBDBA]">Sign in to continue your learning journey</p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-[#0f1c21] p-8 rounded-2xl border border-[#2E2F2F] shadow-xl"
                >
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[#C2D6D6] mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-[#051014] border border-[#2E2F2F] text-[#C2D6D6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A599B5]/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[#C2D6D6] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full bg-[#051014] border border-[#2E2F2F] text-[#C2D6D6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A599B5]/50 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACBDBA] hover:text-[#A599B5]"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#051014] mr-2"></span>
                                    Signing In...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-[#2E2F2F]">
                            <p className="text-[#ACBDBA]">
                                Don't have an account?{' '}
                                <a href="/#signup" className="text-[#A599B5] hover:underline font-medium">
                                    Sign up
                                </a>
                            </p>
                        </div>
                    </div>
                </form>

                <div className="mt-8 text-center text-[#ACBDBA] text-sm">
                    <p>© {new Date().getFullYear()} SkillGap AI. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}