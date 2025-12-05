import { Loader2 } from "lucide-react";

export default function FeedbackLoading() {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative bg-background p-4 rounded-2xl border border-primary/20 shadow-lg">
                    <Loader2 className="size-10 text-primary animate-spin" />
                </div>
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-foreground">
                Generating Feedback
            </h2>
            <p className="mt-2 text-muted-foreground text-center max-w-sm">
                Our AI is analyzing your interview performance, evaluating your answers, and preparing structured feedback.
            </p>

            <div className="mt-8 flex gap-2">
                <span className="size-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="size-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="size-2 bg-primary/40 rounded-full animate-bounce" />
            </div>
        </div>
    );
}
