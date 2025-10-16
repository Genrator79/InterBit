"use client";

import { useContext } from "react";
import { UserContext, User } from "@/context/UserContext";
import { useUserInterviewStats } from "@/hooks/use-interviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BrainIcon, MessageSquareIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import LoadingCard from "@/components/ui/LoadingCard"

export default function InterviewOverview() {
  const { user } = useContext(UserContext) as { user: User | null };
  const { data: stats, isLoading, error } = useUserInterviewStats();

  if (!user) return null;

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainIcon className="size-5 text-primary" />
          Your Interview Progress
        </CardTitle>
        <CardDescription>Track your interview journey and performance</CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <LoadingCard message="Loading Stats ..." />
        ) : error ? (
          <div className="text-center text-red-500 py-6">{error}</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed Interviews</div>
              </div>

              <div className="text-center p-4 bg-muted/30 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Interviews</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                  <MessageSquareIcon className="size-5 text-primary" />
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-1">
                    Ready for your next interview?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Book a mock interview or try our AI Interview Assistant for instant practice and feedback.
                  </p>
                  <div className="flex gap-2">
                    <Link href="/ai-interview">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Try AI Interview
                      </Button>
                    </Link>
                    <Link href="/appointments">
                      <Button size="sm" variant="outline">
                        Book Interview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
