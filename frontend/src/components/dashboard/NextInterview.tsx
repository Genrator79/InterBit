"use client";

import { useUserInterviews } from "@/hooks/use-interviews";
import { parseISO, isAfter, isSameDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import NoNextInterviews from "./NoNextInterview"

export default function NextInterview() {
    const { user, data: interviews, isLoading, refetch } = useUserInterviews();

    if (!user) return null; // user not logged in
    if (isLoading) return <p className="text-sm text-muted-foreground">Loading interviews...</p>;

    // filter upcoming scheduled interviews
    const upcomingInterviews = interviews.filter(interview => {
        const date = parseISO(interview.date);
        const today = new Date();
        const isUpcoming = isSameDay(date, today) || isAfter(date, today);
        return isUpcoming && interview.status === "SCHEDULED";
    });

    const nextInterview = upcomingInterviews[0];

    if (!nextInterview) return <NoNextInterviews />;

    const interviewDate = parseISO(nextInterview.date);
    const formattedDate = format(interviewDate, "EEEE, MMMM d, yyyy");
    const isToday = isSameDay(interviewDate, new Date());

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="size-5 text-primary" />
                    Next Interview
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-primary">
                            {isToday ? "Today" : "Upcoming"}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {nextInterview.status}
                    </span>
                </div>

                {/* Interview Details */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <UserIcon className="size-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{nextInterview.mentorName}</p>
                            <p className="text-xs text-muted-foreground">
                                {nextInterview.type === "AI" ? "AI Mock Interview" : "Live session with Mentor"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="size-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{formattedDate}</p>
                            <p className="text-xs text-muted-foreground">{isToday ? "Today" : format(interviewDate, "EEEE")}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <ClockIcon className="size-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{nextInterview.time}</p>
                            <p className="text-xs text-muted-foreground">Local time</p>
                        </div>
                    </div>
                </div>

                {/* More Interviews Count */}
                {upcomingInterviews.length > 1 && (
                    <p className="text-xs text-center text-muted-foreground">
                        +{upcomingInterviews.length - 1} more upcoming interview
                        {upcomingInterviews.length > 2 ? "s" : ""}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
