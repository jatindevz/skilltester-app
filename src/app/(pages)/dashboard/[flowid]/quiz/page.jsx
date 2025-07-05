'use client'
import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { FullPageLoader } from '@/components/LoadingSpinner';

const Quiz = () => {
    const { flowid } = useParams();
    const router = useRouter();
    const [questions, setQuestions] = useState([])
    const [userAnswers, setUserAnswers] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [score, setScore] = useState(0)
    const [changeofroute, setChangeofroute] = useState(false)
    const gotoresults = () => {
        setChangeofroute(true)
        router.push(`/dashboard/${flowid}/result`)
    }
    
    const fetchQuiz = useCallback(async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.get(`/api/createflow/${flowid}/skills`)

            if (!data.quiz || data.quiz.length === 0) {
                throw new Error('No questions available');
            }

            setQuestions(data.quiz)

            // Initialize answers state
            const initialAnswers = {};
            data.quiz.forEach(q => {
                initialAnswers[q.questionNo] = '';
            });
            setUserAnswers(initialAnswers);
        } catch (error) {
            console.error('Failed to fetch quiz:', error)
            toast.error('Failed to load quiz questions')
        } finally {
            setIsLoading(false)
        }
    }, [flowid])

    useEffect(() => {
        fetchQuiz()
    }, [fetchQuiz])

    const handleAnswerSelect = (questionNo, optionKey) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [questionNo]: optionKey }))
    }

    const handleSubmit = async () => {
        // Calculate score
        let calculatedScore = 0;
        const updatedQuestions = questions.map(q => {
            const userAnswer = userAnswers[q.questionNo] || '';
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) calculatedScore++;

            return {
                ...q,
                userAnswer,
                isCorrect
            }
        })

        setQuestions(updatedQuestions)
        setScore(calculatedScore)
        setIsSubmitted(true)

        try {
            await axios.post(`/api/createflow/${flowid}/analysis`, {
                score: calculatedScore,
                totalQuestions: questions.length,
                updatedQuestions
            })
            toast.success('Quiz submitted successfully!')
        } catch (error) {
            console.error('Submission failed:', error)
            toast.error('Failed to save quiz results')
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#051014] p-6">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] mb-4"></div>
                    <div className="h-6 w-64 bg-[#2E2F2F] rounded mb-4"></div>
                    <div className="h-4 w-48 bg-[#2E2F2F] rounded"></div>
                </div>
                <p className="mt-8 text-[#ACBDBA] text-lg">Preparing your quiz questions...</p>
            </div>
        )
    }
    if (changeofroute) {
        return <FullPageLoader />
    }


    if (!questions.length) {
        return (
            <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#051014] flex flex-col items-center justify-center text-center">
                <p className="text-[#C2D6D6] text-xl mb-6">No questions available for this quiz</p>
                <div className="flex gap-3">
                    <Button
                        onClick={fetchQuiz}
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
        )
    }

    return (
        <div className="bg-[#051014] min-h-screen p-6">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Button
                        onClick={() => router.push(`/dashboard/${flowid}/skills`)}
                        className="flex items-center gap-1 text-[#C2D6D6] bg-[#2E2F2F] hover:bg-[#2E2F2F]/80"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back to Skills
                    </Button>
                </div>

                <Card className="bg-[#051014] border-[#2E2F2F] mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#ACBDBA] to-[#A599B5] bg-clip-text text-transparent">
                            Skill Assessment Quiz
                        </CardTitle>
                        <CardDescription className="text-[#ACBDBA] mt-2">
                            Test your knowledge in the selected skills
                        </CardDescription>

                        {isSubmitted && (
                            <div className="mt-6">
                                <p className="text-xl text-[#C2D6D6]">
                                    Your Score: <span className="font-bold">{score}</span> / {questions.length}
                                </p>
                                <div className="w-full bg-[#2E2F2F] rounded-full h-2 mt-4">
                                    <div
                                        className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] h-2 rounded-full"
                                        style={{ width: `${(score / questions.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    {questions.map(q => (
                        <QuestionItem
                            key={q._id}
                            question={q}
                            selectedAnswer={userAnswers[q.questionNo]}
                            onAnswerSelect={handleAnswerSelect}
                            isSubmitted={isSubmitted}
                        />
                    ))}
                </div>

                <div className="mt-10 text-center">
                    {!isSubmitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={Object.values(userAnswers).some(a => !a)}
                            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] px-8 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button
                            onClick={gotoresults}
                            className="bg-gradient-to-r from-[#A599B5] to-[#ACBDBA] hover:from-[#A599B5]/90 hover:to-[#ACBDBA]/90 text-[#051014] px-8 py-4 text-lg font-medium"
                        >
                            View Detailed Analysis
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Extracted Question Component
const QuestionItem = ({ question, selectedAnswer, onAnswerSelect, isSubmitted }) => {
    const { questionNo, question: questionText, options, correctAnswer, explanation } = question;

    return (
        <Card className="bg-[#051014] border-[#2E2F2F] hover:border-[#A599B5]/30 transition-colors">
            <CardHeader>
                <div className="flex items-start">
                    <div className="bg-[#2E2F2F] w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-[#C2D6D6] font-medium">{questionNo}</span>
                    </div>
                    <CardTitle className="text-lg text-[#C2D6D6]">{questionText}</CardTitle>
                </div>
            </CardHeader>

            <CardContent>
                <ul className="space-y-3 mb-6">
                    {Object.entries(options).map(([key, value]) => {
                        const isSelected = selectedAnswer === key;
                        const isCorrect = key === correctAnswer;
                        const showCorrect = isSubmitted && isCorrect;
                        const showIncorrect = isSubmitted && isSelected && !isCorrect;

                        return (
                            <li key={key}>
                                <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all
                                    ${isSelected && !isSubmitted
                                        ? 'bg-[#2E2F2F] border-[#A599B5]/50'
                                        : 'border-[#2E2F2F]'
                                    }
                                    ${showCorrect
                                        ? 'bg-green-900/20 border-green-600/50'
                                        : ''
                                    }
                                    ${showIncorrect
                                        ? 'bg-red-900/20 border-red-600/50'
                                        : ''
                                    }
                                    ${isSubmitted
                                        ? 'cursor-default'
                                        : 'hover:bg-[#2E2F2F]'
                                    }
                                `}>
                                    {!isSubmitted && (
                                        <input
                                            type="radio"
                                            name={`question-${questionNo}`}
                                            checked={isSelected}
                                            onChange={() => onAnswerSelect(questionNo, key)}
                                            className="mt-1 mr-3"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <span className={`font-medium ${showCorrect
                                                ? 'text-green-400'
                                                : showIncorrect
                                                    ? 'text-red-400'
                                                    : 'text-[#ACBDBA]'
                                            }`}>
                                            {key}.
                                        </span>
                                        <span className={`ml-2 ${showCorrect
                                                ? 'text-green-400'
                                                : showIncorrect
                                                    ? 'text-red-400'
                                                    : 'text-[#C2D6D6]'
                                            }`}>
                                            {value}
                                        </span>

                                        {showCorrect && (
                                            <span className="ml-3 text-xs px-2 py-1 bg-green-900/30 text-green-400 rounded-full">
                                                Correct Answer
                                            </span>
                                        )}
                                        {showIncorrect && (
                                            <span className="ml-3 text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded-full">
                                                Your Answer
                                            </span>
                                        )}
                                    </div>
                                </label>
                            </li>
                        )
                    })}
                </ul>

                {isSubmitted && (
                    <div className="bg-[#2E2F2F] p-4 rounded-lg">
                        <div className="flex flex-wrap gap-4 mb-3">
                            <div>
                                <span className="font-medium text-[#ACBDBA]">Correct Answer:</span>
                                <span className="ml-2 text-green-400 font-bold">{correctAnswer}</span>
                            </div>
                            <div>
                                <span className="font-medium text-[#ACBDBA]">Your Answer:</span>
                                <span className={`ml-2 font-bold ${selectedAnswer === correctAnswer
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                    }`}>
                                    {selectedAnswer || 'Not answered'}
                                </span>
                            </div>
                        </div>

                        {explanation && (
                            <div>
                                <p className="font-medium text-[#ACBDBA] mb-1">Explanation:</p>
                                <p className="text-[#C2D6D6]">{explanation}</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Button Component
const Button = ({ children, className, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg transition-colors ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default Quiz