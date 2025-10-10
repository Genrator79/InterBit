"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import axios from "@/utils/axios";
import { UserContext, User } from "@/context/UserContext";

export interface Interview {
  id: string;
  userName: string;
  userEmail: string;
  mentorName: string;
  mentorImageUrl?: string;
  date: string;
  time: string;
  type: "AI" | "HUMAN";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  duration: number;
  feedback?: string;
  score?: number;
}

export interface BookInterviewInput {
  mentorId?: string;
  date: string;
  time: string;
  type?: "AI" | "HUMAN";
  duration?: number;
}

function transformInterview(interview: any): Interview {
  return {
    id: interview.id,
    userName: interview.user.username,
    userEmail: interview.user.email,
    mentorName: interview.mentor?.name || "AI Interview",
    mentorImageUrl: interview.mentor?.imageUrl || "",
    date: interview.date,
    time: interview.time,
    type: interview.type,
    status: interview.status,
    duration: interview.duration,
    feedback: interview.feedback,
    score: interview.score,
  };
}

// -----------------------------
// Hooks with React Query style naming
// -----------------------------

export function useUserInterviews() {
  const { user } = useContext(UserContext) as { user: User | null };
  const [data, setData] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInterviews = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/interviews/me", { params: { userId: user.id } });
      setData((response.data.interviews || []).map(transformInterview));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch user interviews");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserInterviews();
  }, [fetchUserInterviews]);

  return { user, data, isLoading, error, refetch: fetchUserInterviews };
}

export function useGetAllInterviews() {
  const [data, setData] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/interviews");
      setData(response.data.interviews.map(transformInterview));
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch interviews");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, isLoading, error, refetch: fetchAll };
}

export function useBookInterview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const book = useCallback(async (input: BookInterviewInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/interviews/book", input);
      return transformInterview(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to book interview");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { book, isLoading, error };
}

export function useUpdateInterviewStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (id: string, status: "SCHEDULED" | "COMPLETED" | "CANCELLED") => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.patch(`/interviews/${id}/status`, { status }); 
        return response.data;
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to update interview status");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { updateStatus, isLoading, error };
}

export function useBookedTimeSlots(mentorId: string, date: string) {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId || !date) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/interviews/booked-slots", { params: { mentorId, date } });
        setData(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch booked slots");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [mentorId, date]);

  return { data, isLoading, error };
}

export function useUserInterviewStats() {
  const [data, setData] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/interviews/me/stats");
      setData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch interview stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, isLoading, error, refetch: fetchStats };
}
