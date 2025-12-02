"use client";

import { useContext, useEffect, useState } from "react";
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

    const {
        data: allInterviewsResponse,
        isLoading: loadingAllInterviews,
    } = useGetAllInterviews();

    // -----------------------------
    // ✅ FILTER STATES
    // -----------------------------
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedTech, setSelectedTech] = useState("");

    // -----------------------------
    // ✅ FILTER LOGIC
    // -----------------------------
    const filteredInterviews = reversedInterviews.filter((item) => {
        const matchRole =
            selectedRole === "" ||
            item.role?.toLowerCase().includes(selectedRole.toLowerCase());

        const matchType =
            selectedType === "" ||
            item.type.toLowerCase() === selectedType.toLowerCase();

        const matchTech =
            selectedTech === "" ||
            item.techstack.some((t) =>
                t.toLowerCase().includes(selectedTech.toLowerCase())
            );

        return matchRole && matchType && matchTech;
    });

    // -----------------------------
    // ✅ PAGINATION (AFTER FILTERING)
    // -----------------------------
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const totalPages = Math.ceil(filteredInterviews.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedInterviews = filteredInterviews.slice(start, start + itemsPerPage);

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

                        {/* ----------------------
                            FILTER UI
                        ----------------------- */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">

                            {/* Role Search */}
                            <input
                                type="text"
                                placeholder="Search by role..."
                                className="border p-2 rounded-md w-full md:w-1/3"
                                value={selectedRole}
                                onChange={(e) => {
                                    setSelectedRole(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            {/* Type Dropdown */}
                            <select
                                className="border p-2 rounded-md w-full md:w-1/3"
                                value={selectedType}
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Types</option>
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="system">System Design</option>
                            </select>

                            {/* Tech Stack Search */}
                            <input
                                type="text"
                                placeholder="Filter by tech stack..."
                                className="border p-2 rounded-md w-full md:w-1/3"
                                value={selectedTech}
                                onChange={(e) => {
                                    setSelectedTech(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <LoadingCard message="Loading available interviews..." />
                            </div>
                        ) : filteredInterviews.length > 0 ? (
                            <>
                                {/* INTERVIEW CARDS */}
                                <div
                                    className="
                                        grid 
                                        grid-cols-1 
                                        sm:grid-cols-2 
                                        lg:grid-cols-3 
                                        gap-8
                                    "
                                >
                                    {paginatedInterviews.map((interview) => (
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

                                {/* PAGINATION */}
                                <div className="flex justify-center mt-10 gap-4 items-center">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </Button>

                                    <span className="px-4 py-2">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground">
                                No interviews match your filters.
                            </p>
                        )}
                    </section>

                </div>
            </div>
        </div>
    );
}
