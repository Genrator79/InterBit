import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { MicIcon, CalendarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MainActions() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* AI Mock Interview Assistant */}
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardContent className="relative p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image src="/brain.png" alt="AI Mock Interview" width={32} height={32} className="w-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">AI Mock Interview</h3>
              <p className="text-muted-foreground">Practice coding, HR, and system design interviews with real-time AI feedback</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Real-time AI evaluation & scoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Includes coding, behavioral & system design rounds</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Available 24/7 — anytime, anywhere</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/ai-interview"
            className={buttonVariants({
              variant: "default",
              className:
                "w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
            })}
          >
            <MicIcon className="mr-2 h-5 w-5" />
            Start Mock Interview
          </Link>
        </CardContent>
      </Card>

      {/* Book Human Interview */}
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <CardContent className="relative p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image src="/calendar.png" alt="Book Interview" width={32} height={32} className="w-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Book Human Interview</h3>
              <p className="text-muted-foreground">Schedule a live session with experienced mentors & interviewers</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Expert mentors from top tech companies</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Flexible scheduling based on your availability</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm">Personalized feedback after each session</span>
            </div>
          </div>

          {/* CTA Button */}
          <Link href="/interviews">
            <Button
              variant="outline"
              className="w-full mt-6 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              Schedule Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
