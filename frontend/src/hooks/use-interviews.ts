"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import axios from "@/utils/axios";
import { UserContext, User } from "@/context/UserContext";
import { getBookedTimeSlots } from "@/lib/actions/interviews"

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
  userId: number;       // must always be present
  mentorId?: string | null;    // optional if AI interview
  date: string;         // "YYYY-MM-DD"
  time: string;         // "HH:mm"
  type: string;         // e.g., "AI", "HUMAN", or any string your backend accepts
  duration?: number;    // optional, will default to 60 if not provided
}

export function transformInterview(data: any) {
  return {
    id: data.id,
    userName: data.user?.username || "Unknown",
    userEmail: data.user?.email || "unknown@example.com",
    mentorName: data.mentor?.name || (data.type === "AI" ? "AI Mentor" : "Unknown"),
    date: data.date ? new Date(data.date).toISOString() : null, // convert to ISO string
    time: data.time,
    type: data.type,
    duration: data.duration,
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
    if (!input.userId) {
      throw new Error("User ID is required");
    }

    // Default values
    const payload = {
      ...input,
      type: input.type || "AI",           // default type
      duration: input.duration || 60,     // default duration
      mentorId: input.mentorId || null,   // null for AI interviews
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/interviews/book", payload);
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

export function useBookedSlots(mentorId: string, date: string) {
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mentorId || !date) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const slots = await getBookedTimeSlots(mentorId, date); // use the action
        setData(slots);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch booked slots");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [mentorId, date]);

  return { data, isLoading, error };
}

export function useUserInterviewStats() {
  const { user } = useContext(UserContext) as { user: User | null };
  const [data, setData] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/interviews/me/stats", {
        params: { userId: user.id }
      });
      setData(response.data.stats);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to fetch interview stats");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!user) {
    return { data: { total: 0, completed: 0 }, isLoading: false, error: null, refetch: fetchStats };
  }

  return { data, isLoading, error, refetch: fetchStats };
}

