import axios from "@/utils/axios";
import { useState } from "react";

export function useCreateFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFeedback = async (params: {
    interviewId: string;
    transcript: Array<{ role: string; content: string }>;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("/feedback/create-feedback", params);

      return res.data;
    } catch (err: any) {
      console.error("Error creating feedback:", err);
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createFeedback, loading, error };
}
