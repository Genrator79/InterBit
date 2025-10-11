"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { CrownIcon } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-background rounded-3xl p-8 mx-6 mt-24 mb-12 border border-primary/20 flex flex-col lg:flex-row items-center gap-8">
        <div className="space-y-4 lg:w-1/2">
          <h1 className="text-5xl font-bold">About Our AI Interview Platform</h1>
          <p className="text-muted-foreground text-lg">
            We empower students and professionals to master coding interviews and
            tech interviews using AI-driven mock sessions, real-time feedback, and mentor guidance.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 w-max">
            <CrownIcon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Innovative & Smart</span>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Image
              priority={true}
              src="/brain.png"
              alt="AI Interview"
              fill
              className="object-contain rounded-full"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold">Our Vision</h2>
          <p className="text-muted-foreground text-lg">
            To create a world where anyone can prepare for interviews with confidence,
            leveraging the power of AI and personalized mentorship.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-4xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground text-lg">
            To deliver intelligent, interactive, and accessible interview preparation
            experiences, helping users succeed in competitive job markets worldwide.
          </p>
        </div>
      </section>

      {/* Image + Callout Section */}
      <section className="bg-primary/10 rounded-3xl mx-6 p-8 border border-primary/20 flex flex-col lg:flex-row items-center gap-8 my-12">
        <div className="lg:w-1/2 relative w-full h-64 lg:h-80 rounded-xl overflow-hidden">
          <Image
            priority={true}
            src="/cta.png"
            alt="Team Collaboration"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="lg:w-1/2 space-y-4">
          <h2 className="text-3xl font-bold">Built by Experts</h2>
          <p className="text-muted-foreground text-lg">
            Our team of AI researchers, software engineers, and interview experts
            constantly refine the platform to ensure top-notch preparation and
            actionable insights for users.
          </p>
        </div>
      </section>
    </>
  );
}
