import mongoose from "mongoose";

const QuestionLogSchema = new mongoose.Schema({
    questionNo: Number,
    question: String,
    options: {
        A: String,
        B: String,
        C: String,
        D: String
    },
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean,
    explanation: String
});

const QuizLogsSchema = new mongoose.Schema({
    score: Number,
    questions: [QuestionLogSchema],
    createdAt: { type: Date, default: Date.now }
});

const AnalysisSchema = new mongoose.Schema({
    summary: String,
    strongTopics: [String],
    weakTopics: [String],
    reasoning: String
});

const ResourceSchema = new mongoose.Schema({
    title: String,
    url: String
});

const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String
});

const RoadmapStageSchema = new mongoose.Schema({
    stage: String,
    topics: [String],
    duration: String,
    resources: [ResourceSchema],
    projects: [ProjectSchema]
});

const RoadmapSchema = new mongoose.Schema({
    roadmapdata: [RoadmapStageSchema],
    createdAt: { type: Date, default: Date.now }
});

const FlowSchema = new mongoose.Schema({
    flowIdx: Number,
    flowname: String,
    skills: {
        name: [String]
    },
    quizLogs: QuizLogsSchema,
    analysis: AnalysisSchema,
    roadmap: RoadmapSchema,
    createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifycode: {
        type: String,
        default: ''
    },
    verifycodeexpire: {
        type: Date
    },
    isSubscriptionActive: {
        type: Boolean,
        default: false
    },
    flow: [FlowSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});




const Usermodel = mongoose.models.User || mongoose.model("User", UserSchema, "User"); // mongoose.model("User");

export default Usermodel;
