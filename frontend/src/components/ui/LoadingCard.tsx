"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export default function LoadingCard({ message = "Loading...", className }: LoadingCardProps) {
  return (
    <div className={cn("flex justify-center items-center w-full h-full min-h-[200px]", className)}>
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border shadow-lg max-w-sm w-full mx-4">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 rounded-2xl pointer-events-none" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="w-10 h-10 text-primary animate-spin relative z-10" />
          </div>

          <div className="space-y-1 text-center">
            <h3 className="font-semibold text-lg tracking-tight text-foreground">
              Please wait
            </h3>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
