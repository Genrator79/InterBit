"use client "

import React from 'react'
import Navbar from '@/components/Navbar'
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { SettingsIcon } from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats"
import { useGetMentors } from "@/hooks/use-mentors";
import { useGetAllInterviews } from "@/hooks/use-interviews"
import { RecentInterviews } from "@/components/admin/RecentInterviews"
import MentorsManagement from '@/components/admin/MentorManagement';

const AdminDashboardClient = () => {
  const { user } = useContext(UserContext);
  const { data: mentors = [], isLoading: mentorsLoading, error } = useGetMentors();
  const { data: interviews = [], isLoading: interviewsLoading } = useGetAllInterviews();

  // calculate stats from real data
  const stats = {
    totalMentors: mentors.length,
    activeMentors: mentors.filter((mentor) => mentor.isActive).length,
    totalInterviews: interviews.length,
    completedInterviews: interviews.filter((i) => i.status === "COMPLETED").length
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* ADMIN WELCOME SECTION */}
        <div className="mb-12 flex items-center justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Admin Dashboard</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.username || "Admin"}!!
              </h1>
              <p className="text-muted-foreground">
                Streamline interviews, manage candidates, and monitor recruitment performance with AI.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>
        <AdminStats
          totalMentors={stats.totalMentors}
          activeMentors={stats.activeMentors}
          totalInterviews={stats.totalInterviews}
          completedInterviews={stats.completedInterviews} // only if you track completed interviews
        />

        <MentorsManagement />

        <RecentInterviews />
      </div>

    </div>
  )
}

export default AdminDashboardClient
