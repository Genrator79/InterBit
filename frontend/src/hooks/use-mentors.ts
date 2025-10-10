import { useState, useEffect } from "react";
import type { Mentor } from "@/types/mentor";
import { getMentors, createMentor as createMentorApi, updateMentor as updateMentorApi } from "@/lib/actions/mentors";

interface UseGetMentorsResult {
  data: Mentor[];
  isLoading: boolean;
  error: Error | null;
}

export interface CreateMentorInput {
  name: string;
  email: string;
  phone: string;
  speciality: string;
  bio: string;
  imageUrl?: string;
  isActive?: boolean;
}

export function useGetMentors(): UseGetMentorsResult {
  const [data, setData] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const mentors = await getMentors();
        setData(mentors);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, isLoading, error };
}


interface CreateMentorResponse {
  success: boolean;
  message: string;
  mentor?: Mentor;
}
interface UseCreateMentorResult {
  createMentor: (input: CreateMentorInput) => Promise<CreateMentorResponse | undefined>;
  isLoading: boolean;
  error: Error | null;
}
export function useCreateMentor(): UseCreateMentorResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function createMentor(input: CreateMentorInput) {
    setIsLoading(true);
    setError(null);

    try {
      // Optional: generate avatar if imageUrl not provided
      if (!input.imageUrl && input.name) {
        input.imageUrl = `/api/avatar?name=${encodeURIComponent(input.name)}`;
      }

      const data = await createMentorApi(input);

      // ✅ Ensure the hook returns a consistent response shape
      return {
        success: data.success,
        message: data.message,
        mentor: data.mentor,
      } as CreateMentorResponse;

    } catch (err: any) {
      console.error("Error creating mentor:", err);

      // ✅ Clean error handling for both backend + client messages
      const message =
        err.response?.data?.message ||
        (err.message.includes("already exists")
          ? "A mentor with this email already exists"
          : "Failed to create mentor");

      setError(new Error(message));
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }

  return { createMentor, isLoading, error };
}

export interface UpdateMentorResponse {
  success: boolean;
  message: string;
  mentor?: Mentor;
}

export interface UpdateMentorInput extends Partial<CreateMentorInput> {
  id: string;
}

interface UseUpdateMentorResult {
  updateMentor: (input: UpdateMentorInput) => Promise<UpdateMentorResponse | undefined>;
  isLoading: boolean;
  error: Error | null;
}

export function useUpdateMentor(): UseUpdateMentorResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function updateMentor(input: UpdateMentorInput): Promise<UpdateMentorResponse | undefined> {
    setIsLoading(true);
    setError(null);

    try {
      const res = await updateMentorApi(input); // returns UpdateMentorResponse from API
      return res; // { success, message, mentor }
    } catch (err: any) {
      console.error("Error updating mentor:", err);

      if (err.message.includes("already exists")) {
        setError(new Error("A mentor with this email already exists"));
      } else {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { updateMentor, isLoading, error };
}