import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
}

interface FeedbackCategoryCardProps {
    category: CategoryScore;
}

export function FeedbackCategoryCard({ category }: FeedbackCategoryCardProps) {
    // Determine color scheme based on score
    let colorClass = "text-red-500";
    let bgClass = "bg-red-500/10";
    let borderClass = "border-red-500/20";
    let progressColor = "bg-red-500";
    let statusText = "Poor";

    if (category.score >= 80) {
        colorClass = "text-emerald-500";
        bgClass = "bg-emerald-500/10";
        borderClass = "border-emerald-500/20";
        progressColor = "bg-emerald-500";
        statusText = "Excellent";
    } else if (category.score >= 50) {
        colorClass = "text-orange-500";
        bgClass = "bg-orange-500/10";
        borderClass = "border-orange-500/20";
        progressColor = "bg-orange-500";
        statusText = "Average";
    }

    return (
        <Card className={cn("border backdrop-blur-sm shadow-md transition-all hover:shadow-lg", borderClass, bgClass)}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-white tracking-wide">
                        {category.name}
                    </CardTitle>
                    <span className={cn("text-sm font-bold px-3 py-1 rounded-full border bg-black/20", colorClass, borderClass)}>
                        {statusText}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/60">
                        <span>Score</span>
                        <span className={cn("font-mono font-bold", colorClass)}>{category.score}/100</span>
                    </div>

                    {/* Custom Progress Bar with colored indicator */}
                    <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div
                            className={cn("h-full transition-all duration-1000 ease-out rounded-full", progressColor)}
                            style={{ width: `${category.score}%` }}
                        />
                    </div>
                </div>

                <p className="text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3">
                    {category.comment}
                </p>
            </CardContent>
        </Card>
    );
}
