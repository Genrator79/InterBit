"use client";

import { Loader2 } from "lucide-react";

interface LoadingCardProps {
  message?: string;
}

export default function LoadingCard({ message = "Loading..." }: LoadingCardProps) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        className="flex flex-col items-center justify-center gap-6
                   w-[80%] max-w-2xl h-[70%] max-h-[400px]
                   bg-gradient-to-br from-primary/10 to-primary/5
                   border border-primary/20 rounded-2xl shadow-xl
                   animate-bounce-slow p-6 relative overflow-hidden"
      >
        {/* Spinner background pulse */}
        <span className="absolute w-28 h-28 rounded-full bg-primary/10 animate-pulse-scale opacity-40"></span>

        {/* Spinner */}
        <div className="relative w-20 h-20 flex items-center justify-center rounded-full">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>

        {/* Loading message */}
        <p className="text-sm md:text-base font-medium text-muted-foreground text-center z-10">
          {message}
        </p>

        {/* Pulse bar */}
        <div className="h-1 w-32 bg-primary/30 rounded-full animate-pulse z-10" />

        {/* Bouncing dots */}
        <div className="flex gap-2 mt-2 z-10">
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce-delay animate-pulse-scale"></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce-delay animation-delay-150 animate-pulse-scale"></span>
          <span className="w-2 h-2 bg-primary rounded-full animate-bounce-delay animation-delay-300 animate-pulse-scale"></span>
        </div>
      </div>
    </div>
  );
}
