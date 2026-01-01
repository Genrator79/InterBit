"use client";

import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { InterviewConfirmationModal } from "@/components/interviews/InterviewsConformationModel";
import InterviewConfirmationStep from "@/components/interviews/InterviewConfirmationStep";
import MentorSelectionStep from "@/components/interviews/MentorSelectionStep";
import ProgressSteps from "@/components/interviews/ProgressStep";
import TimeSelectionStep from "@/components/interviews/TimeSelectionStep";
import Navbar from "@/components/Navbar";
import { useBookInterview, useUserInterviews } from "@/hooks/use-interviews";
import { INTERVIEW_TYPES } from "@/lib/utils";
import { format } from "date-fns";
import { useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import LoadingCard from "@/components/ui/LoadingCard";

function InterviewsPage() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    // Redirect effect
    useEffect(() => {
        if (user === null) {
            router.push("/login");
        }
    }, [user, router]);

    const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [currentStep, setCurrentStep] = useState(1); // 1: select mentor, 2: select time, 3: confirm
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [bookedInterview, setBookedInterview] = useState<any>(null);


    const { data: userInterviews = [], isLoading, refetch } = useUserInterviews();
    const { book: bookInterview, isLoading: isBooking } = useBookInterview();

    const [activeTab, setActiveTab] = useState("upcoming");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const upcomingInterviews = userInterviews.filter(
        (i) => i.status === "PENDING" || i.status === "ACCEPTED"
    );

    const historyInterviews = userInterviews.filter(
        (i) =>
            i.status === "COMPLETED" ||
            i.status === "REJECTED" ||
            i.status === "CANCELLED"
    );

    const filteredHistory = historyInterviews.filter((i) => {
        if (statusFilter === "ALL") return true;
        return i.status === statusFilter;
    });

    // If user is loading, render nothing (safe)
    if (user === undefined) return null;

    const handleSelectMentor = (mentorId: string) => {
        setSelectedMentorId(mentorId);
        setSelectedDate("");
        setSelectedTime("");
        setSelectedType("");
    };

    const handleBookInterview = async () => {
        if (!selectedDate || !selectedTime) {
            toast.error("Please fill in date and time");
            return;
        }

        const interviewType = INTERVIEW_TYPES.find((t) => t.id === selectedType);

        try {
            const interview = await bookInterview({
                userId: user!.id,                     // always defined
                mentorId: selectedMentorId || null,  // null for AI interviews
                date: selectedDate,
                time: selectedTime,
                type: selectedType || "AI",           // default if not selected
                duration: interviewType
                    ? Number(interviewType.duration)
                    : 30,                               // fallback duration
            });

            setBookedInterview(interview);

            // Send confirmation email
            // try {
            //     await fetch("/api/send-interview-email", {
            //         method: "POST",
            //         headers: { "Content-Type": "application/json" },
            //         body: JSON.stringify({
            //             mentorName: interview.mentorName,
            //             interviewDate: format(new Date(interview.date), "EEEE, MMMM d, yyyy"),
            //             interviewTime: interview.time,
            //             interviewType: interviewType?.name || interview.type,
            //             duration: interviewType?.duration || interview.duration,
            //             price: interviewType?.price,
            //         }),
            //     });
            // } catch (error) {
            //     console.error("Error sending confirmation email:", error);
            // }

            // REFRESH LIST
            refetch();

            setShowConfirmationModal(true);
            setSelectedMentorId(null);
            setSelectedDate("");
            setSelectedTime("");
            setSelectedType("");
            setCurrentStep(1);
        } catch (err: any) {
            toast.error(`Failed to book interview: ${err.message}`);
        }
    };

    console.log("userInterviews:", userInterviews);

    const InterviewCard = ({ interview }: { interview: any }) => (
        <div key={interview.id} className="bg-card border rounded-lg p-4 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
                <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                    <img
                        src={interview.mentorImageUrl}
                        alt={interview.mentorName}
                        className="size-10 rounded-full object-cover"
                    />
                </div>
                <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate" title={interview.mentorName}>{interview.mentorName}</p>
                    <p className="text-muted-foreground text-xs truncate">{interview.type}</p>
                </div>
                <div className="ml-auto shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${interview.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                        interview.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                            interview.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                        }`}>
                        {interview.status}
                    </span>
                </div>
            </div>
            <div className="space-y-1 text-sm mt-auto">
                <p className="text-muted-foreground flex items-center gap-2">
                    <span>📅</span>
                    {interview.date
                        ? format(new Date(interview.date), "MMM d, yyyy")
                        : "Date not set"}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                    <span>🕐</span>
                    {interview.time || "Time not set"}
                </p>
            </div>
            {interview.status === "ACCEPTED" && (
                <div className="mt-3 pt-3 border-t text-xs text-center text-muted-foreground">
                    Link will be available 10m before
                </div>
            )}
        </div>
    );

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Book an Interview</h1>
                    <p className="text-muted-foreground">
                        Schedule and book sessions with verified mentors
                    </p>
                </div>

                <ProgressSteps currentStep={currentStep} />

                {currentStep === 1 && (
                    <MentorSelectionStep
                        selectedMentorId={selectedMentorId}
                        onContinue={() => setCurrentStep(2)}
                        onSelectMentor={handleSelectMentor}
                    />
                )}

                {currentStep === 2 && selectedMentorId && (
                    <TimeSelectionStep
                        selectedMentorId={selectedMentorId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                        onDateChange={setSelectedDate}
                        onTimeChange={setSelectedTime}
                        onTypeChange={setSelectedType}
                    />
                )}

                {currentStep === 3 && selectedMentorId && (
                    <InterviewConfirmationStep
                        selectedMentorId={selectedMentorId}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        selectedType={selectedType}
                        isBooking={isBooking}
                        onBack={() => setCurrentStep(2)}
                        onModify={() => setCurrentStep(2)}
                        onConfirm={handleBookInterview}
                    />
                )}
            </div>

            {bookedInterview && (
                <InterviewConfirmationModal
                    open={showConfirmationModal}
                    onOpenChange={setShowConfirmationModal}
                    interviewDetails={{
                        mentorName: bookedInterview.mentorName,
                        interviewDate: bookedInterview.date
                            ? format(new Date(bookedInterview.date), "EEEE, MMMM d, yyyy")
                            : "Unknown date",
                        interviewTime: bookedInterview.time,
                        userEmail: bookedInterview.userEmail,
                    }}
                />
            )}

            {/* Interviews Section with Tabs */}
            <div className="max-w-7xl mx-auto px-6 py-8 border-t">
                <div className="flex items-center gap-6 mb-6">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`text-lg font-semibold pb-2 border-b-2 transition-colors ${activeTab === "upcoming"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Upcoming Interviews
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`text-lg font-semibold pb-2 border-b-2 transition-colors ${activeTab === "history"
                            ? "border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        History
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <LoadingCard message="Loading interviews..." />
                    </div>
                ) : (
                    <>
                        {activeTab === "upcoming" && (
                            <div>
                                {upcomingInterviews.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {upcomingInterviews.map((interview) => (
                                            <InterviewCard key={interview.id} interview={interview} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                                        <p>No upcoming interviews found.</p>
                                        <p className="text-sm mt-1">Book a session to get started!</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div>
                                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                                    {["ALL", "COMPLETED", "REJECTED", "CANCELLED"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === status
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-background text-muted-foreground border-border hover:border-primary/50"
                                                }`}
                                        >
                                            {status === "ALL" ? "All History" : status}
                                        </button>
                                    ))}
                                </div>

                                {filteredHistory.length > 0 ? (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {filteredHistory.map((interview) => (
                                            <InterviewCard key={interview.id} interview={interview} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
                                        <p>No past interviews found with {statusFilter === 'ALL' ? 'any' : statusFilter.toLowerCase()} status.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default InterviewsPage;
