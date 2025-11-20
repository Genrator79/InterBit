"use client";

import { useContext, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { UserContext } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { useUserInterviews, useGetAllInterviews } from "@/hooks/use-interviews";
import LoadingCard from "@/components/ui/LoadingCard";
import Navbar from "@/components/Navbar";


export default function HomePage() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    // Redirect unauthenticated user
    useEffect(() => {
        if (user === null) router.push("/login");
    }, [user, router]);

    const {
        data: userInterviews = [],
        isLoading: loadingUserInterviews,
    } = useUserInterviews();

    const reversedInterviews = [...userInterviews].reverse();
    // ⭐ FIX: your hook returns full response
    const {
        data: allInterviewsResponse,
        isLoading: loadingAllInterviews,
    } = useGetAllInterviews();

    // Prevent flashing undefined state
    if (user === undefined) return null;

    const loading = loadingUserInterviews || loadingAllInterviews;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
                <div className="max-w-7xl mx-auto px-6 pt-10 pb-24">

                    {/* HERO SECTION */}
                    <section className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6 mb-20">
                        <div className="flex flex-col gap-6 max-w-xl">
                            <h2 className="text-4xl font-bold leading-tight">
                                Get Interview-Ready with <br /> AI-Powered Practice & Feedback
                            </h2>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                Practice real interview questions & get instant feedback using our
                                smart AI interview system.
                            </p>

                            <Button asChild className="btn-primary w-full md:w-fit mt-2">
                                <Link href="/interview">Start an Interview</Link>
                            </Button>
                        </div>

                        <Image
                            src="/robot.png"
                            width={400}
                            height={400}
                            alt="robot"
                            className="hidden md:block"
                        />
                    </section>

                    {/* AVAILABLE INTERVIEWS */}
                    <section className="mt-10">
                        <h2 className="text-2xl font-semibold mb-6">Your Interviews</h2>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <LoadingCard message="Loading available interviews..." />
                            </div>
                        ) : reversedInterviews.length > 0 ? (
                            <div
                                className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                gap-8
              "
                            >
                                {reversedInterviews.map((interview) => (
                                    <InterviewCard
                                        key={interview.id}
                                        interviewId={interview.id}
                                        role={interview.role}
                                        type={interview.type}
                                        techstack={interview.techstack}
                                        createdAt={interview.createdAt}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                No interviews available at the moment.
                            </p>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
