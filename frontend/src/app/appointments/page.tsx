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


    const { data: userInterviews = [], isLoading } = useUserInterviews();
    const { book: bookInterview, isLoading: isBooking } = useBookInterview();

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

            {/* Show existing interviews */}
            {isLoading ? (
                <div className="mb-8 max-w-7xl mx-auto px-6 py-8 flex justify-center">
                    <LoadingCard message="Loading your upcoming interviews..." />
                </div>
            ) : userInterviews.length > 0 ? (
                <div className="mb-8 max-w-7xl mx-auto px-6 py-8">
                    <h2 className="text-xl font-semibold mb-4">Your Upcoming Interviews</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userInterviews.map((interview) => (
                            <div key={interview.id} className="bg-card border rounded-lg p-4 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                                        <img
                                            src={interview.mentorImageUrl}
                                            alt={interview.mentorName}
                                            className="size-10 rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{interview.mentorName}</p>
                                        <p className="text-muted-foreground text-xs">{interview.type}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">
                                        📅 {interview.date
                                            ? format(new Date(interview.date), "MMM d, yyyy")
                                            : "Date not set"}
                                    </p>
                                    <p className="text-muted-foreground">
                                        🕐 {interview.time || "Time not set"}
                                    </p>
                                    <p className="text-muted-foreground">🕐 {interview.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mb-8 max-w-7xl mx-auto px-6 py-8 text-center text-muted-foreground">
                    <p>No upcoming interviews found.</p>
                </div>
            )}

        </>
    );
}

export default InterviewsPage;
