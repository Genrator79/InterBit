import React from 'react'
import Navbar from '@/components/Navbar'
import MainActions from "@/components/dashboard/MainActions"
import WelcomeSection from "@/components/dashboard/WelcomeSection"
import ActivityOverview from '@/components/dashboard/ActivityOverview'

const page = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <WelcomeSection />
        <MainActions />
        <ActivityOverview />
      </div>
    </div>
  )
}

export default page
