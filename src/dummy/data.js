const dummyUser = {
    username: "john_doe",
    email: "john@example.com",
    password: "hashedpassword123", // Replace with hashed password in production
    isVerified: true,
    verifycode: "",
    verifycodeexpire: new Date(Date.now() + 3600000), // 1 hour from now
    isSubscriptionActive: true,
    flow: [
        {
            flowIdx: 1,
            flowname: "Frontend Development",
            skills: {
                name: ["HTML", "CSS", "JavaScript", "React"]
            },
            quizLogs: {
                score: 8,
                questions: [
                    {
                        questionNo: 1,
                        question: "What does HTML stand for?",
                        options: {
                            A: "HyperText Markdown Language",
                            B: "HighText Machine Language",
                            C: "HyperText Markup Language",
                            D: "None of the above"
                        },
                        correctAnswer: "C",
                        userAnswer: "C",
                        isCorrect: true,
                        explanation: "HTML stands for HyperText Markup Language."
                    },
                    {
                        questionNo: 2,
                        question: "What is the purpose of React?",
                        options: {
                            A: "To style pages",
                            B: "To manage databases",
                            C: "To build user interfaces",
                            D: "To define routes"
                        },
                        correctAnswer: "C",
                        userAnswer: "B",
                        isCorrect: false,
                        explanation: "React is a JavaScript library for building UIs."
                    }
                ],
                createdAt: new Date()
            },
            analysis: {
                summary: "You have a solid grasp of frontend basics, but React fundamentals need improvement.",
                strongTopics: ["HTML", "CSS"],
                weakTopics: ["React", "Component Lifecycle"],
                reasoning: "Incorrect answers were mostly related to React."
            },
            roadmap: {
                roadmap: [
                    {
                        stage: "Beginner",
                        topics: ["HTML", "CSS"],
                        duration: "1 Week",
                        resources: [
                            { title: "HTML Crash Course", url: "https://example.com/html" },
                            { title: "CSS Basics", url: "https://example.com/css" }
                        ],
                        projects: [
                            { name: "Personal Portfolio", description: "A static site built using HTML and CSS." }
                        ]
                    },
                    {
                        stage: "Intermediate",
                        topics: ["JavaScript", "DOM Manipulation"],
                        duration: "2 Weeks",
                        resources: [
                            { title: "JavaScript Guide", url: "https://example.com/js" }
                        ],
                        projects: [
                            { name: "Todo App", description: "An interactive todo list using vanilla JS." }
                        ]
                    }
                ],
                createdAt: new Date()
            },
            createdAt: new Date()
        }
    ]
}

export { dummyUser }