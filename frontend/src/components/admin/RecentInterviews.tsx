"use client";

import { Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { useGetAllInterviews, useUpdateInterviewStatus } from "@/hooks/use-interviews";

export function RecentInterviews() {
  const { data: interviews = [], isLoading, refetch } = useGetAllInterviews();
  const { updateStatus } = useUpdateInterviewStatus();

  const handleToggleInterviewStatus = async (id: string) => {
    const interview = interviews.find((i) => i.id === id);
    if (!interview) return;

    const newStatus =
      interview.status === "SCHEDULED" ? "COMPLETED" : "SCHEDULED";

    try {
      await updateStatus(id, newStatus);
      await refetch(); // 👈 Refresh interviews after backend update
    } catch (err) {
      console.error("Failed to update interview:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) return <div>Loading interviews...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent Interviews
        </CardTitle>
        <CardDescription>Manage and monitor all scheduled interviews</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {interviews.map((interview) => (
                <TableRow key={interview.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{interview.userName}</div>
                      <div className="text-sm text-muted-foreground">
                        {interview.userEmail}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{interview.mentorName}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {new Date(interview.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">{interview.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{interview.type}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => handleToggleInterviewStatus(interview.id)}
                    >
                      {getStatusBadge(interview.status)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
