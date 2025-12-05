import axios from "axios";
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

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedback/create-feedback`,
        params
      );

      return res.data;
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { createFeedback, loading, error };
}
