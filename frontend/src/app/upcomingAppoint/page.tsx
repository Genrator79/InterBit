"use client";

import { useUserInterviews } from "@/hooks/use-interviews";
import { parseISO, isAfter, isSameDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react";
import { Interview } from "@/hooks/use-interviews";
import LoadingCard from "@/components/ui/LoadingCard"
export default function UpcomingInterviewsPage() {
  const { user, data: interviews, isLoading, error } = useUserInterviews();

  if (!user) return <p>Please log in to see your interviews.</p>;
  if (isLoading) return <LoadingCard message="Loading Your Upcoming interviews..." />;
  if (error) return <p className="text-red-500">{error}</p>;

  const upcomingInterviews = (interviews as Interview[])
    .filter((interview) => {
      if (!interview.date) return false;
      const interviewDateTime = new Date(interview.date);
      if (interview.time) {
        const [hours, minutes] = interview.time.split(":").map(Number);
        interviewDateTime.setHours(hours, minutes ?? 0, 0, 0);
      }
      const now = new Date();
      return (
        interview.status === "SCHEDULED" &&
        (isSameDay(interviewDateTime, now) || isAfter(interviewDateTime, now))
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingInterviews.length === 0) return <p>No upcoming interviews.</p>;

  return (
    <div className="space-y-4 p-4">
      {upcomingInterviews.map((interview, index) => {
        const interviewDate = parseISO(interview.date);
        const formattedDate = format(interviewDate, "EEEE, MMMM d, yyyy");
        const isToday = isSameDay(interviewDate, new Date());

        return (
          <Card key={interview.id} className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="size-5 text-primary" />
                {`Interview ${index + 1}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <UserIcon className="size-4 text-primary" />
                <div>
                  <p className="font-medium">{interview.mentorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {interview.type === "AI" ? "AI Mock Interview" : "Live session with Mentor"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="size-4 text-primary" />
                <div>
                  <p>{formattedDate}</p>
                  <p className="text-xs text-muted-foreground">{isToday ? "Today" : format(interviewDate, "EEEE")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ClockIcon className="size-4 text-primary" />
                <div>
                  <p>{interview.time}</p>
                  <p className="text-xs text-muted-foreground">Local time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
