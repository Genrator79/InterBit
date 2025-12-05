import axios from "@/utils/axios";

interface CreateFeedbackParams {
    interviewId: string;
    userId: number; // Changed from string to number based on context
    transcript: Array<{ role: string; content: string }>;
    feedbackId?: string; // Optional, might not be used in new flow but keeping for compatibility
}

export async function createFeedback(params: CreateFeedbackParams) {
    try {
        const { interviewId, transcript } = params;

        const res = await axios.post("/feedback/create-feedback", {
            interviewId,
            transcript,
        });

        if (res.data.success) {
            return { success: true, feedbackId: res.data.interviewId }; // Mapping interviewId to feedbackId as expected by component
        }
        return { success: false };

    } catch (error) {
        console.error("Error creating feedback:", error);
        return { success: false, error: "Failed to create feedback" };
    }
}
