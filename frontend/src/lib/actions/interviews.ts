import axios from "@/utils/axios";
import { useContext } from "react";
import { UserContext, User } from "@/context/UserContext";

export interface Interview {
  id: string;
  userName: string;
  userEmail: string;
  mentorName: string;
  mentorImageUrl?: string;
  date?: string;  // Prisma date can be null
  time?: string;  // Prisma time can be null
  type: "AI" | "HUMAN";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  duration: number;
  feedback?: string;
  score?: number;

  // Newly added optional fields from schema
  role?: string;
  level?: string;
  techstack?: string[];
  questions?: string[];
  finalized?: boolean;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookInterviewInput {
  mentorId?: string; // optional for AI interview
  date: string;
  time: string;
  type?: "AI" | "HUMAN";
  duration?: number;
  role?: string;
  level?: string;
  techstack?: string[];
}


// Transform backend response to frontend-friendly structure
export function transformInterview(interview: any): Interview {
  return {
    id: interview.id,
    userName: interview.user?.username || "Unknown User",
    userEmail: interview.user?.email || "",
    mentorName: interview.mentor?.name || "AI Interview",
    mentorImageUrl: interview.mentor?.imageUrl || "",
    date: interview.date ? new Date(interview.date).toISOString() : undefined,
    time: interview.time || "",
    type: (interview.type === "HUMAN" ? "HUMAN" : "AI") as "AI" | "HUMAN",
    status: interview.status as "SCHEDULED" | "COMPLETED" | "CANCELLED",
    duration: interview.duration,
    feedback: interview.feedback || "",
    score: interview.score ?? undefined,

    // new fields (optional)
    role: interview.role || "",
    level: interview.level || "",
    techstack: interview.techstack || [],
    questions: interview.questions || [],
    finalized: interview.finalized ?? false,
    coverImage: interview.coverImage || "",
    createdAt: interview.createdAt ? new Date(interview.createdAt).toISOString() : undefined,
    updatedAt: interview.updatedAt ? new Date(interview.updatedAt).toISOString() : undefined,
  };
}


// -----------------------------
// Hooks and Functions
// -----------------------------

export function useUserInterviews() {
  const { user } = useContext(UserContext) as { user: User | null };

  // Fetch interviews for logged-in user
  async function fetchUserInterviews(): Promise<Interview[]> {
    if (!user) throw new Error("User not logged in");

    try {
      const response = await axios.get(`/interviews/me`, {
        params: { userId: user.id }, // pass user id to backend
      });
      return response.data.map(transformInterview);
    } catch (error: any) {
      console.error("Error fetching user interviews:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to fetch your interviews");
    }
  }
  return { user, fetchUserInterviews };
}

// Fetch all interviews (admin/general)
export async function getAllInterviews(): Promise<Interview[]> {
  try {
    const response = await axios.get("/interviews");
    return response.data.map(transformInterview);
  } catch (error: any) {
    console.error("Error fetching interviews:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to fetch interviews");
  }
}

// Get user interview stats
export async function getUserInterviewStats(): Promise<{ total: number; completed: number }> {
  try {
    const response = await axios.get("/interviews/me/stats");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching interview stats:", error.response?.data || error.message);
    return { total: 0, completed: 0 };
  }
}

// Fetch booked time slots for a mentor
export async function getBookedTimeSlots(mentorId: string, date: string): Promise<string[]> {
  try {
    const response = await axios.get(`/interviews/booked-slots`, {
      params: { mentorId, date },
    });
    return response.data.slots;
  } catch (error: any) {
    console.error("Error fetching booked time slots:", error.response?.data || error.message);
    return [];
  }
}

// Book a new interview
export async function bookInterview(input: BookInterviewInput): Promise<Interview> {
  try {
    const response = await axios.post("/interviews/book", input);
    return transformInterview(response.data);
  } catch (error: any) {
    console.error("Error booking interview:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to book interview");
  }
}

// Update interview status (admin or mentor)
export async function updateInterviewStatus(
  id: string,
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED"
) {
  try {
    const response = await axios.patch(`/interviews/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    console.error("Error updating interview status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to update interview status");
  }
}
