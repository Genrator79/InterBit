"use client "

import React from 'react'
import Navbar from '@/components/Navbar'
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { SettingsIcon } from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats"
const AdminDashboardClient = () => {
  const { user } = useContext(UserContext);

  // calculate stats from real data
  // const stats = {
  //   totalDoctors: doctors.length,
  //   activeDoctors: doctors.filter((doc) => doc.isActive).length,
  //   totalAppointments: appointments.length,
  //   completedAppointments: appointments.filter((app) => app.status === "COMPLETED").length,
  // };

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
        {/* <AdminStats
          totalDoctors={stats.totalDoctors}
          activeDoctors={stats.activeDoctors}
          totalAppointments={stats.totalAppointments}
          completedAppointments={stats.completedAppointments}
        /> */}
      </div>

    </div>
  )
}

export default AdminDashboardClient
