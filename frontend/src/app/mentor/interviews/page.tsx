"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import { useUserInterviews, useUpdateInterviewStatus, Interview } from "@/hooks/use-interviews";
import { format } from "date-fns";
import { toast } from "sonner";
import LoadingCard from "@/components/ui/LoadingCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MentorInterviewsPage() {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const { data: interviews, isLoading, refetch } = useUserInterviews();
    const { updateStatus, isLoading: isUpdating } = useUpdateInterviewStatus();

    // Redirect if not mentor
    useEffect(() => {
        if (user && user.role !== "MENTOR") {
            router.push("/dashboard");
        }
    }, [user, router]);

    if (!user) return null;

    const pendingInterviews = interviews.filter(i => i.status === "PENDING" && i.mentorEmail === user.email);
    const acceptedInterviews = interviews.filter(i => i.status === "ACCEPTED" && i.mentorEmail === user.email);
    const completedInterviews = interviews.filter(i => i.status === "COMPLETED" && i.mentorEmail === user.email);
    const rejectedInterviews = interviews.filter(i => i.status === "REJECTED" && i.mentorEmail === user.email);

    const handleStatusUpdate = async (id: string, newStatus: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
        try {
            await updateStatus(id, newStatus);
            toast.success(`Interview marked as ${newStatus}`);
            refetch();
        } catch (error: any) {
            console.error("Status update error:", error);
            const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to update status";
            toast.error(errorMessage);
        }
    };

    const InterviewCard = ({ interview, actions }: { interview: Interview; actions?: React.ReactNode }) => (
        <div className="bg-card border rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-semibold text-lg">{interview.role}</h3>
                        <p className="text-sm text-muted-foreground">{interview.type} Interview</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${interview.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        interview.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                            interview.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {interview.status}
                    </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                    <p><strong>Candidate:</strong> {interview.userName} ({interview.userEmail})</p>
                    <p><strong>Date:</strong> {interview.date ? format(new Date(interview.date), "PPP") : "N/A"}</p>
                    <p><strong>Time:</strong> {interview.time}</p>
                    <p><strong>Duration:</strong> {interview.duration} mins</p>
                    {interview.techstack.length > 0 && (
                        <p><strong>Tech Stack:</strong> {interview.techstack.join(", ")}</p>
                    )}
                </div>
            </div>

            {actions && (
                <div className="pt-2 border-t mt-2 flex gap-2 justify-end">
                    {actions}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
                <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
                <p className="text-muted-foreground mb-8">Manage your interview requests</p>

                {isLoading ? (
                    <LoadingCard message="Loading interviews..." />
                ) : (
                    <div className="space-y-10">
                        {/* Pending Requests */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                Pending Requests ({pendingInterviews.length})
                            </h2>
                            {pendingInterviews.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {pendingInterviews.map(interview => (
                                        <InterviewCard
                                            key={interview.id}
                                            interview={interview}
                                            actions={
                                                <>
                                                    <Button variant="destructive" size="sm" onClick={() => handleStatusUpdate(interview.id, "REJECTED")} disabled={isUpdating}>
                                                        Reject
                                                    </Button>
                                                    <Button variant="default" size="sm" onClick={() => handleStatusUpdate(interview.id, "ACCEPTED")} disabled={isUpdating}>
                                                        Accept
                                                    </Button>
                                                </>
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No pending requests.</p>
                            )}
                        </section>

                        {/* Upcoming / Accepted */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Upcoming Interviews ({acceptedInterviews.length})
                            </h2>
                            {acceptedInterviews.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {acceptedInterviews.map(interview => (
                                        <InterviewCard
                                            key={interview.id}
                                            interview={interview}
                                            actions={
                                                <Button className="w-full" variant="outline" size="sm" onClick={() => handleStatusUpdate(interview.id, "COMPLETED")} disabled={isUpdating}>
                                                    Mark as Completed
                                                </Button>
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No upcoming interviews.</p>
                            )}
                        </section>

                        {/* Completed */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                Completed History ({completedInterviews.length})
                            </h2>
                            {completedInterviews.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {completedInterviews.map(interview => (
                                        <InterviewCard key={interview.id} interview={interview} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No completed interviews yet.</p>
                            )}
                        </section>

                        {/* Rejected History (Optional to show, mostly for record) */}
                        <section>
                            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Rejected History</h2>
                            {rejectedInterviews.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75">
                                    {rejectedInterviews.map(interview => (
                                        <InterviewCard key={interview.id} interview={interview} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No rejected interviews.</p>
                            )}
                        </section>

                    </div>
                )}
            </div>
        </div>
    );
}
