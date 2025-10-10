import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Calendar, Clock } from "lucide-react";

interface AdminStatsProps {
  totalMentors: number;
  activeMentors: number;
  totalInterviews: number;
  completedInterviews?: number; // optional if you track completed interviews
}

function AdminStats({
  totalMentors,
  activeMentors,
  totalInterviews,
  completedInterviews,
}: AdminStatsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {/* Total Mentors */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalMentors}</div>
              <div className="text-sm text-muted-foreground">Total Mentors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Mentors */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <UserCheck className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeMentors}</div>
              <div className="text-sm text-muted-foreground">Active Mentors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Interviews */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalInterviews}</div>
              <div className="text-sm text-muted-foreground">Total Interviews</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Interviews (optional) */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedInterviews ?? 0}</div>
              <div className="text-sm text-muted-foreground">Completed Interviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export { AdminStats };
