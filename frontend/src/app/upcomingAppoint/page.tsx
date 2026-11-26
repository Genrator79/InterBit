"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useUserInterviews, Interview } from "@/hooks/use-interviews";
import { parseISO, isAfter, isSameDay, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ClockIcon, UserIcon, ArrowLeftIcon } from "lucide-react";
import LoadingCard from "@/components/ui/LoadingCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UpcomingInterviewsPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { data: interviews, isLoading, error } = useUserInterviews();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  if (user === undefined) return null;

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
        (interview.status === "ACCEPTED" || interview.status === "PENDING") &&
        (isSameDay(interviewDateTime, now) || isAfter(interviewDateTime, now))
      );
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8 pt-24 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold">Upcoming Interviews</h1>
          <p className="text-muted-foreground mt-1">
            View all your scheduled and confirmed interview appointments
          </p>
        </div>

        {isLoading ? (
          <LoadingCard message="Loading your upcoming interviews..." />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : upcomingInterviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl p-8">
            <CalendarIcon className="size-12 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-semibold">No upcoming interviews</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              You do not have any pending or accepted interviews scheduled.
            </p>
            <div className="flex justify-center gap-3">
              <Link href="/appointments">
                <Button>Book a Mentor Session</Button>
              </Link>
              <Link href="/interview">
                <Button variant="outline">Try AI Interview</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => {
              const interviewDate = parseISO(interview.date);
              const formattedDate = format(interviewDate, "EEEE, MMMM d, yyyy");
              const isToday = isSameDay(interviewDate, new Date());

              return (
                <Card
                  key={interview.id}
                  className="border-primary/20 bg-gradient-to-br from-primary/5 to-background"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarIcon className="size-5 text-primary" />
                        {interview.role ? `${interview.role} Interview` : `Interview ${index + 1}`}
                      </CardTitle>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          interview.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                      >
                        {interview.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserIcon className="size-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{interview.mentorName}</p>
                        <p className="text-xs text-muted-foreground">
                          {interview.type === "AI" ? "AI Mock Interview" : "Live session with Mentor"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarIcon className="size-4 text-primary" />
                      <div>
                        <p className="text-sm">{formattedDate}</p>
                        <p className="text-xs text-muted-foreground">
                          {isToday ? "Today" : format(interviewDate, "EEEE")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ClockIcon className="size-4 text-primary" />
                      <div>
                        <p className="text-sm">{interview.time}</p>
                        <p className="text-xs text-muted-foreground">
                          {interview.duration ? `${interview.duration} mins` : "Standard duration"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
