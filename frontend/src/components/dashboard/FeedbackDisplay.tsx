import { Feedback } from "@/hooks/use-interviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrophyIcon, CheckCircle2Icon, AlertTriangleIcon } from "lucide-react";
import { FeedbackCategoryCard } from "./FeedbackCategoryCard";

interface FeedbackDisplayProps {
    feedback: Feedback;
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
    if (!feedback) return null;

    return (
        <div className="space-y-8 w-full max-w-full">
            {/* Overview Section */}
            <Card className="border-indigo-500/20 bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-white">
                        <TrophyIcon className="size-6 text-yellow-400" />
                        Interview Result
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* Total Score */}
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="relative size-40 flex items-center justify-center rounded-full border-[6px] border-indigo-500/20 bg-black/20 shadow-inner">
                                <div className="text-5xl font-bold text-white tracking-tighter">{feedback.totalScore}</div>
                                <div className="absolute top-8 right-8 text-xs font-semibold text-white/50">
                                    /100
                                </div>
                            </div>
                            <p className="mt-3 font-medium text-indigo-300 uppercase tracking-widest text-sm">Total Score</p>
                        </div>

                        {/* Assessment */}
                        <div className="flex-1 space-y-3 bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h3 className="font-semibold text-lg text-indigo-400">Final Assessment</h3>
                            <p className="text-white/80 leading-relaxed text-base">
                                {feedback.finalAssessment}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Category Breakdown - Full Width Stack */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Parameter Analysis
                </h2>
                <div className="flex flex-col gap-6">
                    {feedback.categoryScores.map((cat, idx) => (
                        <FeedbackCategoryCard key={idx} category={cat} />
                    ))}
                </div>
            </div>

            {/* Strengths & Weaknesses - Full Width Stack */}
            <div className="flex flex-col gap-6">
                {/* Strengths */}
                <Card className="border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md w-full">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-emerald-400">
                            <CheckCircle2Icon className="size-5" />
                            Key Strengths
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {feedback.strengths.map((strength, i) => (
                                <li key={i} className="flex gap-3 text-sm text-white/80 items-start">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    {strength}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-red-500/20 bg-red-950/20 backdrop-blur-md w-full">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-red-400">
                            <AlertTriangleIcon className="size-5" />
                            Areas for Improvement
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {feedback.areasForImprovement.map((area, i) => (
                                <li key={i} className="flex gap-3 text-sm text-white/80 items-start">
                                    <span className="text-red-500 mt-1">•</span>
                                    {area}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
