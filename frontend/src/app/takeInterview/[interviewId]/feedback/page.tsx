import { redirect } from "next/navigation";
import { fetchInterviewByIdServer } from "@/lib/actions/fetchInterviewById";
import FeedbackDisplay from "@/components/dashboard/FeedbackDisplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

interface RouteParams {
    params: {
        interviewId: string;
    };
}

export default async function FeedbackPage({ params }: RouteParams) {
    const { interviewId } = await params;
    const interview = await fetchInterviewByIdServer(interviewId);

    if (!interview) {
        return redirect("/ai-interview");
    }

    // Ensure feedback exists and is in the right format
    // If no feedback yet, maybe redirect or show "Processing..."
    // But this page should generally only be accessed after feedback generation.
    if (!interview.feedback) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Feedback not found</h2>
                <p className="text-muted-foreground mb-6">The feedback for this interview has not been generated yet.</p>
                <Link href={`/takeInterview/${interviewId}`}>
                    <Button>Go Back to Interview</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-10 px-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link href="/ai-interview" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4">
                    <ArrowLeftIcon className="size-4" />
                    Back to Interviews
                </Link>

                <div>
                    <h1 className="text-3xl font-bold">{interview.role} Interview Feedback</h1>
                    <p className="text-muted-foreground mt-1">
                        Completed on {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <FeedbackDisplay feedback={interview.feedback} />
            </div>
        </div>
    );
}
