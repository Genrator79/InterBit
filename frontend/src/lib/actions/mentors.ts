import axios from "@/utils/axios";
import type { Mentor, MentorResponse, CreateMentorInput } from "@/types/mentor";


export async function getMentors(): Promise<Mentor[]> {
  try {
    const response = await axios.get<MentorResponse>("/mentors");

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch mentors");
    }

    return response.data.mentors.map((mentor) => ({
      ...mentor,
      // Ensure interviewCount is always a number
      interviewCount: mentor._count?.interviews ?? mentor.interviewCount ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching mentors:", error);
    throw error;
  }
}


export interface CreateMentorResponse {
  success: boolean;
  message: string;
  mentor: Mentor;
}
export async function createMentor(input: CreateMentorInput): Promise<CreateMentorResponse> {
  try {
    if (!input.name || !input.email) {
      throw new Error("Name and email are required");
    }

    const response = await axios.post("/mentors", input);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create mentor");
    }

    return response.data as CreateMentorResponse;
  } catch (error: any) {
    console.error("Error creating mentor:", error);

    // Handle unique constraint error (email already exists)
    if (error.response?.data?.message?.includes("already exists")) {
      throw new Error("A mentor with this email already exists");
    }

    throw new Error("Failed to create mentor");
  }
}

export interface UpdateMentorResponse {
  success: boolean;
  message: string;
  mentor: Mentor;
}

export interface UpdateMentorInput extends Partial<CreateMentorInput> {
  id: string;
}

export async function updateMentor(input: UpdateMentorInput): Promise<UpdateMentorResponse> {
  try {
    if (!input.name || !input.email) {
      throw new Error("Name and email are required");
    }

    const response = await axios.put(`/mentors/${input.id}`, input);

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to update mentor");
    }

    return response.data as UpdateMentorResponse;
  } catch (error: any) {
    console.error("Error updating mentor:", error);

    if (error.response?.data?.message?.includes("already exists")) {
      throw new Error("A mentor with this email already exists");
    }

    throw new Error(error.response?.data?.message || "Failed to update mentor");
  }
}
